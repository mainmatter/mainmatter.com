---

---

Redis wants to migrate the Redis Query Engine from C to Rust, and Mainmatter has been working with them on this project. They've rewritten some of their code to rust already, but this kind of work requires good strategy for both choosing candidates for rewrites and for matching the complex behavior and performance characteristics of the original C code.

## Choosing a Candidate & Real World Mess

TODO: Ideal module graph

Module graph decomposition lets us pick at leaf modules that have no dependencies (that haven't yet been ported) and pick them as candidates for easy rewrites.

This lets us rewrite one module at a time and export a C FFI for the C code that will depend on it, and depend on the already rewritten stuff as rust modules.

But real world code is messier!

TODO: Real-world module graph

The module dependency of a real-world codebase makes it near impossible to untangle. We run out of viable leaf nodes very quickly, if we even start with them.

To rewrite something in situ we will need to hook into the C FFI for exporting **and** importing functionality.

## Case Study: Triemap

A triemap is a data structure that has a similar API as a hash map / btree map but is optimized for key prefix compression and the ability to do key searches.

<!-- Diagram -->

We can imagine how to do this easily in Rust, we just need to store a data structure in the form:

```rust
struct TrieMapNode<T> {
    label: Vec<u8>,
    children: Vec<TrieMapNode<T>,
    data: Option<T>,
}
```

Very simple stuff! We can cascade down nodes from the root to complete the labels of leaves, the data field is optional as labels can branch without having an appropriate piece of data at the branch point. A map with only "Scarborough" and "Scaffolding" in it doesn't have data for "Sca".

Let's have a look at the C implementation:

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

TODO: Diagram of the C memory layout, or pointing to the video.

This is a complex type, and translating it to Rust is difficult. Translating it to safe Rust is impossible, but that doesn't mean we can't translate it _safely_.

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

This implementation makes no attempt to match the performance characteristics of the C original. We have extra heap allocations for labels and children.

What we get from this baseline is code that works correctly, knowledge of performance characteristics, and a team that has a deeper understanding of the original implementation. 

This working, tested, naive version and refresh of what the original was doing lowers the cognitive load when it comes to the team implementing a later version.

This first step in the porting strategy left us with 1. Total test coverage of what we were working on and 2. Knowledge of how subpar the performance of this naive TrieMap implementation.

TODO: Diagram of performance, violin chart.

Our implementation was twice as slow as the original C implementation, but about half as slow as an off-the-shelf crate from crates.io. Our implementation was also far less consistent in its speed, whereas the C implementation had very little variance. All of the Vecs we used also meant the memory usage of the naive implementation was double that of the original.

## Porting Strategy: Iterating for Performance

Having learnt as much as we could from the naive implementation, we can now start working to match the original.

We established that the core characteristic of the original TrieMap implementation is how each node occupies _a single heap allocation_. The label, array of pointers to children, and field data occupy the same contiguous space in memory.

We want to get as close to this original implementation as possible, but if we can make it simpler to maintain then we should. To this end, we decided to abandon the `pack` pragma to avoid dealing with unaligned accesses. CPUs are are optimized for aligned access, so this should mean a negligible trade-off in memory footprint in exchange for speed. 

We want our implementation to have the following properties:

1. Each node takes up a single heap allocation.
2. The layout is padded, unlike the packed original.

We designed out layout to be as follows:

TODO: Show the Rust Layout

TODO: Explain differences in layout

### DIY Dynamically Sized Types

We want nodes to be a Dynamically Sized Type, like `&str` or `&[u8]`. Something whose size is not known at compile-time.

Our ideal rust implementation would look something like this:

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

but we cannot express this in rust's type system. So instead, we split up the implementation into a stack type and a heap type. The stack type `Node<T>` stores the pointer, and the heap type `NodeHeader` stores our data as if it were `IdealNode<T>`.

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

Note that in `NodeHeader` we can't express everything we want to in the type system. Instead, we avoid defining them directly and make sure to manually allocate them ourselves.

### Allocating a Dynamically Sized Type

The `alloc` function has the signature:

```rust
pub unsafe fn alloc(layout: Layout) -> *mut u8
```

Rather than C's `malloc` which takes a length in bytes, `alloc` takes a `Layout` type that represents the size and alignment of an allocation.

`Layout` exposes a fairly simple API, and we can define a layout to suit our complex needs at runtime.

1. `Layout::new` produces a layout for a sized type.
2. `Layout::array` produces a layout for an array of a sized type, with a runtime-or-const `n` elements. 
2. `Layout::extend` allows us to compose layouts together.

This composable API of `Layout` means it's fairly easy to build the `Layout` we need for our custom Dynamically Sized Type.

## Porting Strategy: Managing Necessary Unsafe

Once we have our `Layout`, we can call `alloc` to get our pointer. This memory is uninitialized, but we can initialize it manually. Managing this memory manually only gets gnarly once we want to split or merge nodes.s

In the final codebase we were finally left with **128** unsafe blocks and **21** unsafe methods.

Managing this unsafe code requires care and understanding for how developers will interact with it. Preferably a developer won't interact with it at all unless they're a maintainer. 

On top of all this, the client is moving to rust to minimize issues related to memory safety so it is important to build an API that can be trusted and can't be misused.

To deal with these constraints, we have a core axiom of **no `unsafe` in the public API**, on top of trying to rely on tooling as much as possible.

### Tooling & Patterns 

1. Miri

Miri runs your rust code in an interpreter against different memory models, checking for undefined behavior as it comes up. A great help when we're writing lots of unsafe code. 

This only works on Rust code, so we can't apply this in other parts of Rust Redis where we cross FFI boundaries into C libraries, but we can use it here and anywhere else where all dependencies are rust.

2. Debug assertions

Debug assertions are checks that only run in debug builds, release builds do not pay the performance cost of them. Debug assertions let us check the invariants we want to build our API around at runtime and give good errors when those assertions fail.

Heavy use of debug assertions ties nicely with our use of Miri, whose errors can be overly esoteric or academic. Rust assertions are much easier to contextualize.

3. Clippy Lints

Following [Jack Wrenn's guidance](https://jack.wrenn.fyi/blog/safety-hygiene/) we're using clippy lints to enforce two soft invariants:

3.1: `undocumented_unsafe_blocks`: If an unsafe block does not have comments surrounding it, there will be a warning.

3.2: `multiple_unsafe_ops_per_block`: If an unsafe block contains more than one unsafe operation, there will be a warning.

This pushes developers in the direction of properly documenting the unsafe code they do right, operation by operation, to assure all invariants are documented.

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

Note how long this safety comment is, with 128 unsafe blocks in the codebase this could become an overwhelming amount of information very quickly. This is where the following component of our unsafe management strategy comes in.

### Hard to Misuse Abstractions

We build a hierarchy of abstractions to make sure that the further away from the raw allocation APIs we are, the fewer mistakes we can make.

To do this, we want to make sure that there are as few invariants as possible for a maintainer to uphold at any point with few-to-zero ways to unknowingly break those invariants.

We do this by **Layering Abstractions** in a way that gradually reduces the concerns of a maintainer.

**Bottom**: `alloc`, `Layout`, and pointers.

This is the information we get from naive use of `alloc`. Invariants need to be manually upheld for all operations at this level. At this level, many different 

**Near-Bottom**: `PtrMetadata<T>` + `PtrWithMetadata<T>`

At this level, we have the metadata needed to construct a pointer (`PtrMetadata`, which holds a `Layout` and the offsets of the fields not tracked by the ), as well as a version of the constructed pointer that is paired with its metadata. This pairing means a proof of the relationship between the pointer and the metadata of that pointer only needs to happen once, when `PtrWithMetadata` is constructed using the unsafe methods that construct it.

**Mid-Level**: Unsafe methods and functions.

At this layer we're developing methods and functions that perform unsafe operations but have API surfaces which are much more specialized for the tasks we're using them for.  

**Top**: The Safe API

Finally, we have the safe API surrounding the data structure that we want end users to actually use.

## Conclusion

This implementation is now in production in the Redis Query Engine!

TODO Details on how the final implementation differed in performance.

Real-world codebases on the level of complexity of the Redis Query Engine require looking carefully into how complex components can be replaced with alternative implementations that better fit the needs of maintainers and users.

What we get from a rewrite is more than just a codebase translated to a new language. A rewrite is an opportunity for an engineering team to relearn and re-contextualize the core problems that existing code exists to solve, to learn what's important about the building blocks of the software they're developing.

A rewrite is also an opportunity to reassess assumptions. In the original implementation we had a packed layout, we questioned that assumption and went with a different direction, as well as making other small changes in the memory layout of the data structure. Challenging these assumptions paid off, as our new implementation is faster and has a negligible increase in memory use.

We could have stopped at our naive implementation, failing the client on performance. We could have wrapped large areas of the codebase in unsafe, failing the client on maintainability. We could have come in with a new data structure entirely, failing the client on the performance assumptions made in the rest of their codebase.

The success of this rewrite in terms of speed, performance, and future maintainability is a consequence of taking the client's needs seriously and keeping an open mind on digesting the problems current code solved.