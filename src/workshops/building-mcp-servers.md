---
title: "Building MCP Servers"
tags: "mcp"
format: "Workshop: 2 days"
subtext: "Bookable for teams – on-site or remote"
description: Learn to build powerful Model Context Protocol (MCP) servers that extend AI capabilities with custom tools, resources, and integrations. This comprehensive workshop covers MCP fundamentals through advanced deployment strategies.
introduction: "<p>The Model Context Protocol (MCP) is revolutionizing how AI systems interact with external data and services. This hands-on workshop teaches you to build sophisticated MCP servers that can provide AI models with custom tools, dynamic resources, and contextual information. From basic server setup to advanced features like authorization and deployment, you'll gain the skills to create MCP servers that unlock new possibilities for AI-powered applications.</p>"
hero:
  color: purple
  image: "/assets/images/workshops/mcp/header.jpg"
  imageAlt: "Traditional colorful Rajasthani string puppets (Kathputli) dressed in bright red and yellow clothes with painted wooden faces and intricate headgear, hanging on strings and used in folk performances."
og:
  image: /assets/images/workshops/mcp/og-image.jpg
topics:
  - title: What is MCP?
    text: >
      We'll explore what Model Context Protocol is, why it's needed, and what the main applications are for extending AI capabilities.


  - title: MCP Lifecycle
    text: >
      Understanding the complete lifecycle of an MCP session from initialization to shutdown, including connection management and error handling.


  - title: Transports
    text: >
      STDIO vs HTTP communication methods: how to actually communicate via MCP, exploring the advantages of each transport mechanism.


  - title: Tools
    text: >
      Build the most powerful feature of MCP: tools that allow LLMs to autonomously request additional context and perform actions on behalf of users.


  - title: Resources
    text: >
      Learn how users can inject context from your MCP server before sending prompts. We'll explore different resource types and create dynamic resources.


  - title: Prompts
    text: >
      Help users with pre-prepared prompts they can include with a couple of clicks. Learn how to expose reusable prompts from your MCP server.


  - title: Completions
    text: >
      Implement completion functionality for both Resources and Prompts to provide MCP clients with information about what's available on your server.


  - title: Elicitation
    text: >
      Handle scenarios where MCP servers need extra user information (like GitHub usernames) by implementing elicitation to ask users directly.


  - title: Sampling
    text: >
      Learn when and how to use sampling to ask users for permission to use their LLM to fulfill requests, managing costs and permissions effectively.


  - title: Authorization
    text: >
      Secure your MCP server with proper authorization so users can only access their own data, plus deployment strategies for sharing via npm or hosting.


  - title: Deployment
    text: >
      MCP servers are stateful by nature so deploying them to serverless needs a bit more carefulness...let's learn the ins and outs of how to deploy an MCP server.


leads:
  - handle: paoloricciuti
---

<!--break-->
