---
title: "Whirlwind Chat: Learnings from building a browser-based P2P video chat"
authorHandle: BobrImperator
tags: [rust, svelte, webrtc]
bio: "Bartlomiej Dudzik, Software Developer"
description: "A technical overview of Whirlwind Chat: learnings from building a browser-based P2P video chat."
autoOg: true
customCta: "global/whirlwind-cta.njk"
tagline: <p>Lessons learned and decisions made behind Whirlwind Chat and its structure.</p>
image: "/assets/images/posts/2025-05-31-introducing-whirlwind/whirlwind-visual.jpg"
imageAlt: "Smiling and waving geometric shape folks swept by a whirlwind."
---

Spontaneous one-on-one conversations are still hard to replicate at online events. We built [Whirlwind Chat](https://whirlwind.chat/) to make that easier. It's a simple app for short, peer-to-peer video chats. You join a group then get matched with others for 2-minute conversations.

This post is to provide a technical overview for a video chat application [Whirlwind Chat](https://whirlwind.chat/) which we've made, as well as give an insight into some of the more interesting parts and the intentions behind them.

![A screenshot showcasing how Whirlwind Chat looks like on mobile](/assets/images/posts/2025-05-31-introducing-whirlwind/mobile-screenshot.png)

## The core: Rust, SvelteKit, and WebRTC

Whirlwind Chat has two parts: a web app written in Svelte, and a backend server written in Rust. The frontend runs entirely in the browser and handles video calls using WebRTC. The backend coordinates users, manages sessions, and helps peers connect.

The actual video and audio data never touch our servers. Everything flows directly between browsers using peer-to-peer connections. This approach improves privacy (no server sits in the middle watching calls) and it makes Whirlwind Chat scalable to a large number of users with minimal infrastructure.

## The backend

The backend is written in [Rust](/rust-consulting/) using [Axum](https://docs.rs/axum/latest/axum/) which is somewhat split into two parts: The web server and a Supervisor that takes care of spawning session servers as they’re requested.

It also relies on PostgreSQL as a persistence layer for user records and the Cloudflare Realtime service which provides TURN servers for WebRTC.

The web server handles:

- HTTP API and Websocket connections
- Session servers spawning

Session servers are responsible for:

- matchmaking and keeping track of previous matches
- managing real-time user states like “readiness”
- exchanging WebRTC messages between users in that group

### Supervisor

One of the great concerns of building the server was resilience; making sure that an unexpected failure in a single lobby doesn’t bring other lobbies with it.

As a result we’ve created an `ApplicationSupervisor` that takes care of spawning and isolating `LobbyServer` structs which in turn spawn their own tasks (`matchmaking`, `activity monitor`). That way a lobby is free to crash and at worst users of that particular lobby will be disconnected without spoiling the fun for others.

Lobby servers don’t run always, instead they’re spawned on-demand as users join a lobby for the first time and later they’re shutdown after some period of time when a lobby is considered inactive.

Additionally we take advantage of that fact to make a request to fetch STUN/TURN server configuration to [Cloudflare Realtime API](https://developers.cloudflare.com/realtime/) before a Lobby wakes up. That is because STUN/TURN server configuration must be shipped to the end users, but making a hardcoded, long lived configuration could easily allow somebody to use our Cloudflare service. So instead the credentials are generated per-server.

Another function of a Supervisor is to provide an access to the internal state of a given lobby. We rely on this mechanism internally for owner actions which are regular HTTP calls instead and not just WebSocket messages. This helps with avoiding re-implementing request/response and authentication mechanisms in a WebSocket connection, ultimately making things simpler by relying on the already coined practices around HTTP authentication.

![Server structure quick overview](/assets/images/posts/2025-05-31-introducing-whirlwind/server-structure.png)

### Websocket

A great chunk of Whirlwind Chat functionalities are a part of Websocket connections.

It serves a few purposes:

- Server must be able to notify users of state changes and new matches in real-time.
- Users must be able to send a dozen messages as fast as possible to each other when negotiating a WebRTC connection.
- Keep track of whether users are still participating in the session or if they’ve quit or lost connection.

The Websocket is pretty simple, its role is to receive and react to messages from a user. A Websocket connection is a `tokio::task` that `axum` spawns for us and provides us with a `stream`. Additionally when the Websocket connection is already upgraded, when "connecting" to a `Lobby`, the handler takes a hold of an `InMemoryHandle` that is the de-facto interface of `InMemory` that give us read and write access to `InMemory` via `Actor` model messaging using `oneshot` channels.

By itself it can't interact with the rest of the system or users however. In order to handle that the Websocket spawns more tasks and channels. It creates a `mailbox` and forwards the writer side of it to the `InMemory` so the `InMemory` module and other users have the ability to push messages to that user who owns the receiving side of `mailbox`. It also creates a `queue` channel - once a message reaches the channel it's read by the `sender` task which pushes that message to the client. The `queue` collects messages from other sources like the `mailbox` and `receiver`.

Messages sent to a user are generally either a result of their direct actions like sending a `Ready` message or indirect like somebody joining to the Lobby, in that case user will receive a `LobbyStatus` message originating from the session server.

![Websocket communication flow](/assets/images/posts/2025-05-31-introducing-whirlwind/websocket-overview.png)

### Testing

Whirlwind Chat is an application where 90% of the work and functionality happens in the Websockets.

As such it requires a different testing approach that’s more similar to testing Evented systems rather than an HTTP API.

First of all, the test setup actually runs our Server by binding it to a random port with its own database and configuration on a test by test basis - making sure everything is isolated, concurrent and fast. It also works great when testing different configurations of various `matchmaking` task settings.

The test suite essentially uses Black Box testing approach. Our tests define and make use of a stateful `Interactions` module. The `Interactions` module is a test helper that defines methods that make _real_ HTTP calls (not mocked), and uses `tokio_tungstenite` to make a real Websocket connection to the server, so it can act as a real user using their browser. `Interactions` also stores received messages for inspection, which helps with keeping tests fast and accurate by making sure it’s OK to receive different messages while we’re waiting for a specific one; since messages are unordered by nature and the client might receive a `UserStatus` message in between awaiting an `IceAnswer` message.

## The frontend

We used [SvelteKit](https://svelte.dev/docs/kit/introduction) for the frontend. It's a good fit for reactive UIs while keeping bundle size to minimum. (At Mainmatter, [we like Svelte and SvelteKit](/svelte-consulting/) because they strike the right balance between developer productivity and building lightweight, performant web apps.)

The hard part wasn't building the interface, it was making it work reliably across all the different browsers, devices, and hardware users bring. Some users join from phones, others from dual-screen desktops. Microphones and cameras vary. Permission prompts behave differently across OS/browser combinations.

We also had to handle stream negotiation, dynamic device selection, and failure cases where the camera or microphone is missing, is in use elsewhere, or blocked. An optional background blur feature added one more layer of complexity by having to juggle multiple video streams and elements, which is more tricky than it sounds.

![WebRTC overview](/assets/images/posts/2025-05-31-introducing-whirlwind/webrtc-overview.png)

### Background blur with Tensorflow

While integrating Tensorflow (BodyPix) is pretty easy, there are some tricky parts in context of a video call and WebRTC though.

- The person segmentation model is quite heavy and ideally is sideloaded
- Video processing is pretty heavy on CPU and so we needed a way to limit how often segmentation runs using `requestAnimationFrame` and then limit it further by pegging it to the video stream fps by counting how much time has elapsed between draws. Current frequency is `1000ms / 30fps` .
- It requires swapping out a `video` element with a `canvas` element when blur is toggled on. Video element must be kept in the background and overlayed with `canvas` because it’s still the video camera and audio source.
- Video processing sometimes throws errors that’d typically stop blur from functioning. When that happens, we’re restarting the process.

The last tricky part we’ve had to solve was making sure which video track needs to be sent to the Peer without overly complicating things by having to send additional metadata. While WebRTC has a `replaceTrack` API, we learned quickly that when called too often, WebRTC would stop transmitting any video. The fix was to debounce the blur functionality, but finding the answer wasn’t so obvious at the time.

### Detecting whether video is being sent

This was probably our most favorite piece of the puzzle. WebRTC doesn’t provide any off the shelf API that could quickly tell that there’s likely a problem with the connection and a video stream is stuck for our Peer. We can see our camera feed OK but the person on the other end might not see us.

Luckily, WebRTC does provide statistics for the transceiver that takes care of receiving and sending the data. It’s possible to call `getStats` on `RTCPeerConnection` instance, select a “report” for `video` channel and using `report.framesReceived` property, begin to count how many times we’ve received less than a certain amount of frames in that second. If it keeps dropping frames for roughly 10 seconds, we’ll call `restartIce` on the WebRTC connection to make clients renegotiate their connection.

This mechanism works great for situations where:

- Peers are not sending data to one another
- Peers are using incompatible codecs
- The internet connection quality has dropped or switched from wifi to mobile data.
