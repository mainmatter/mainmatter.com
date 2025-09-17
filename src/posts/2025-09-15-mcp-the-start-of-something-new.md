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

If you've recently heard this sentence I'm willing to bet you did it from a terminal or a chat interface. It's one of the favorite sentences of our silicone and copper friends (see, I'm your friend, please spare me when the rebellion will take place).

You might have already guessed it but I'm obviously talking about AI! Those tools broke into our lives the 30th of November in the year 2022 with the launch of Chat GPT. Sure, other forms of AI were already there years ago but that's the point when AI become "mainstream". Since that day tremendous improvements have been made to those models and to the way we use them. People realized that a not-so-good model can perform way better if you stick a `while(true)` around it and continuously ask the user if the generated code is ok. Agentic workflows were born. Big AI companies started building those agents and giving them tools: now, if you run an agent in your terminal it can read and write your files so you don't have to copy-paste, it can search the web for you so you don't have to link to the documentation of your niche programming language for it to know about it, it can even run commands in your shell to build your application. An agent it's behaving more and more like a Junior engineer that ask questions, search the web, reads the code in the rest of your codebase to copy-paste snippets of it in a new file.

There was still a missing piece tho and it was kind of a big one: to give those models their human-like abilities AI companies spend months (if not years) training them, using all the data they can scrape from the web to provide examples of how humans write and, in a certain sense, think.

Putting the moral debate about wether this is good for humanity or not aside for a second, this strategy has a big flaw: there's a cutoff date. If I train my AGI model ^[Artificial General Intelligence] I need to decide a date where the training process ends. And if I stop training my model and a major historical event happen to happen the day after my perfect model will have no idea about that. And obviously it doesn't stop there: one problem we started seeing after we released `svelte@5` is that almost all the Svelte code AI has ever seen is `svelte@4` with a decently different syntax. It is now getting better as newer models are getting released and more and more `svelte@5` code is out in the wild but it's the same problem: the problem of missing context.

AI simply cannot get up to date information...but there's a way to do it: since you are interfacing with the AI you can give it the missing context through your prompt. That's why Svelte now provides an [llm.txt](https://svelte.dev/docs/llms) with a way-easier-to-parse-for-llm documentation page. You can feed this to your agent so that this information will be included in the context and AI can refer to it in case there's no knowledge backed into it's weights. For a case like this this is probably fine (you still have to remember to include the document every time you ask something related to svelte tho) but sometimes this just makes the agent less useful.

Let's say you want to know what's the weather like in London. Being a new information the model will have no idea about it. You could search what's the weather like on google, copy that information and provide it to the LLM but then what's the point? But we are developer right? Wouldn't it be cool if there was a way to do this automatically? Imagine you write a little cli...a very small cli that looks like this

```ts
#! /usr/bin/node
const [, , city] = process.argv;

console.log(
  await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
  ).then(res => res.json())
);
```

Invoking this cli with a valid `WEATHER_API_KEY` will look like this

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

now imagine that in your system prompt (a series of instruction you can often specify for the AI that is included in every message) you write this

> If the user ever asks you about weather in a specific city you can run the command `weather-cli [NAME OF THE CIY]` to get up to date information about the weather in that specific city.

Just like that, my friend, you invented tool calls. This gives LLM a new super-power. They can now get up to date information just by invoking a CLI and include that in their context. This is a nice trick to know the weather but it opens a world of possibilities.

It still doesn't feel totally right tho, isn't it?

Should every developer create it's own weird cli to include in their LLM? Should everybody add an enormous system prompt to specify all the cli's that are available? And what about what those cli's print to the console? Should it just be a random object? Should be more structured? What about the inputs?

All of this feels chaotic and that's an enemy of the user (and also of the LLM in this case). What we need is a well formed contract between the LLM and the cli's.

## Protocol

What is a Protocol? An example of a Protocol is the Hyper Text Transfer Protocol. You might be familiar with it because you type that in front of every URL you visit: `http`. Let's see the definition of a [communication protocol from wikipedia](https://en.wikipedia.org/wiki/Communication_protocol):

> A communication protocol is a system of rules that allows two or more entities of a communications system to transmit information via any variation of a physical quantity. The protocol defines the rules, syntax, semantics, and synchronization of communication and possible error recovery methods. Protocols may be implemented by hardware, software, or a combination of both.

In easier terms: it's a contract between two entities. It's a way to know which language the other part is using so that both parties can parse the communication "package" appropriately.

Let's see an example of an http request made with `curl` to `https://mainmatter.com/blog/`:

```http
GET /blog/ HTTP/2
Host: mainmatter.com
User-Agent: curl/8.7.1
Accept: */*
```

this may seem like a series of somewhat random words but there's a pretty defined structure here

```http
[HTTP_VERB] [pathname] [HTTP_VERSION]
[HEADER_NAME]: [HEADER_VALUE]

[OPTIONAL_BODY]
```

and what about the response?

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

as you can see it follows a similar structure with

```http
[HTTP_VERSION] [HTTP_STATUS_CODE] [OPTIONAL_REASON_PHRASE]
[HEADER_NAME]: [HEADER_VALUE]

[OPTIONAL_BODY]
```

the fact that every request has the same structure allow your HTTP client (usually the browser/curl) and your HTTP server to talk with each other.

What we need us something similar so that every client (claude, claude code, chatgpt, codex etc) can talk with every server.

## MCP (Model Context Protocol)

As the name suggest MCP is a protocol...but what about the rest of the words in the acronym? The M is the same M you see in LLM: Large Language **Model**!

This express the fact that this protocol is meant for the Large Language Models...and what it does? It adds **Context** to it.

### JSON-RPC

So...how does it work? Do we also have the same structure as the Hyper Text Transfer Protocol with `HTTP_VERB`, headers, body etc? Well the MCP protocol doesn't "force" the communication to happen over HTTP so the answer is...technically no! We are gonna explore why is "technically no" and not just "no" but for the moment the point I'm try to make is that every communication in MCP happens over [JSON-RPC](https://en.wikipedia.org/wiki/JSON-RPC) which stands for JavaScript Object Notation-Remote Procedure Call. The `JSON` part is probably very familiar to you: it's probably the most common way programs communicate with each other on the web: if you are making an API call most likely you are sending and receiving JSON.

The second part (RPC) is more interesting: Remote Procedure Call. When you build a JSON-RPC server you are defining a list of methods that are available on your server...a JSON-RPC client can then invoke one of those methods by name with the necessary arguments.

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

this feels like an over-abstraction but the real power comes where those two pieces of code lives in two separate processes, be it a server and a client separated by a network request or even just two processes running on the same machine communicating via some form of cross process communication. Let's see the same example with an http server built with Bun for simplicity.

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

with this relatively trivial code we can now invoke the every method that is exposed from our server, within our client with a very simple `client.request(method, args);`. Just like with the HTTP request a JSON-RPC request has a specific format:

```json
{
  "jsonrpc": "2.0", // the version of the jsonrpc schema, always 2.0 for mcp
  "id": 1, // must be unique per request
  "method": "greet", // name of one of the required method
  "params": "Paolo" // this can also be an object
}
```

and the same is true for a JSON-RPC response

```json
{
  "jsonrpc": "2.0", // the version of the jsonrpc schema, always 2.0 for mcp
  "id": 1, // must correspond to the same id of the request that generated this response
  "result": { "success": true } // the value returned from the method
}
```

JSON-RPC clients can also send notifications (communications that don't require a response)...in this case the `id` property is missing

```json
{
  "jsonrpc": "2.0", // the version of the jsonrpc schema, always 2.0 for mcp
  "method": "my_notification", // name of one of the required method
  "params": {
    "value": 42
  }
}
```

So...now we have a contract...but how do we actually communicate?

### Transports

The MCP spec defines two official ways to communicate between clients and servers (technically three but one is deprecated). The JSON-RPC requests are "sent" and "read" via these transports:

- **STDIO**: the MCP client executes a specific process locally and it start listening on the standard output of that process. When a new message is sent it is written to the standard input of that process. The MCP server also start listening to it's own standard input to receive a new message and writes to the standard output (read that as `console.log`) when it needs to send a response/notification.
- **Streamable HTTP**: The MCP client has the URL of the remote MCP server, it send a POST request where the body is the JSON-RPC request. The MCP server respond with a stream (responding immediately) and when the response is complete writes to the stream and close it. A separate [SSE (Server Sent Events)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) channel is open to receive notifications from the server.

**STDIO** is how the protocol started and if built properly an STDIO MCP server can be very powerful...you can publish it as an npm package, setup the MCP client to invoke your package with `npx` and have very powerful tools that read and write to the file system

{% note "warning", "Security Considerations" %}

If you are as much as a security nerd as I am you must now be terrified at the thought of allowing an LLM delete your file system through an MCP server. This is definitely something to be very wary of: an STDIO MCP server, just like any other dependency you install from `npm`, something you need to vet carefully. Don\'t blindly install any random npm MCP server that <strong>awesome-mcp-server-that-will-definitely-not-delete-your-computer.com</strong> recommends you, check the repository to see if there\'s any suspicious code, look on reputable websites if it's secure, possibly run it inside a sandboxed environment.

{% endnote %}

**Streamable HTTP** on the other hand has top notch user experience: you don't need to install random packages on your machine, no docker to execute the needed postgres db...you just have an url, you point your MCP client to it and that's it. This doesn't mean we can go ahead and install a bunch of MCP servers without even caring...remember every MCP server is still "talking" with an LLM that still has some form of control over your machine!

So now we know how MCP works, how it communicate...but what can an MCP server do?

## MCP capabilities

There are many things an MCP server/client can do once the communication is established, all of them adds context in a slightly different way and has a slightly different user flow...let's explore them one by one.

{% note "info", "Code examples" %}

Throughout the following paragraphs I'm gonna show some code examples that use [tmcp](https://github.com/paoloricciuti/tmcp), an SDK to build MCP servers in typescript. Full disclosure: it's a library of mine which I started building because there were several problems with the [official SDK](https://github.com/modelcontextprotocol/typescript-sdk).

I do really think it's the best way to build MCP servers and the API it's similar enough that, if you decide to go with the official SDK, you can easily port the context (pun intended).

{% endnote %}

### Tools

Tools are THE feature that initiated the MCP server...it's a way for the Large Language Model to interact directly with your MCP server. When you define your MCP server you can register one or more tools with the respective handler that will be invoked when the LLM request that tool. Every time you register a tool it's also added to the collection of tools that will be listed with the `tools/list` method from the MCP client.

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

as soon as the MCP client start and connects to this MCP server it's gonna request the list of available tools and that is added as context to every message the user sends. This informs the LLM that has certain tools at their disposal. If the LLM want's to call a specific tool it just need to send a message formatted in a specific way...this message is almost never shown to the user and each MCP clients implements a different UI to ask the user for the permission to do that tool call. Once the user agrees the message is exchanged and the return value from the handler is "added to the context".

The above example is obviously a trivial one but it already unlocked the possibility for the LLM to properly generate a random number (LLMs can probably do that on their own but is that really a random number?).

A few notes on the snippet above:

1. You can see a `name` and `title`...as you can imaging `title` is more human friendly and it's what is shown to the user when listing all the available tools
1. The description field almost reads like a prompt...because that's what it is...since those are meant for the LLM to read and decide wether or not to call the tool you must craft very good descriptions if you want the LLM to use your tool properly
1. The return value is an array of content where each element has a `type` property...the type can be `text` but it can also be `image`, `video` or `audio` in case your MCP server can produce those

{% note "warning", "Another side note on security" %}

Everything, ranging from the tool name to the tool description to the return value of a tool is added to the LLM context. Do you know what this means? All of these are possible vector attacks for prompt injections. A tool description can specifically be crafted to [leak reserved information](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks) and even non malicious MCP servers can be tricked if they access public available information (like [this time](https://simonwillison.net/2025/Aug/9/when-a-jira-ticket-can-steal-your-secrets/) the Jira MCP server got tricked into leaking secrets) so, once again, pay very close attention and don't just blindly trust MCP servers.

{% endnote %}

The real power of tools tho comes from the fact that you can specify a schema with a validation library of your choice and instruct the LLM to pass those inputs

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

how does this look in something like claude-code? We can add it from the root of our test repo with the following command

```bash
claude mcp add -t stdio math node ./src/index.js # we would use the name of the package instead of node ./src/index.js in case it was public
```

and then we can launch claude and interact with it

<div style="display: grid; place-items: center">

![a claude code instance using the math mcp in the example above](/assets/images/posts/2025-09-15-mcp-the-start-of-something-new/mcp-tools.webp)

</div>

It's already cool that you can say "add 3 and 5" and get 8 as an answer but what's even cooler is being able to sum two numbers using natural language: "can you add the number of planets in our solar system and the number of players on the field of a soccer game?" correctly returns 30...we are using the LLM knowledge of the world and mix it up with raw and pragmatic code execution to get the best of both world.

### Resources

Another capability available for MCP servers is resources. As the name suggest a resource is something (a file, a db table, a json response from an API) that can add context on what the user needs from the LLM. Let's imagine you want to use an agent to fix a bug that you know it's within a specific file in your codebase. You could ask the LLM to read that file but you already know that the bug is in that file...why waste precious tokens, time just to get a subpar result (after all LLM are non deterministic so there's no way to be sure they will indeed read the file).

That's where resources come into play: differently from tools this capability it's not operated by the LLM...**it's operated by you**!

The MCP server developer can register as many resources as it wants, and you the user can read them all and manually include them before sending your chat. Continuing with the Math example from before let's see how we can add a resource to give the LLM more info about the Gaussian Elimination:

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

and here's how it looks when used in Claude Desktop (I'm purposefully using different MCP clients to show you that the same server works with all of them...and also because the resource selection looks way better in Claude Desktop than in Claude Code 😅)

<div style="display: grid; place-items: center">

![the gaussian elimination resource being loaded into Claude Desktop agentic chat](/assets/images/posts/2025-09-15-mcp-the-start-of-something-new/mcp-resources.webp)

</div>

### Prompts

Finally the other big capability in an MCP server are prompts...if you ever used any AI you know what I'm talking about: a prompt is how you interface with the LLM and being able to craft well detailed prompts can really up your AI game.

Now when you are building your MCP server YOU are likely the best person to know how the LLM should using it. What tools to call, when to call them, what to expect back from them and so on...prompts allow you to have one or more ready made template that you can include in your chat with one simple command. Once again this is a feature for the user that will have to manually select them but once they do their input box will be pre-populated with your prompt so that they can have better answers using your MCP server without the hassle of writing a very long and detailed one.

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

As you can see the structure is very similar, if you want you can return multiple messages and the LLM will interpret them as actual messages that were already sent in the chat. You can also specify a `role` that can be either `user` or `assistant` (so you can also impersonate the LLM) even tho I haven't find a use case for it (yet).

And this is how it looks in VSCode when you select a prompt:

<div style="display: grid; place-items: center">

![a prompt from the Math mcp server being selected in the VSCode chat](/assets/images/posts/2025-09-15-mcp-the-start-of-something-new/mcp-prompts.webp)

</div>

### Client Capabilities

These were all the server capabilities (all the things a server can expose) but there's also the other side of the coin: the client capabilities. Each client can expose different capabilities and the servers can use those capabilities to interact with the user in different ways. We are not explore these in great detail because as of today most clients don't actually support them and the MCP spec it's ever evolving but here's a quick list:

- **Elicitation**: Support for elicitation allows the servers to request a piece of information directly to the user. So let's say that your server needs the github username to fetch some issues with elicitation the MCP client can, if the MCP server request it, show an input/textarea to allow the user to directly input the information.
- **Sampling**: Support for sampling allows the servers to "use" the user LLM to do some inference work. If you need the power of AI to generate some text instead of doing an API call to openai on your server you can ask the user (which is already using an LLM) to run that inference for you. Obviously the clients that do support this capability have implemented a popup asking for permission.
- **Roots**: this is probably the less used feature of MCP servers...it's only really important for local MCP servers and allows the client to send information to the servers about the scope in which they can operate (specifically which folders they have access to).

## Does all of this really matter?

I can hear you ask: "I'm not developing AI products or developer tools...I'm just developing a simple storefront. Do i really need to care about all of this?". The answer to this is, in my opinion, ABSOLUTELY YES!

MCP might seem a developer oriented feature for now but it is not! More and more users are relying on LLM to do their searches and it's not un-thinkable that in a far away future people will actually consume content primarily through an LLM just like the browser is our window to the web today. But even before that...

Imagine you are building a website to sell train tickets, you can search for them, your API find the best price and display it in a neat interface where the user can select the class of their choice based on the list of their commodities. It can then proceed to pay to finally get their tickets.

Here's the list of operations the user has to go through to pay you:

- Open your website
- Search for the specific city they want to go...they can't make spelling mistakes
- Look at the list of available rides.
- Go check their calendar to see when the appointment was.
- Pick the right train
- Read the list of commodities in each class and select the one it suits them
- Go to the payment page, insert their card
- Pay for the tickets
- Save the ticket in their wallet and add a reminder to the calendar

Now imagine you've built an MCP server that sits right next to your website. Since they frequently use your website they add that to the LLM. They open the LLM and say

> I need to book a train for the next appointment in my calendar, please grab the best class under 100€ and save the ticket to my calendar/wallet.

The rest is magic! The LLM will connect with their calendar, use your MCP server to grab the information that it needs, proceed to pay for the ticket and save the brand new ticket in the user calendar.

We are probably still far away from this world (especially from the one where user will trust LLMs with their credit card 😅) but the world it's kinda moving already in that direction and we are only at the start of the journey...now it's the time to start looking into this to be on the forefront of the innovation!

## Conclusions

The Model Context Protocol is one of the most fascinating technologies that has emerged from the AI revolution and it can really unlock cross communication just like the HTTP protocol did in the WWW revolution.

We are ready to dive right in...what about you?
