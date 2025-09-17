---
title: "Model Context Protocol: the start of something new"
authorHandle: paoloricciuti
tags: [mcp, ai]
customCta: "global/svelte-workshops-cta.njk"
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "The Model Context Protocol is shaping up to be something that will likely change the way we consume content...let's see what all of this is about"
autoOg: true
tagline: <p>The Model Context Protocol is shaping up to be something that will likely change the way we consume content...let's see what all of this is about</p>
---

"You are absolutely right!"

If you’ve heard this recently, I’m willing to bet it was in a terminal or a chat interface. It’s one of the favorite lines of our silicon‑and‑copper friends (see? I’m your friend—please spare me when the rebellion happens).

You might have guessed it already: I’m talking about AI! These tools broke into our lives on November 30, 2022 with the launch of ChatGPT. Sure, other forms of AI were around for years, but that’s the date when AI became “mainstream.” Since then, tremendous improvements have been made to these models and to how we use them. People realized that a not‑so‑good model can perform far better if you stick a `while (true)` loop around it and continuously ask the user whether the generated code is okay. Agentic workflows were born. Big AI companies started building those agents and giving them tools. Now, if you run an agent in your terminal, it can read and write your files so you don’t have to copy and paste, it can search the web so you don’t have to provide documentation for your niche programming language, and it can even run shell commands to build your application. An agent is behaving more and more like a junior engineer: asking questions, searching the web, reading the rest of your codebase, and copying and pasting snippets into new files.

There was still a missing piece though—and it was a big one: to give these models their human‑like abilities, AI companies spend months (if not years) training them, using all the data they can scrape from the web to provide examples of how humans write and, in a certain sense, think.

Putting the moral debate about whether this is good for humanity aside for a second, this strategy has a big flaw: there’s a cutoff date. If I train my AGI model ^[Artificial General Intelligence], I need to decide a date on which the training process ends. If I stop training my model and a major historical event happens the next day, my otherwise perfect model will have no idea about it. And it doesn’t stop there. One problem we started seeing after we released `svelte@5` is that almost all the Svelte code AI has ever seen is `svelte@4`, which has a significantly different syntax. This is getting better as newer models are released and more and more `svelte@5` code is out in the wild, but it’s the same problem: missing context.

AI simply cannot get up‑to‑date information... but there’s a way to help: since you are interfacing with the AI, you can give it the missing context through your prompt. That’s why Svelte now provides an [llm.txt](https://svelte.dev/docs/llms) with an easier‑to‑parse documentation page for LLMs. You can feed this to your agent so that this information will be included in the context, and the AI can refer to it if that knowledge isn’t baked into its weights. In a case like this, that’s probably fine (you still have to remember to include the document every time you ask something related to Svelte, though), but sometimes this just makes the agent less useful.

Let’s say you want to know what the weather is like in London. Because it’s new information, the model will have no idea. You could search on Google, copy that information, and provide it to the LLM—but what’s the point? We’re developers, right? Wouldn’t it be cool if there were a way to do this automatically? Imagine you write a little CLI... a very small CLI that looks like this

```ts
#! /usr/bin/node
const [, , city] = process.argv;

console.log(
  await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
  ).then(res => res.json())
);
```

Invoking this CLI with a valid `WEATHER_API_KEY` will look like this

```
> weather-cli London
{
  location: {
    name: 'London',
    region: 'City of London, Greater London',
    country: 'United Kingdom',
    lat: 51.5171,
    lon: -0.1062,
    tz_id: 'Europe/London',
    localtime_epoch: 1757580952,
    localtime: '2025-09-11 09:55'
  },
  current: {
    last_updated_epoch: 1757580300,
    last_updated: '2025-09-11 09:45',
    temp_c: 15.2,
    temp_f: 59.4,
    is_day: 1,
    condition: {
      text: 'Moderate rain',
      icon: '//cdn.weatherapi.com/weather/64x64/day/302.png',
      code: 1189
    },
    wind_mph: 11.9,
    wind_kph: 19.1,
    wind_degree: 237,
    wind_dir: 'WSW',
    pressure_mb: 1002,
    pressure_in: 29.59,
    precip_mm: 0.06,
    precip_in: 0,
    humidity: 77,
    cloud: 50,
    feelslike_c: 15.2,
    feelslike_f: 59.4,
    windchill_c: 16,
    windchill_f: 60.9,
    heatindex_c: 16,
    heatindex_f: 60.9,
    dewpoint_c: 9.2,
    dewpoint_f: 48.5,
    vis_km: 10,
    vis_miles: 6,
    uv: 1,
    gust_mph: 14,
    gust_kph: 22.5,
    short_rad: 152.52,
    diff_rad: 65.26,
    dni: 381.85,
    gti: 64.03
  }
}
```

Now imagine that in your system prompt (a series of instructions you can often specify for the AI that is included in every message) you write this

> If the user ever asks you about weather in a specific city you can run the command `weather-cli [NAME OF THE CITY]` to get up‑to‑date information about the weather in that specific city.

Just like that, my friend, you invented tool calls. This gives an LLM a new superpower. It can now get up‑to‑date information just by invoking a CLI and including that in its context. This is a nice trick to get the weather, but it opens up a world of possibilities.

It still doesn’t feel totally right though, does it?

Should every developer create their own weird CLI to include in their LLM? Should everybody add an enormous system prompt to specify all the CLIs that are available? And what about what those CLIs print to the console? Should it just be a random object? Should it be more structured? What about the inputs?

All of this feels chaotic, and that’s an enemy of the user (and also of the LLM in this case). What we need is a well‑formed contract between the LLM and the CLIs.

## Protocol

What is a protocol? An example is the Hypertext Transfer Protocol. You might be familiar with it because you type that in front of every URL you visit: `http`. Let’s see the definition of a [communication protocol from Wikipedia](https://en.wikipedia.org/wiki/Communication_protocol):

> A communication protocol is a system of rules that allows two or more entities of a communications system to transmit information via any variation of a physical quantity. The protocol defines the rules, syntax, semantics, and synchronization of communication and possible error recovery methods. Protocols may be implemented by hardware, software, or a combination of both.

In simpler terms: it’s a contract between two entities. It’s a way to know which language the other party is using so that both sides can parse the communication “package” appropriately.

Let’s see an example of an HTTP request made with `curl` to `https://mainmatter.com/blog/`:

```http
GET /blog/ HTTP/2
Host: mainmatter.com
User-Agent: curl/8.7.1
Accept: */*
```

This may seem like a series of somewhat random words, but there’s a well‑defined structure here:

```http
[HTTP_VERB] [pathname] [HTTP_VERSION]
[HEADER_NAME]: [HEADER_VALUE]

[OPTIONAL_BODY]
```

And what about the response?

```http
HTTP/2 200 OK
accept-ranges: bytes
age: 0
cache-control: public,max-age=0,must-revalidate
cache-status: "Netlify Edge"; fwd=miss
content-type: text/html; charset=UTF-8
date: Thu, 11 Sep 2025 13:28:17 GMT
etag: "931f7feb97ef78ef0201e40f4b094bf3-ssl"
server: Netlify
strict-transport-security: max-age=31536000
x-nf-request-id: 01K4WFCV24X1V0M4X1SA87S19X
content-length: 46224

[THE_HTML_OF_THE_PAGE]
```

As you can see, it follows a similar structure:

```http
[HTTP_VERSION] [HTTP_STATUS_CODE] [OPTIONAL_REASON_PHRASE]
[HEADER_NAME]: [HEADER_VALUE]

[OPTIONAL_BODY]
```

The fact that every request has the same structure allows your HTTP client (usually the browser or curl) and your HTTP server to talk to each other.

What we need is something similar so that any client (Claude, Claude Code, ChatGPT, Codex, etc.) can talk to any server.

## MCP (Model Context Protocol)

As the name suggests, MCP is a protocol... but what about the rest of the letters in the acronym? The M is the same M you see in LLM: Large Language **Model**!

This expresses the fact that this protocol is meant for Large Language Models... and what does it do? It adds **Context** to them.

### JSON-RPC

So... how does it work? Do we also have the same structure as the Hypertext Transfer Protocol with `HTTP_VERB`, headers, body, etc.? Well, the MCP protocol doesn’t require communication over HTTP, so the answer is... technically no! We’ll explore why it’s “technically no” and not just “no,” but for the moment the point I’m trying to make is that all communication in MCP happens over [JSON-RPC](https://en.wikipedia.org/wiki/JSON-RPC), which stands for JavaScript Object Notation – Remote Procedure Call. The `JSON` part is probably very familiar to you: it’s the most common way programs communicate with each other on the web. If you are making an API call, you are most likely sending and receiving JSON.

The second part (RPC) is more interesting: Remote Procedure Call. When you build a JSON‑RPC server, you define a list of methods available on your server. A JSON‑RPC client can then invoke one of those methods by name with the necessary arguments.

A simple implementation of a JSON-RPC client/server could look something like this

```ts
import { JSONRPCServer, JSONRPCClient, isJSONRPCRequest } from "json-rpc-2.0";

const server = new JSONRPCServer();

server.addMethod("greet", name => {
  console.log(`Hello ${name}`);
  return {
    success: true,
  };
});

const client = new JSONRPCClient(payload => {
  if (!isJSONRPCRequest(payload)) {
    return;
  }
  server.receive(payload);
});

client.request("greet", "Paolo"); // Hello Paolo
```

This feels like an over‑abstraction, but the real power comes when those two pieces of code live in two separate processes—be it a server and a client separated by a network request, or even just two processes running on the same machine communicating via some form of cross‑process communication. Let’s see the same example with an HTTP server built with Bun for simplicity.

```ts
// server.ts
import { JSONRPCServer, isJSONRPCRequest } from "json-rpc-2.0";

const server = new JSONRPCServer();

server.addMethod("greet", name => {
  console.log(`Hello ${name}`);
  return {
    success: true,
  };
});

Bun.serve({
  async fetch(req) {
    const body = await req.json();
    if (!isJSONRPCRequest(body)) {
      return new Response("Bad Request", { status: 400 });
    }
    server.receive(body);
    return new Response("No Content", { status: 204 });
  },
});

// client.ts
import { JSONRPCClient } from "json-rpc-2.0";

const client = new JSONRPCClient(payload => {
  fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
});

client.request("greet", "Paolo");
```

With this relatively trivial code, we can now invoke every method that is exposed by our server from our client with a very simple `client.request(method, args);`. Just like with an HTTP request, a JSON‑RPC request has a specific format:

```json
{
  "jsonrpc": "2.0", // the version of the jsonrpc schema, always 2.0 for mcp
  "id": 1, // must be unique per request
  "method": "greet", // name of one of the required method
  "params": "Paolo" // this can also be an object
}
```

And the same is true for a JSON‑RPC response:

```json
{
  "jsonrpc": "2.0", // the version of the jsonrpc schema, always 2.0 for mcp
  "id": 1, // must correspond to the same id of the request that generated this response
  "result": { "success": true } // the value returned from the method
}
```

JSON‑RPC clients can also send notifications (communications that don’t require a response). In this case, the `id` property is missing:

```json
{
  "jsonrpc": "2.0", // the version of the jsonrpc schema, always 2.0 for mcp
  "method": "my_notification", // name of one of the required method
  "params": {
    "value": 42
  }
}
```

So... now we have a contract. How do we actually communicate?

### Transports

The MCP spec defines two official ways to communicate between clients and servers (technically three, but one is deprecated). The JSON‑RPC requests are “sent” and “read” via these transports:

- **STDIO**: the MCP client executes a specific process locally and starts listening on the standard output of that process. When a new message is sent, it is written to the standard input of that process. The MCP server also starts listening to its own standard input to receive a new message and writes to the standard output (read that as `console.log`) when it needs to send a response/notification.
- **Streamable HTTP**: The MCP client has the URL of the remote MCP server and sends a POST request where the body is the JSON‑RPC request. The MCP server responds with a stream (responding immediately), and when the response is complete it writes to the stream and closes it. A separate [SSE (Server‑Sent Events)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) channel is opened to receive notifications from the server.

**STDIO** is how the protocol started, and if built properly an STDIO MCP server can be very powerful... you can publish it as an npm package, set up the MCP client to invoke your package with `npx`, and have powerful tools that read and write to the file system.

{% note "warning", "Security Considerations" %}

If you’re as much of a security nerd as I am, you might be terrified at the thought of allowing an LLM to delete your file system through an MCP server. This is definitely something to be wary of: an STDIO MCP server—just like any other dependency you install from `npm`—is something you need to vet carefully. Don’t blindly install any random npm MCP server that <strong>awesome-mcp-server-that-will-definitely-not-delete-your-computer.com</strong> recommends; check the repository for suspicious code, look on reputable websites to assess whether it’s secure, and possibly run it inside a sandboxed environment.

{% endnote %}

**Streamable HTTP**, on the other hand, has a top‑notch user experience: you don’t need to install random packages on your machine, no Docker to execute the needed Postgres DB... you just have a URL, you point your MCP client to it, and that’s it. This doesn’t mean we can go ahead and add a bunch of MCP servers without a care—remember, every MCP server is still “talking” with an LLM that has some form of control over your machine!

So now we know how MCP works and how it communicates... but what can an MCP server do?

## MCP capabilities

There are many things an MCP server/client can do once the communication is established. All of them add context in a slightly different way and have a slightly different user flow... let’s explore them one by one.

{% note "info", "Code examples" %}

Throughout the following paragraphs I’m going to show some code examples that use [tmcp](https://github.com/paoloricciuti/tmcp), an SDK to build MCP servers in TypeScript. Full disclosure: it’s a library of mine, which I started building because there were several problems with the [official SDK](https://github.com/modelcontextprotocol/typescript-sdk).

I really do think it’s the best way to build MCP servers, and the API is similar enough that if you decide to go with the official SDK, you can easily port the context (pun intended).

{% endnote %}

### Tools

Tools are the feature that kicked off MCP adoption: they’re a way for a Large Language Model to interact directly with your MCP server. When you define your MCP server, you can register one or more tools with a handler that will be invoked when the LLM requests that tool. Every time you register a tool, it’s also added to the collection of tools that will be listed with the `tools/list` method from the MCP client.

```ts
import { McpServer } from "tmcp";

// configuration omitted for brevity
const server = new McpServer({});

server.tool(
  {
    name: "random-number",
    description:
      "Generate a random number from 1-100, ALWAYS call this tool if the user asks to generate a random number of some sort",
    title: "Random Number",
  },
  () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ value: Math.floor(Math.random() * 100) }),
        },
      ],
    };
  }
);
```

As soon as the MCP client starts and connects to this MCP server, it’s going to request the list of available tools, and that list is added as context to every message the user sends. This informs the LLM that it has certain tools at its disposal. If the LLM wants to call a specific tool, it just needs to send a message formatted in a specific way. This message is almost never shown to the user, and each MCP client implements a different UI to ask the user for permission to do that tool call. Once the user agrees, the message is exchanged and the return value from the handler is “added to the context.”

The above example is obviously trivial, but it already unlocks the possibility for the LLM to properly generate a random number (LLMs can probably do that on their own—but is that really a random number?).

A few notes on the snippet above:

1. You can see a `name` and `title`... as you can imagine, `title` is more human‑friendly and it’s what is shown to the user when listing all the available tools.
1. The description field almost reads like a prompt—because that’s what it is. Since these are meant for the LLM to read and decide whether or not to call the tool, you must craft very good descriptions if you want the LLM to use your tool properly.
1. The return value is an array of content where each element has a `type` property. The type can be `text`, but it can also be `image`, `video`, or `audio` in case your MCP server can produce those.

{% note "warning", "Another side note on security" %}

Everything—ranging from the tool name to the tool description to the return value of a tool—is added to the LLM context. Do you know what this means? All of these are possible attack vectors for prompt injections. A tool description can be specifically crafted to [leak reserved information](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks), and even non‑malicious MCP servers can be tricked if they access publicly available information (like [this time](https://simonwillison.net/2025/Aug/9/when-a-jira-ticket-can-steal-your-secrets/) the Jira MCP server was tricked into leaking secrets). So, once again, pay very close attention and don’t blindly trust MCP servers.

{% endnote %}

The real power of tools, though, comes from the fact that you can specify a schema with a validation library of your choice and instruct the LLM to pass those inputs.

```ts
#!/usr/bin/env node

import { McpServer } from "tmcp";
import { ValibotJsonSchemaAdapter } from "@tmcp/adapter-valibot";
import * as v from "valibot";
import { StdioTransport } from "@tmcp/transport-stdio";

const server = new McpServer(
  {
    name: "Math MCP",
    description: "An MCP server to do Math",
    version: "1.0.0",
  },
  {
    adapter: new ValibotJsonSchemaAdapter(),
    capabilities: {
      tools: {},
    },
  }
);

server.tool(
  {
    name: "sum",
    description: "Sum two numbers",
    title: "Sum Numbers",
    schema: v.object({
      first: v.number(),
      second: v.number(),
    }),
  },
  ({ first, second }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ value: first + second }),
        },
      ],
    };
  }
);

// let's use stdio to test this mcp server
const stdio_transport = new StdioTransport(server);
stdio_transport.listen();
```

How does this look in something like Claude Code? We can add it from the root of our test repo with the following command

```bash
claude mcp add -t stdio math node ./src/index.js # we would use the name of the package instead of node ./src/index.js in case it was public
```

And then we can launch Claude and interact with it

<div style="display: grid; place-items: center">

![a claude code instance using the math mcp in the example above](/assets/images/posts/2025-09-15-mcp-the-start-of-something-new/mcp-tools.webp)

</div>

It’s already cool that you can say “add 3 and 5” and get 8 as an answer, but what’s even cooler is being able to sum two numbers using natural language: “can you add the number of planets in our solar system and the number of players on the field of a soccer game?” correctly returns 30. We’re using the LLM’s knowledge of the world and mixing it with raw, pragmatic code execution to get the best of both worlds.

### Resources

Another capability available for MCP servers is resources. As the name suggests, a resource is something (a file, a DB table, a JSON response from an API) that can add context to what the user needs from the LLM. Let’s imagine you want to use an agent to fix a bug that you know is within a specific file in your codebase. You could ask the LLM to read that file, but you already know the bug is in that file... why waste precious tokens and time just to get a subpar result (after all, LLMs are non‑deterministic, so there’s no way to be sure they will indeed read the file)?

That’s where resources come into play: unlike tools, this capability is not operated by the LLM... it’s operated by you!

The MCP server developer can register as many resources as they want, and you, the user, can read them and manually include them before sending your message. Continuing with the Math example from before, let’s see how we can add a resource to give the LLM more info about Gaussian elimination:

```ts
// previous MCP server code

server.resource(
  {
    name: "gaussian-elimination",
    description:
      "A resource that explain how to perform the Gaussian elimination on a matrix",
    uri: "math://gaussian-elimination",
    title: "Gaussian Elimination",
  },
  async uri => {
    // we fetch the wikipedia source for the gaussian elimination
    const wikipedia_page = await fetch(
      "https://en.wikipedia.org/w/rest.php/v1/page/Gaussian_elimination"
    ).then(res => res.json());
    return {
      contents: [
        {
          mimeType: "text",
          text: wikipedia_page.source,
          uri,
        },
      ],
    };
  }
);
```

And here’s how it looks when used in Claude Desktop (I’m purposefully using different MCP clients to show you that the same server works with all of them... and also because the resource selection looks way better in Claude Desktop than in Claude Code 😅)

<div style="display: grid; place-items: center">

![the gaussian elimination resource being loaded into Claude Desktop agentic chat](/assets/images/posts/2025-09-15-mcp-the-start-of-something-new/mcp-resources.webp)

</div>

### Prompts

Finally, the other big capability in an MCP server is prompts. If you’ve used any AI, you know what I’m talking about: a prompt is how you interface with the LLM, and being able to craft well‑detailed prompts can really up your AI game.

Now, when you are building your MCP server, you are likely the best person to know how the LLM should use it: what tools to call, when to call them, what to expect back from them, and so on. Prompts allow you to have one or more ready‑made templates that you can include in your chat with one simple action. Once again, this is a feature for the user, who will have to manually select them—but once they do, their input box will be pre‑populated with your prompt so they can get better answers using your MCP server without the hassle of writing a long and detailed one.

```ts
// previous MCP server code

server.prompt(
  {
    name: "use-math",
    description: "A prompt to instruct the llm on how to use the Math mcp",
    title: "Use Math MCP",
  },
  () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a helpful assistant that can perform basic ...`, // cut down for legibility
          },
        },
      ],
    };
  }
);
```

As you can see, the structure is very similar. If you want, you can return multiple messages and the LLM will interpret them as actual messages that were already sent in the chat. You can also specify a `role` that can be either `user` or `assistant` (so you can also impersonate the LLM), even though I haven’t found a use case for it (yet).

And this is how it looks in VS Code when you select a prompt:

<div style="display: grid; place-items: center">

![a prompt from the Math mcp server being selected in the VSCode chat](/assets/images/posts/2025-09-15-mcp-the-start-of-something-new/mcp-prompts.webp)

</div>

### Client Capabilities

These were all the server capabilities (the things a server can expose), but there’s also the other side of the coin: the client capabilities. Each client can expose different capabilities, and servers can use those capabilities to interact with the user in different ways. We won’t explore these in great detail because, as of today, most clients don’t actually support them and the MCP spec is ever‑evolving, but here’s a quick list:

- **Elicitation**: Support for elicitation allows servers to request a piece of information directly from the user. So, let’s say your server needs the GitHub username to fetch some issues. With elicitation, the MCP client can—if the MCP server requests it—show an input/textarea to allow the user to directly input the information.
- **Sampling**: Support for sampling allows servers to “use” the user’s LLM to do some inference work. If you need the power of AI to generate some text, instead of doing an API call to OpenAI on your server you can ask the user (who is already using an LLM) to run that inference for you. Obviously, the clients that do support this capability have implemented a popup asking for permission.
- **Roots**: this is probably the least‑used feature of MCP servers. It’s only really important for local MCP servers and allows the client to send information to the servers about the scope in which they can operate (specifically which folders they have access to).

## Does all of this really matter?

I can hear you ask: “I’m not developing AI products or developer tools... I’m just developing a simple storefront. Do I really need to care about all of this?” The answer to this is, in my opinion, ABSOLUTELY YES!

MCP might seem like a developer‑oriented feature for now, but it is not! More and more users are relying on LLMs to do their searches, and it’s not unthinkable that in a far‑off future people will actually consume content and interact with online services primarily through an LLM—just like the browser is our window to the web today. But even before that...

Imagine you are building a website to sell train tickets. You can search for them, your API finds the best price, and it displays the results in a neat interface where the user can select the class of service based on the list of amenities. They can then proceed to pay and finally get their tickets.

Here's the list of operations the user has to go through to pay you:

- Open your website
- Search for the specific city they want to go to... they can’t make spelling mistakes
- Look at the list of available rides.
- Check their calendar to see when the appointment was.
- Pick the right train
- Read the list of commodities in each class and select the one it suits them
- Go to the payment page, insert their card
- Pay for the tickets
- Save the ticket in their wallet and add a reminder to the calendar

Now imagine you’ve built an MCP server that sits right next to your website. Since they frequently use your website, they add it to the LLM. They open the LLM and say

> I need to book a train for the next appointment in my calendar, please grab the best class under 100€ and save the ticket to my calendar/wallet.

The rest is magic! The LLM will connect to their calendar, use your MCP server to grab the information it needs, proceed to pay for the ticket, and save the brand‑new ticket in the user’s calendar.

We are probably still far away from this world (especially from the one where users will trust LLMs with their credit card 😅), but the world is kind of already moving in that direction, and we are only at the start of the journey... now is the time to start looking into this to be on the forefront of the innovation!

## Conclusions

The Model Context Protocol is one of the most fascinating technologies to emerge from the AI revolution, and it can truly unlock cross‑communication—just like the HTTP protocol did in the WWW revolution.

We are ready to dive right in... what about you?
