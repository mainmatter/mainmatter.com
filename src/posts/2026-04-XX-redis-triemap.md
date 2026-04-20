---

---

At Mainmatter we've been working to help Redis migrate the Redis Query Engine from C to Rust. They've ported some of their existing query engine code already, but this kind of work requires good strategy in both choosing good rewrite candidates and matching the complex behavior and performance characteristics of the original C code.

This blog post covers 

## Case Study: Porting the TrieMap

A TrieMap is a key-value data structure that has a similar API as a Hashmap / Binary Tree Map, but optimized for compressing keys by their shared prefixes.

![Diagram showing how a set of tuples are represented in a TrieMap.](/assets/images/posts/2026-04-XX-redis-triemap/trie.svg)

We can easily imagine how to do this in Rust, we just need to store a data structure in the form:

```rust
struct TrieMapNode<T> {
    label: Vec<u8>,
    children: Vec<TrieMapNode<T>,
    // The data that the label "maps" to.
    // This is optional, because not all nodes have complete keys with associated data.
    data: Option<T>,
}
```

Very simple stuff! We can "cascade" down nodes from the root to complete the labels of leaves. The data field is optional as labels can branch without having an appropriate piece of data at the branch point: a map with only the key-value pairs `"Scarborough": 42` and `"Scaffolding": 451` doesn't have associated data for their shared parent `"Sca"`.

Let's take a look at the preexisting C implementation:

```c
#pragma pack(1)
typedef struct {
    uint16_t labelLen;
    uint16_t numChildren : 9; 
    uint8_t flags : 7; 
    void *data;
    char label[];
    //... here come the first letters of each child 
    //... now come the children pointers
} TrieMapNode;

#pragma pack()
```

The core property of this type is that the fields, label, and the array of pointers to children take up a **single heap allocation**. This is really important for cache locality and minimizing pointer dereferences, but it also means the size of the type and some of the offsets of the fields of that type are not known at compile time.

Note how this type is not fully definable in C's type system, the two lines of comments here are fields that we can't define in a C struct definition and need to compute how to access at runtime. `labelLen` and `numChildren` let us do these computations.

![](/assets/images/posts/2026-04-XX-redis-triemap/c-layout.svg)

This is a complex type, and translating it to Rust is difficult. As we've said already, it can't even be fully specified in C's type system. Translating it to safe Rust is impossible, but that doesn't mean we can't translate it _safely_.

## Porting Strategy: Establish a Baseline

The first component of our strategy was establishing a baseline implementation of the `TrieMap`, exposing the public API we want to exist at the end of the project and building out an extensive benchmark + test suite.

```rust
#[repr (C)]
struct Node<T> {
    // LowMemoryThinVec uses u16 for capacity, not usize.
    // This is still separate heap allocated data though.
    label: LowMemoryThinVec<u8>,
    children: LowMemoryThinVec<ChildRef<T>>, 
    data: Option<T>,
}

#[repr (C)]
struct ChildRef<T> {
    first_byte: u8, 
    node: Node<T>,
}
```

This implementation makes no attempt to match the performance characteristics of the C original, so we have extra heap allocations for labels and children to maintain the simplicity.

Building off of this naive implementation, we can design an external API that can be tested and benchmarked. This working, tested, naive version and refresh of what the original was doing lowers the cognitive load when it comes to the team implementing a later version.

We didn't focus on performance, because that wasn't what this initial information-gathering pass was about. But we might as well make the comparisons we can so we know how important the optimization work will be:

![](/assets/images/posts/2026-04-XX-redis-triemap/violin-chart.svg)

Our implementation was twice as slow as the original C implementation, but about half as slow as an off-the-shelf crate from crates.io. Our implementation was also far less consistent in its speed, whereas the C implementation had very little variance. All the instances of `Vec` we used also meant the memory usage of the naive implementation was double that of the original.

This first step in the porting strategy left us with 1. Total test coverage of what we were working on 2. Knowledge of how subpar the performance of this naive TrieMap implementation and 3. A team that has a deeper understanding of the original implementation and the decisions behind it.

## Porting Strategy: Iterating for Performance

Having learnt as much as we could from the naive implementation, we can now start working to match the original in performance.

We established that the core characteristic of the original TrieMap implementation is how each node occupies _a single heap allocation_. The label, array of pointers to children, and field data occupy the same contiguous space in memory.

We want to get as close to this original implementation as possible, but if we can make it simpler to maintain then we should. To this end, we decided to abandon the `pack` pragma to avoid dealing with unaligned accesses. CPUs are optimized for aligned access, so this should mean a negligible trade-off in memory footprint in exchange for speed. 

The layout we ended up designing is as follows:

![](/assets/images/posts/2026-04-XX-redis-triemap/rust-layout.svg)

There are a couple of differences between our Rust layout and the original C layout:

1. The data structure is padded, so depending on the number of children there may be unused space between the end of `children_first_bytes` and `children`.
2. Our optional leaf data sits at the end of the struct, rather than before the label and children.

How are we supposed to implement this in Rust? We do it with designing our own Dynamically Sized Types.

### DIY Dynamically Sized Types

We want nodes to be a Dynamically Sized Type, like `str` or `[u8]` (note the lack of `&`). Something whose size is not known at compile-time.

Our ideal Rust implementation would look something like this:

```rust
#[repr(C)]
struct IdealNode<T> {
    label_len: u16, 
    n_children: u8, 
    label: [u8; self.label_len], 
    children_first_bytes: [u8; self.n_children], 
    children: [*Node<T>; self.n_children], 
    data: Option<T>
}
```

But we cannot express this in Rust's type system. So instead, we split up the implementation into a stack type and a heap type. The stack type `Node<T>` stores the pointer so we can get our `IdealNode<T>`-like API, and the heap type `NodeHeader` stores our dynamically-sized heap-allocated data.

```rust
// Stack
pub(crate) struct Node<T> {
    ptr: NonNull<NodeHeader>,
    _phantom: PhantomData<T>,
}

// Heap
#[repr(C)]
#[derive(Clone, Copy, Debug)]
pub(super) struct NodeHeader {
    pub label_len: u16,
    pub n_children: u8,
    // ...where are the other fields?
}
```

Note that in `NodeHeader`, just like in the C implementation, we can't express everything we want to in the type system. Instead, we avoid defining them directly and make sure to manually allocate them ourselves.

### Allocating a Dynamically Sized Type

The `std::alloc::alloc` function has the signature:

```rust
pub unsafe fn alloc(layout: Layout) -> *mut u8
```

Rather than C's `malloc` which takes a length in bytes, `alloc` takes a `Layout` type that represents the size and alignment of an allocation.

`Layout` exposes a fairly simple API, and we can define a layout to suit our complex needs at runtime.

1. `Layout::new` produces a layout for a sized type.
2. `Layout::array` produces a layout for an array of a sized type, with a runtime-or-const `n` elements. 
3. `Layout::extend` allows us to compose layouts together.

This composable API of `Layout` means it's fairly easy to build the `Layout` we need for our custom Dynamically Sized Type.

## Porting Strategy: Managing Necessary Unsafe

Once we have our `Layout`, we can call `alloc` to get our pointer. This memory is uninitialized, but we can initialize it manually. Managing this memory manually only gets gnarly once we want to split or merge nodes.

In the final codebase we were finally left with **128** unsafe blocks and **21** unsafe methods.

Managing this unsafe code requires care and understanding for how developers will interact with it. Preferably a developer won't interact with it at all unless they're a maintainer. 

On top of all this, the client is moving to Rust to minimize issues related to memory safety so it is important to build an API that can be trusted and can't be misused.

To deal with these constraints, we have a core axiom of **no `unsafe` in the public API**, on top of trying to rely on tooling as much as possible.

### Tooling & Patterns

Our management of the unsafe code is a mix of good documentation practices for critical areas & automated tooling. We can't fully automate this process, which is why we have to resort to `unsafe`, but we can do our best to build and maintain certainty.

1. **Miri**

Miri runs your rust code in an interpreter against different memory models, checking for undefined behavior as it comes up. A great help when we're writing lots of unsafe code.

This only works on Rust code, so we can't apply this in other parts of Rust Redis where we cross FFI boundaries into C libraries, but we can use it here and anywhere else where all dependencies are rust.

2. **Debug assertions**

Debug assertions are checks that only run in debug builds, release builds do not pay the performance cost of them. Debug assertions let us both specify and check the invariants we want to build our API around at runtime, and give good errors when those assertions fail.

Heavy use of debug assertions ties nicely with our use of Miri, whose errors can be overly esoteric or academic. Rust assertions are much easier to contextualize.

3. **Clippy Lints**

Following [Jack Wrenn's guidance](https://jack.wrenn.fyi/blog/safety-hygiene/) we're using clippy lints to enforce two soft invariants:

- 3.1: `undocumented_unsafe_blocks`: If an unsafe block does not have comments surrounding it, there will be a warning.

- 3.2: `multiple_unsafe_ops_per_block`: If an unsafe block contains more than one unsafe operation, there will be a warning.

This pushes developers in the direction of properly documenting the unsafe code they do write, operation by operation, to assure all invariants are documented.

### Safety Comments

Following more of Wrenn's guidance, we're also making sure that each safety comment mentions invariants as a list for easy comparison. 

Enumerated safety comments differ between call sites and declaration sites. Declaration sites need to show the assumptions made (invariants) about inputs and context. Call sites need to explain how those invariants are met, one by one.

```rust
// SAFETY:
// - The source range is all contained within a single allocation.
// - The destination range is all contained within a single allocation.
// - We have exclusive access to the destination buffer, since it was allocated earlier in this function.
// - No one else is mutating the source buffer, since this function owns it.
// - Both source and destination pointers are well aligned, see [PtrMetadata::children_ptr]
// - The two buffers don't overlap. The destination buffer was freshly allocated earlier in this function.
unsafe {
    child_ptr.children().ptr().copy_from_nonoverlapping(
        old_ptr.children().ptr(),
        child_header.n_children as usize,
    )
};
```

Note how long this safety comment is, with 128 unsafe blocks in the codebase this could become an overwhelming amount of information very quickly. This is where the next component of our unsafe management strategy comes in.

### Abstractions That Are Hard to Misuse

Unsafe doesn't let users or maintainers do "anything", but it does let them get away with misusing the tools they're given in ways that make software systems unpredictable.

To strengthen systems built on unsafe foundations, we start by **Layering Abstractions** in a way that gradually reduces the concerns of a maintainer.

The end goal is to have a outwardly safe API, and a internal implementation that restricts what mistakes a maintainer to specific areas of the code. Core, most-unsafe operations are built upon by still-unsafe abstractions that limit the operations the maintainer can perform, and those abstractions are built upon by more-safe abstractions.

**Bottom**: `alloc`, `Layout`, and pointers.

At this level, maintainer error is at its most possible. Invariants need to be manually upheld for all operations at this level. We want to minimize the amount of code that uses these tools directly.

**Near-Bottom**: `PtrMetadata<T>` + `PtrWithMetadata<T>`

At this level, we have the metadata needed to construct a pointer (`PtrMetadata`, which holds a `Layout` and the offsets of the fields not tracked by the ), as well as a version of the constructed pointer that is paired with its metadata. This pairing means a proof of the relationship between the pointer and the metadata of that pointer only needs to happen once, when `PtrWithMetadata` is constructed using the unsafe methods that construct it.

**Mid-Level**: Unsafe methods and functions.

At this layer we're developing methods and functions that perform unsafe operations but have API surfaces which are much more specialized for the tasks we're using them for. This is where we try to keep most of the internal API of the TrieMap.  

**Top**: The Safe API

Finally, we have the safe API surrounding the data structure that we want end users to actually use. This doesn't expose any `unsafe`, as per our requirements.

## Conclusion

This implementation is now in production in the Redis Query Engine! We can note & measure some key changes in the codebase from this transition.

|| C | Rust |
|-|-|-|
|Lines of Code|~1k|~1.9k|
|Unsafe expressions|-|128|
|Coverage|82.8%|95.6%|
|Microbenchmarks|❌|✅|
|Performance|(baseline)|25% to 100% improvement in core operations|

One interesting part of this is how the codebase doubled in size. Moving to a rust codebase sometimes comes with the expectation of a more expressive, smaller codebase. With a move to a Rust codebase the unsafe operations have been confined to an area of the code a fraction of the size of the C codebase, where unsafe operations could have been happening anywhere. But expressing that 

Test coverage was greatly improved, the last percentage points in coverage are in unreachable areas.

Performance was also greatly improved, in part from moving away from the packed layout.

Real-world codebases on the level of complexity of the Redis Query Engine require looking carefully into how complex components can be replaced with alternative implementations that better fit the needs of maintainers and users.

What we get from a rewrite is more than just a codebase translated to a new language. A rewrite is an opportunity for an engineering team to relearn and re-contextualize the core problems that existing code exists to solve, to learn what's important about the building blocks of the software they're developing.

A rewrite is also an opportunity to reassess assumptions. In the original implementation we had a packed layout, we questioned that assumption and went with a different direction, as well as making other small changes in the memory layout of the data structure. Challenging these assumptions paid off, as our new implementation is faster and has a negligible increase in memory use.

We could have stopped at our naive implementation, failing the client on performance. We could have wrapped large areas of the codebase in unsafe, failing the client on maintainability. We could have come in with a new data structure entirely, failing the client on the performance assumptions made in the rest of their codebase.

The success of this rewrite in terms of speed, performance, and future maintainability is a consequence of taking the client's needs seriously and keeping an open mind while digesting the problems existing code solved.