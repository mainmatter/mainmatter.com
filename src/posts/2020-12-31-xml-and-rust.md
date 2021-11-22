---
title: 'XML parsing in Rust'
authorHandle: tobiasbieniek
tags: rust
bio: 'Senior Software Engineer'
og:
  image: /assets/images/posts/2020-12-31-xml-and-rust/og-image.png
tagline: |
  <p>Last week we spent some time researching the current state of <a href="https://en.wikipedia.org/wiki/XML">XML</a> parsing and writing in the <a href="https://www.rust-lang.org">Rust</a> ecosystem. For a small side project we needed to read an XML file and turn its content into regular Rust <code>structs</code>. This blog post is a summary of what approaches we looked into, their tradeoffs and what we finally decided to use.</p>
---

The first thing we did when researching this topic was to go to [crates.io] and
search for "XML". The first result is the [`xml`](https://crates.io/crates/xml)
crate, but with only one v0.0.1 release and not a lot of downloads that didn't
seem like a good candidate. Looking further there was also
[`xml-rs`](https://crates.io/crates/xml-rs) with 4 million downloads total. That
seemed more encouraging so we looked into it.

[crates.io]: https://crates.io

The README of `xml-rs` says that it was inspired by the "Java Streaming API for
XML (StAX)" and that it contains a "pull parser". What does that mean? 🤔

## Streaming XML Events

Generally, there are two different ways of parsing XML, and in Rust there are
actually three, all of which we will try to explain in this post. The first one,
and the one that all the others are built upon, is the event stream approach. In
this case the parser looks at the XML file character by character and triggers
events after certain things have been read. Let's look at a quick example:

```xml
<DocumentElement param="value">
     <FirstElement>
         Some Text
     </FirstElement>
     <SecondElement param2="something">
         Pre-Text <Inline>Inlined text</Inline> Post-text.
     </SecondElement>
</DocumentElement>
```

If we read this short XML file using `xml-rs`:

```rust
let parser = xml::reader::EventReader::new(file);
for event in parser {
    println!("{:?}", event.unwrap());
}
```

We are presented with the following stream of events:

```
StartDocument(1.0, UTF-8, None)
StartElement(DocumentElement, {"": "", "xml": "http://www.w3.org/XML/1998/namespace", "xmlns": "http://www.w3.org/2000/xmlns/"}, [param -> value])
Whitespace()
StartElement(FirstElement, {"": "", "xml": "http://www.w3.org/XML/1998/namespace", "xmlns": "http://www.w3.org/2000/xmlns/"})
Characters(Some Text)
EndElement(FirstElement)
Whitespace()
StartElement(SecondElement, {"": "", "xml": "http://www.w3.org/XML/1998/namespace", "xmlns": "http://www.w3.org/2000/xmlns/"}, [param2 -> something])
Characters(Pre-Text)
StartElement(Inline, {"": "", "xml": "http://www.w3.org/XML/1998/namespace", "xmlns": "http://www.w3.org/2000/xmlns/"})
Characters(Inlined text)
EndElement(Inline)
Characters(Post-text.)
EndElement(SecondElement)
Whitespace()
EndElement(DocumentElement)
EndDocument
```

This approach of reading XML is quite low-level, since we would need to write a
lot of code to continuously transform this stream of events into Rust `structs`.
It does have its advantages though, because it allows us to read and parse files
that are much larger than the available memory of our machine. Sometimes,
[when all you have is a 38GB XML file](https://usethe.computer/posts/14-xmhell.html),
this can be very much worth it.

While looking some more into streaming XML parsers for Rust, we noticed that
there is also the [`quick-xml`](https://crates.io/crates/quick-xml) crate. As
the name says, it is quick, and by quick we mean 10-50 times faster than
`xml-rs`! 😱

For our particular use case speed is not that important and the files are
usually only a couple of megabytes, but if we had to decide between `xml-rs` and
`quick-xml` we certainly would use the latter in the future.

## DOM parsing

"DOM" stands for "Document Object Model" and is the second parsing approach that
we want to look at. As we mentioned before, this approach is based on the
streaming events approach, and turns those events into a generic tree of XML
elements.

In the Rust ecosystem, there appear to be two major crates for this:
[`xmltree`](https://crates.io/crates/xmltree) and
[`minidom`](https://crates.io/crates/minidom). The former is based on `xml-rs`,
while `minidom` is based on `quick-xml` instead. That alone should already say
enough about the speed differences between the two crates. In our tests
`minidom` was significantly faster than `xmltree`, and we did not find any
significant disadvantages over `xmltree` so let's focus on `minidom` for now.

We will use the same example XML file as above, but this time we will parse it
using the minidom crate:

```rust
let root: minidom::Element = string.parse().unwrap();
println!("{:#?}", root);
```

These two lines of code will produce something roughly like this:

```
Element {
    prefix: None,
    name: "DocumentElement",
    namespaces: NamespaceSet(parent: None),
    attributes: {
        "param": "value",
    },
    children: [
        Text(),
        Element({
            name: "FirstElement",
            attributes: {},
            children: [Text("Some Text")],
        }),
        Text(),
        Element({
            name: "SecondElement",
            attributes: { "param2": "something" },
            children: [
                Text("Pre-Text"),
                Element({
                    name: "Inline",
                    attributes: {},
                    children: [Text("Inlined text")],
                }),
                Text("Post-text."),
            ],
        }),
        Text(),
    ],
}
```

The `Element` is a `struct` provided by the `minidom` crate and it easily allows
us to read the name of the root element, or the content of the child elements.
Ultimately, this is very similar to how the DOM in the browser works.

This approach does have one disadvantage though, it needs to read the whole file
into memory to create this tree of elements. This means that it is not suited
when parsing huge XML files that simply don't fit into the memory of your
machine. But, most XML files are probably not dozens of gigabytes in size, so
depending on your use case, this tradeoff might be worth the simplified code
that it results in.

## `serde`

"Deserialization" is essentially just another word for "parsing", and if we are
talking about deserializing data then there is one crate in the Rust ecosystem
that can't be ignored: [`serde`](https://crates.io/crates/serde).

`serde` can be used with a variety of different serializers and deserializers
and allows us to parse files directly into Rust `structs`.

For our particular use case there is a crate called
[`serde-xml-rs`](https://crates.io/crates/serde-xml-rs), which integrates
`xml-rs` with `serde`. But `xml-rs` is so slooooow! Luckily there is also an
alternative that uses `quick-xml`, and it is... `quick-xml` itself. The
`quick-xml` crate has an optional `serialize` feature which directly provides
`serde` integration.

The code to use `quick-xml` with `serde` looks something roughly like this:

```rust
#[derive(Debug, Deserialize)]
struct Document {
    param: Option<String>,
    first_element: String,
    second_element: SecondElement,
}

let doc: Document = quick_xml::de::from_str(xml).unwrap();
```

First, we define a `Document` struct, and we declare that a `Deserialize`
implementation should be derived for it using the `derive` feature of `serde`.
Then we use the `serde` integration of `quick-xml` to deserialize our XML string
to a `Document` instance.

This is nice, because it automatically can produce a parsing error when the
`<FirstElement>` is missing inside the `<DocumentElement>`. But it has one small
flaw, it does not differentiate between attributes on an element and the child
elements of an element. If we were to serialize this `struct` back to XML it
would actually turn the `param` into a `<Param>value</Param>` child element. 😥

Unfortunately, it looks like this is currently something that is hard to
implement properly with `serde` itself. Due to this, there are a number of
serde-like crates, specifically for the purpose of supporting XML. Some examples
of this are [`strong-xml`](https://crates.io/crates/strong-xml) and
[`yaserde`](https://crates.io/crates/yaserde). These crates allow you to put a
specific attribute on the field in the `struct` (e.g. `#[yaserde(attribute)]`),
which tells the serializer to write this as an element attribute, instead of a
child node.

The primary advantage of this approach is that you can directly parse your data
into `structs` that match the types of the data that your parsing, compared to
the generic `Element` struct that you get when you parse it into a DOM
structure. For example, you can specify `foo: i32`, and if the XML has a `foo`
attribute that does not parse into a number you will get a parse error. If you
are certain about the format of your data then this might be a good approach to
use, but it does have the disadvantage of being less flexible in terms of
partially broken data.

In our use case we needed to read a file with multiple records inside of it. We
can't be sure that each record is valid, but if we hit an invalid record we
would still like to be able to use the other records, so the structure we would
like to have is something like this:

```rust
struct Document {
    records: Vec<Result<Record, Error>>
}
```

It seems that all the serde-like crates currently don't support this kind of
error recovery, so if you need it then your best bet is probably to use the DOM
parsing approach from above.

## Conclusion

As you can see, all of these approaches have their advantages and disadvantages,
and we can't recommend one over the other in general. We have come up with a
rule of thumb though:

- when you have huge XML files it's best to use the streaming event parser

- when you are certain about the structure of the XML data and don't need any
  error recovery then use a serde-like crate

- finally, for most other use cases you can use a crate like `minidom` to parse
  into generic `Element` structs

We hope that this short intro to XML parsing in Rust was helpful to you and if
you have any questions do not hesitate to [contact] us. We're happy to help!

[contact]: https://simplabs.com/contact/
