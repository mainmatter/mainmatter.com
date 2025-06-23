---
title: "Whirlwind Chat: Learnings from building a browser-based P2P video chat"
authorHandle: BobrImperator
tags: [rust, svelte, webrtc]
bio: "Bartlomiej Dudzik, Software Developer"
description: "A technical overview of Whirlwind Chat: learnings from building a browser-based P2P video chat."
autoOg: true
customCta: "global/whirlwind-cta.njk"
tagline: <p>Spontaneous one-on-one conversations are still hard to replicate at online events. We built <a href="https://whirlwind.chat/">Whirlwind Chat</a> to make that easier. It's a simple app for short, peer-to-peer video chats. You join a group then get matched with others for 2-minute conversations.</p>
image: "/assets/images/posts/2025-06-23-introducing-whirlwind/whirlwind-visual.jpg"
imageAlt: "Smiling and waving geometric shape folks swept by a whirlwind."
---

## What is Whirlwind Chat

Spontaneous one-on-one conversations are still hard to replicate at online events. We built [Whirlwind Chat](https://whirlwind.chat/) to make that easier. It's a simple app for short, peer-to-peer video chats. You join a group then get matched with others for 2-minute conversations.

This post is to provide a technical overview for a video chat application [Whirlwind Chat](https://whirlwind.chat/) which we've made, as well as give an insight into some of the more interesting parts and the intentions behind them.

![A screenshot showcasing how Whirlwind Chat looks like on mobile](/assets/images/posts/2025-06-23-introducing-whirlwind/mobile-screenshot.png)

## The core: Rust, SvelteKit, and WebRTC

Whirlwind Chat has two parts: a web app written in Svelte, and a backend server written in Rust. The frontend runs entirely in the browser and handles video calls using WebRTC. The backend coordinates users, manages sessions, and helps peers connect.

The actual video and audio data never touch our servers. Everything flows directly between browsers using peer-to-peer connections. This approach improves privacy (no server sits in the middle watching calls) and it makes Whirlwind Chat scalable to a large number of users with minimal infrastructure.

## The backend

The backend is written in [Rust](/rust-consulting/) using [Axum](https://docs.rs/axum/latest/axum/). It's into two parts: a web server and a Supervisor that spawns session servers on demand.

It relies on PostgreSQL as a persistence layer for user records and the Cloudflare Realtime service. The Cloudflare Realtime service provides STUN/TURN servers for WebRTC, which are what allows devices to discover each other and establish a direct connection. Most connections will work well by utilizing only the STUN server, which essentially help finding a "path" to the other device and once it does the devices can use that information to connect. This doesn't work always however, when one of the devices is behind a hardened network that uses a hardened firewall or a more restrictive NAT, then a direct connection likely won't be possible - and here's where TURN servers come in. TURN servers are relays that transmit data between users.

The web server handles:

- HTTP API and WebSocket connections
- Session servers spawning

Session servers are responsible for:

- matchmaking and keeping track of previous matches
- managing real-time user states like “readiness”
- exchanging WebRTC messages between users in that group

### Supervisor

One of our biggest concerns when building the server was resilience. An unexpected failure in a single lobby shouldn't affect others.

To address this, we created an `ApplicationSupervisor` that spawns and isolates `LobbyServer` structs. In turn, each lobby server spawns its own tasks (such as `matchmaking` and `activity monitor`). If a lobby crashes, only users in that lobby are affected.

Lobby servers don’t run continuously. They are spawned on demand as users join a lobby for the first time, and shut down after a period of inactivity.

Another function of a Supervisor is to provide an access to the internal state of a given lobby. We rely on this mechanism internally for owner actions which are regular HTTP calls instead and not just WebSocket messages. This helps with avoiding re-implementing request/response and authentication mechanisms in a WebSocket connection, ultimately making things simpler by reusing well established HTTP practices.

![Server structure quick overview](/assets/images/posts/2025-06-23-introducing-whirlwind/server-structure.png)

### WebSocket

A large part of Whirlwind’s functionality relies on WebSocket connections. These connections are used to notify users of real-time changes (such as state or matches), fast exchange of messages during the WebRTC negotiation, and track whether users are still connected.

The WebSocket connection is managed as a `tokio::task` spawned by Axum. When a user connects to a `Lobby`, the handler also takes ownership of an `InMemoryHandle`, a message-passing interface for reading and writing lobby state via an actor-style model using `oneshot` channels.

The WebSocket task can't interact with the rest of the system on its own. To do that, it spawns additional tasks and channels. It creates a `mailbox` (the sending side of an `mpsc` channel) and registers it with `InMemory`, allowing the lobby and other users to send messages to this user. It also sets up a `queue` channel that collects messages from multiple sources and forwards them to the client.

Messages sent to a user can be triggered by their own actions (such as sending a Ready message) or by external events (like another user joining). For example, when someone joins the lobby, all connected users receive a LobbyStatus message from the session server.

![WebSocket communication flow](/assets/images/posts/2025-06-23-introducing-whirlwind/websocket-overview.png)

### Testing

Whirlwind Chat is an application where 90% of the work and functionality happens in the WebSockets. As such it requires a different testing approach that’s more similar to testing Evented systems rather than an HTTP API.

Each test runs a full server instance, bound to a random port with its own database and configuration. This keeps tests isolated, allows them to run in parallel, and supports custom matchmaking configurations.

The test suite follows a black-box approach. Tests use an `Interactions` module, which makes real HTTP requests (not mocks) and connects to the server using `tokio_tungstenite` to simulate a real user session.

The Interactions module stores all received messages for later inspection. This improves reliability, since messages can arrive out of order. For example, a `UserStatus` message might appear while we are waiting for an `IceAnswer`. By collecting all messages, the test can verify outcomes without depending on timing.

## The frontend

We used [SvelteKit](https://svelte.dev/docs/kit/introduction) for the frontend. It's a good fit for reactive UIs while keeping bundle size to minimum. (At Mainmatter, [we like Svelte and SvelteKit](/svelte-consulting/) because they strike the right balance between developer productivity and building lightweight, performant web apps.)

The hard part wasn't building the interface, it was making it work reliably across all the different browsers, devices, and hardware users bring. Some users join from phones, others from dual-screen desktops. Microphones and cameras vary. Permission prompts behave differently across OS/browser combinations.

We also had to handle stream negotiation, dynamic device selection, and failure cases where the camera or microphone is missing, is in use elsewhere, or blocked. An optional background blur feature added one more layer of complexity by having to juggle multiple video streams and elements, which is more tricky than it sounds.

![WebRTC overview](/assets/images/posts/2025-06-23-introducing-whirlwind/webrtc-overview.png)

### Background blur with Tensorflow

To power the background blur feature, we use TensorFlow.js together with BodyPix. BodyPix is a machine learning model that runs entirely in the browser. It performs real-time person segmentation, which means it can identify which parts of the video are the person and which are the background. This makes it possible to blur the background while keeping the speaker in focus.

While integration was relatively straightforward, applying it to a real-time video call presented a few challenges in the context of WebRTC.

- The person segmentation model is quite heavy and ideally is sideloaded
- Video processing is pretty heavy on CPU and so we needed a way to limit how often segmentation runs using `requestAnimationFrame` and then limit it further by pegging it to the video stream fps by counting how much time has elapsed between draws. Current frequency is `1000ms / 30fps` .
- It requires swapping out a `video` element with a `canvas` element when blur is toggled on. Video element must be kept in the background and overlayed with `canvas` because it’s still the video camera and audio source.
- Video processing sometimes throws errors that’d typically stop blur from functioning. When that happens, we’re restarting the process.

One of the trickiest problems was deciding which video track to send to the peer. We wanted to avoid adding extra metadata to describe the current stream. WebRTC provides a `replaceTrack` API, but calling it too frequently can cause the connection to stop transmitting video. To avoid that, we debounce the blur toggle (i.e. wait briefly before applying the change) so that track switching only happens once the user has made a final decision.

### Detecting when a video stream stops working

This was one of our favorite challenges. WebRTC does not provide a simple API to tell whether the connection is working and video is actually being delivered to the peer. You can see your own camera feed just fine, but the person on the other end might not be receiving anything.

Luckily, WebRTC does provide connection statistics through the getStats method on the RTCPeerConnection object. We use this to monitor the video channel and look at the framesReceived count in each report. If the number of frames received stays low for several seconds, we assume the connection is stalled and we call restartIce to force renegotiation between peers. This often fixes problems caused by codec mismatches, connection drops, or switching networks during a call.
