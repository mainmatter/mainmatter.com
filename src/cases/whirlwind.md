---
layout: case-study
company: Whirlwind
title: "Whirlwind Chat: Connect with Peers – 2 Minutes at a Time! | Work"
displayTitle: "Whirlwind Chat: Connect with Peers – 2 Minutes at a Time"
description: "<p>Connecting with others remotely is hard.</p><p>After years of running hybrid conferences, we noticed a recurring problem: remote attendees often felt isolated, disconnected from the onsite energy, and unable to engage meaningfully with others. We built Whirlwind to fix that: it's a fun and intuitive tool for remote groups to connect, interact, and build new relationships.</p>"
cta: whirlwind
hero:
  color: purple
  image: "/assets/images/work/gravity-visual.jpg"
  imageAlt: "Gravity logo floating in space"
  tags: "Mainmatter Product"
og:
  image: /assets/images/cases/cs-gravity-og-image.jpg
---

{% from "image-aspect-ratio.njk" import imageAspectRatio %} {% from "quote.njk" import quote %}

<div class="case-study__section mb-5">
  <div class="case-study__text">
    <p>After years of organizing hybrid conferences like <a href="https://eurorust.eu">EuroRust</a>, <a href="https://emberfest.eu">EmberFest</a>, and <a href="https://sveltesummit.com">Svelte Summit</a>, one problem became clear: remote attendees consistently felt disconnected. They missed out on the energy of the event and found it awkward or difficult to meet new people. The same holds true in remote teams. Casual hallway chats and spontaneous connections are hard to replicate online.
    </p>
    <p>
       We wanted to give remote groups a simple, effective way to help people connect remotely—whether at an event or in a distributed company. So we built <a href="https://whirlwind.chat">Whirlwind</a>.</p>
  </div>
</div>

![Whirlwind animated video](/assets/images/work/whirlwind-hero.mp4#video)\

<div class="case-study__section">
  <h3 class="case-study__heading">The Solution: Fast, Fun, and Human</h3>
  <div class="case-study__text">
    <p>Whirlwind is a video-based speed networking tool that connects people randomly for short, one-on-one video calls. It’s designed to make remote socializing feel natural, fast-paced, and fun.</p>
      <p>
      By design, Whirlwind solves a few common issues with remote networking:</p>
    <ul class="text-with-list__list text-with-list__list--unordered">
    <li class="text-with-list__item"><span><strong class="strong">No awkward outreach:</strong> Random matchmaking removes the pressure of cold-messaging strangers in chat.</span></li>
    <li class="text-with-list__item"><span><strong class="strong">Built-in pacing:</strong> The time limit keeps conversations focused and energetic.</span></li>
    <li class="text-with-list__item"><span><strong class="strong">Efficient networking:</strong> Participants meet multiple people quickly, with the option to follow up afterward if there’s a spark.</span></li>
    </ul>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">How We Built It</h3>
  <div class="case-study__text">
    <p>Whirlwind is built with <a href="/svelte-consulting/">Svelte</a> on the frontend for snappy performance and a smooth user experience. Video calls rely on WebRTC so that communication is peer-to-peer with minimal infrastructure overhead on our side.</p>
      <p>
      On the backend, we use <a href="/rust-consulting/">Rust</a> to build a lightweight signaling server that handles matchmaking and initiates connections. Because the server doesn’t need to relay video streams, it can scale effortlessly and cost-effectively.</p>
  </div>
</div>
