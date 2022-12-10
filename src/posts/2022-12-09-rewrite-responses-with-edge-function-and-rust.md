---
title: "Rewrite netlify responses with edge function and Rust"
authorHandle: candunaj
tags: rust
bio: "Stanislav Dunajčan"
description:
  "Stanislav Dunajčan exploring potential of webassembly (wasm) written in Rust
  and netlify edge functions"
og:
  image:
tagline: |
  <p>Implemented a solution to show the "simplabs is mainmatter now!" header on mainmatter.com when the user is redirected from simplabs.com. This was achieved by using a Netlify edge function to check the URL of the incoming request and, if it is from mainmatter.com, calling a WebAssembly (wasm) function written in Rust to remove the header. The Rust code was chosen for its static typing and performance and compiled to wasm for portability and execution on the web.</p>
---

When a user visits mainmatter.com, they see a header that says "simplabs is
mainmatter now!". The task was to show this header only when the user visits the
page from simplabs.com and is redirected to mainmatter.com. There are several
ways to achieve this, but one option is to use a Netlify edge function to check
the URL and, if it is from mainmatter.com, call a WebAssembly (wasm) function
written in Rust that removes the header.

To accomplish this task, I took the following steps:

1. Implement a function in Rust to remove the header, taking advantage of the
   language's performance and static typing.
2. Compile the Rust code to WebAssembly (wasm) to make it portable and
   executable on the web.
3. Create and set up a Netlify edge function to remove the header when
   appropriate.

### 1. Implement a function in Rust to remove the header, taking advantage of the language's performance and static typing.

#### Creating the rust library

To create the rust library, we first need to use the `wasm-pack` tool with the
`new` command and specify a name for the library, like this:

```
wasm-pack new rust-rewriter
```

This will create a new rust library with the specified name.

#### Implementing the header removal function

To implement the function that removes the header when visited from a domain
other than simplabs.com, we have two options:

1. Parse the response text into HTML using a library like kuchiki, and then
   remove the element by ID.
2. Add specific comments before and after the header, and then remove everything
   in between.

We choose the second option because it is faster than parsing the response text.
Here's an example of what the code to remove the header might look like:

```rust
use wasm_bindgen::prelude::*;jk

#[wasm_bindgen]
pub fn remove_header_start_end(response_text: &str, start_text: &str, end_text: &str, is_simplabs: bool) -> String {
  if is_simplabs {
    return response_text.to_string();
  }

  let start_index = response_text.find(start_text);
  let end_index = response_text.find(end_text);

  if let Some(si)=start_index {
    if let Some(ei)=end_index {
      let mut replaced_text = response_text.to_string();
      let eil = ei + end_text.len();
      replaced_text.replace_range(si..eil, "<!-- removed simplabs header by rust-rewriter -->");
      return replaced_text;
    }
  }

  return response_text.to_string();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_removes_header_for_mainmatter() {
      let response_text = "<html><head></head><body><!-- SIMPLABS_HEADER_START --><div id='simplabsheader'>simplabs is Mainmatter now!</div><!-- SIMPLABS_HEADER_END --></body></html>";
      let result = remove_header_start_end(response_text, "<!-- SIMPLABS_HEADER_START -->", "<!-- SIMPLABS_HEADER_END -->" , false);
      assert_eq!(result, "<html><head></head><body><!-- removed simplabs header by rust-rewriter --></body></html>");
    }

    #[test]
    fn it_doesnt_remove_header_for_simplabs() {
      let response_text = "<html><head></head><body><!-- SIMPLABS_HEADER_START --><div id='simplabsheader'>simplabs is Mainmatter now!</div><!-- SIMPLABS_HEADER_END --></body></html>";
      let result = remove_header_start_end(response_text, "<!-- SIMPLABS_HEADER_START -->", "<!-- SIMPLABS_HEADER_END -->" , true);
      assert_eq!(result, "<html><head></head><body><!-- SIMPLABS_HEADER_START --><div id='simplabsheader'>simplabs is Mainmatter now!</div><!-- SIMPLABS_HEADER_END --></body></html>");
    }
}
```

### 2. Compile the Rust code to WebAssembly (wasm) to make it portable and executable on the web.

#### Building the WebAssembly package

To build the WebAssembly (wasm) package, we first need to run the `wasm-pack`
command with the `--target web` flag, like this:

```
wasm-pack build --target web
```

This command will produce a `pkg` folder containing a wasm file and a JavaScript
file. The JavaScript file provides a wrapper that makes it easy to call the wasm
functions as if they were JavaScript functions.

#### Using the wasm package

Before you can use the wasm functions, you must first call the `init()`
function, which loads the wasm file and creates a WebAssembly instance.

Once the `pkg` folder is generated, you can deploy it as an npm package and use
it in a Netlify edge function, or you can include it directly in the Netlify
edge function as I did.

Here's an example of how you might call the `init()` function and use the wasm
functions in your code:

```js
// Import the init() function and the wasm function from the generated JavaScript file
import init, { aFunction } from "./pkg/wasm_package.js";

// Call the init() function to load the wasm file and create a WebAssembly instance
await init();

// Use the wasm function as if it is JavaScript function
const result = aFunction(arg1, arg2);
```

### 3. Create and set up a Netlify edge function to remove the header when appropriate.

#### Setting up the Netlify edge function

To set up the Netlify edge function, we first need to configure it in the
`netlify.toml` config file. We do this by adding the following code to the file:

```toml
[[edge_functions]]
  path = "/*"
  function = "conditionalHeader"
```

This tells Netlify to run the `conditionalHeader` function for every incoming
request to any path on the site.

#### Removing the header

To remove the header from the HTML response, we first need to add specific text
markers above and below the header. This allows us to easily find and remove the
header using the `remove_header_start_end` function from the wasm file.

Here's an example of what the HTML with the text markers might look like:

```html
<!-- SIMPLABS_HEADER_START -->
Header to be removed
<!-- SIMPLABS_HEADER_END -->
```

Next, we need to implement the `conditionalHeader` function that will be called
by the Netlify edge function. This function will do the following:

1. Load the response text and wasm file in parallel.
2. Check if the incoming request is from the simplabs hostname.
3. Wait for the response text and wasm file to load.
4. Remove the header when appropriate.

Here's an example of what the `conditionalHeader` function might look like:

```js
// import functions from generated javascript file from wasm-pack
import init, {
  remove_header_start_end,
} from "./rust-rewriter/build/rust_rewriter.js";

export default async (request, context) => {
  // 1. start loading response text and wasm in parallel
  const promises = [loadText(context), init()];

  // 2. while promises are loading, check if request is from simplabs
  const url = new URL(request.url);
  const isSimplabs = url.hostname === "simplabs";

  // 3. wait for wasm and response text to load
  const [{ responseText, response }] = await Promise.all(promises);
  if (!responseText) {
    //if there is no responseText, then return the response
    return response;
  }

  // 4. remove header when appropriate
  const newText = remove_header_start_end(
    responseText,
    "<!-- SIMPLABS_HEADER_START -->",
    "<!-- SIMPLABS_HEADER_END -->",
    isSimplabs
  );
  return new Response(newText, response);
};
```

### Wrapping Up: What We Learned from Using Rust and wasm

While using Rust and WebAssembly (wasm) to remove text between two markers may
not be the most practical solution, it was an interesting exercise to explore
the performance and static typing capabilities of Rust and the portability of
wasm. This approach may be better suited for other tasks where the benefits of
Rust and wasm can be fully utilized. Overall, it was a valuable learning
experience and demonstrated the potential of these technologies.
