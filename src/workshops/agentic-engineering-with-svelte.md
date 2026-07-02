---
title: "Agentic Engineering with Svelte"
tags: "svelte"
format: "Workshop: 2 days"
subtext: "Bookable for teams - on-site or remote"
description: "Learn how to use AI agents effectively in Svelte 5 and SvelteKit projects, from setup and MCP integration to test-driven workflows, code review, automations, and production debugging."
introduction: "<p>This hands-on workshop teaches teams how to use AI agents as effective engineering collaborators when building Svelte 5 and SvelteKit applications. Participants learn how to set up a production-ready project, use the Svelte MCP server, skills, subagents, validate generated changes, and combine TDD, code review, repository automations, and observability into a reliable AI-assisted workflow.</p>"
hero:
  color: purple
  image: "/assets/images/workshops/agentic-engineering-with-svelte/hero.jpg"
  imageAlt: "Photo of a computer screen showing an IDE with an open Svelte project"
og:
  image: /assets/images/workshops/agentic-engineering-with-svelte/og-image.jpg
topics:
  - title: Introduction to Agentic Engineering
    text: >
      We'll introduce agentic engineering and the current challenges of using AI effectively with Svelte 5 applications.


  - title: Project setup
    text: >
      We'll create a SvelteKit application with a recommended development stack, including TypeScript, ESLint, Prettier, testing, authentication, database integration, and deployment.


  - title: Svelte MCP server
    text: >
      We'll explain what MCP is, how it improves AI-generated code, and how to use MCP tools for documentation lookup, code validation, auto-fixing, and playground generation.


  - title: AI coding best practices
    text: >
      We'll cover when to use AI, how to manage LLM context efficiently, and how skills, MCP servers, and context optimization fit together.


  - title: Working with AI agents
    text: >
      We'll use sub-agents for parallel and isolated tasks, configure agent instructions in <code>AGENTS.md</code>, and discuss security considerations for MCP servers and AI skills.


  - title: AI-assisted UI/UX workflow
    text: >
      We'll explore how to convert a design from Figma into code and how to use agents without losing design intent or implementation quality.


  - title: Development workflow
    text: >
      We'll establish a Git workflow for reviewing AI-generated changes, practice Test-Driven Development with AI agents, build reusable components following TDD principles, and explain why extensive testing and validation are essential for both engineers and agents.


  - title: Prompting strategies
    text: >
      We'll compare a direct prompt with a structured planning approach by solving the same complex task both ways, then analyze when planning produces better outcomes than immediately generating code.


  - title: Kanban board implementation
    text: >
      We'll kick off a Kanban board implementation using the established AI-driven workflow. Along the way, we will update <code>AGENTS.md</code> when necessary, discuss what belongs there vs. more specialized documentation, create codebase-specific skills, and write ad hoc ESLint rules that keep the agent on track.


  - title: Code review with AI
    text: >
      We'll explore AI-assisted code review options, set up Greptile, and use it to review and improve generated code.


  - title: Repository automations
    text: >
      We'll set up repository automations that automatically triage issues and improve CI workflows.


  - title: Loop engineering
    text: >
      We'll direct agents to validate their work in a loop, extending the maximum useful duration of tasks by combining code changes, validation, pull requests, review feedback, fixes, and repetition.


  - title: Observability and debugging
    text: >
      We'll integrate Sentry into the application and use it to diagnose, debug, and fix runtime issues in an AI-assisted development workflow.


leads:
  - handle: paoloricciuti
---

<!--break-->
