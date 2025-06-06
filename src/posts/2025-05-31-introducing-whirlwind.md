---
title: "Whirlwind: Meet everyone in 2-minute, 1-on-1 video chats"
authorHandle: BobrImperator
tags: [rust,svelte]
bio: "Bartlomiej Dudzik, Software Developer"
description: "Connect with others on-line during a breakout!"
autoOg: true
tagline: <p>Bringing spontaneous hallway conversations on-line!</p>

image: "/assets/images/posts/2025-05-22-native-apps-with-svelte/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

At Mainmatter, we believe that great conversations shouldn’t depend on where you are. Remote and hybrid events such as conferences and meetups are getting increasingly popular, with easier ways to stream talks, integrated chats and abilities to ask questions. But one thing is still missing: the spontaneous hallway conversation.

Introducing [Whirlwind](https://whirlwind.chat)!

[Whirlwind](https://whirlwind.chat) brings quick networking to online events, right in your browser. It makes it easy for attendees to mingle in between presentations, allowing online and in-person attendees to socialize, connect and discuss a talk they just saw!

## How it works

[Whirlwind](https://Whirlwind.chat) is a 1-on-1 video chat web app running in your browser:

1. Go to [whirlwind.chat](https://whirlwind.chat)
2. Create a group, choose your display name, and share the invite link
3. Start right away or wait for others to join
4. Once you’re matched, start chatting. No downloads, no sign-ups!

You’ll be paired one-on-one with another participant from your group. After 2 minutes, you’ll be matched with someone new. Each match happens only once per session, encouraging breadth over depth, like speed-networking for conferences.

## Built with Rust, SvelteKit, and WebRTC

Whirlwind.chat is a one-on-one video chat app built using a web browser’s WebRTC API.
Additionally it uses a web server for exchanging messages between clients, all messaging happens through the server except for the actual video chat.

![Simple app flow diagram](/assets/images/posts/2025-05-31-introducing-whirlwind/simple-diagram.png)

The Web Server is written in [Rust](https://www.rust-lang.org/) on top of [Axum](https://docs.rs/axum/latest/axum/) and [tungstenite](https://github.com/snapview/tungstenite-rs) for websockets.

A Session Server is actually a tokio task spawned on demand, this helps with resilience and allows each session to be configured independently.

The Frontend is a rather simple Sveltekit app, the devil lies in the details however. Turns out that  wrangling WebRTC, device and video stream (with blurring) management is quite challenging! While the API specs are working mostly the same, browsers would or wouldn’t report things such as a device change, device permissions, have additional metadata in their IDs or missing labels causing subtle bugs. We’ll stop the rant at also mentioning device permissions as the last item.

### WebRTC connection flow

1. User is invited to a group
2. User gives their name
3. User connects to a session sever
4. User is connected and can see the count of users connected to the same session
5. User clicks “ready”
6. The SessionServer matches two users
7. Users are informed of a match found
8. User sends an ICE Offer to the peer.
9. Peer responds with an ICE Answer
10. Users are exchanging their ICE Candidates
11. Once users agreed on an ICE Candidate, they start exchanging data
12. Users negotiate what video/audio codecs their devices support and restart ICE candidate exchange process.
    - Without this, users could end up sending/receiving data in a format they can’t decode. This is mostly a cross-browser compatibility step.
13. Users can now chat with each other.
14. Once the timer runs out or one of the peers disconnects, users will be matched with somebody else if available.
    - A “match” between users can happen only once per session.

![Detailed app flow diagram](/assets/images/posts/2025-05-31-introducing-whirlwind/detailed-diagram.png)

## Outro

Are you organizing an event? Or you’re curious about Whirlwind?
Go to [whirlwind.chat](https://whirlwind.chat), create a group and share the link to start chatting!
