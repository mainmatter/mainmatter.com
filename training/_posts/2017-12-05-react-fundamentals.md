---
layout: workshop
title: React Fundamentals
weight: 3
permalink: "/training/2017-12-05-react-fundamentals"
category: Front End
description: 'React.js is a component library, which expresses user interfaces in
  terms of components, properties passed into them, and state they manage internally.
  Through these encapsulated, expressive and composable building blocks, we can create
  complex and dynamic interfaces with code that is surprisingly simple and easy to
  manage.

'
image: "/images/training/2017-12-05-react-fundamentals.png"
stages:
- title: Hello React
  description: We will begin by using React in the simplest and most minimal way possible.
    You will quickly see the maintainability benefits of using components instead
    of “vanilla Javascript”.
  duration: 140
  agenda_items:
  - title: Welcome and Tech Check
    description: We'll get set up and ensure everyone has the required software installed.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Why React
    description: Before we start talking about how React works, we'll put it into
      context among the front-end technologies that came before and after React was
      introduced.
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: React.createElement
    description: We’ll begin by creating a piece of web UI with the native DOM that
      comes for free with web browsers, and then move toward using `React.createElement`
      and `ReactDOM.render`. By the end, our code will be easier to maintain and more
      expressive.
    item_type: lecture
    start_time: '9:45'
    duration: 20
  - title: 'EXERCISE: Input and Textarea'
    description: We’ll begin by building the appropriate DOM structure for a form
      built with [MUI CSS framework](https://www.muicss.com) using React and ES5 JavaScript.
      Don’t worry about building custom components yet — just stick to using React
      and ReactDOM to make DOM creation more manageable.
    item_type: exercise
    start_time: '10:05'
    duration: 25
  - title: 'JSX: JavaScript + HTML'
    description: We have seen how React can make our life easier, but we have lost
      the ability to represent the HTML-ish portion of our UI as something that looks
      like HTML. React apps are typically written in [JSX, an XML-like syntax extension](https://facebook.github.io/jsx/)
      to  the [ECMAScript Language Specification](https://tc39.github.io/ecma262/).
      We’ll learn about the new types of syntax you can use, and study what happens
      once JSX is transpiled into JavaScript.
    item_type: lecture
    start_time: '10:30'
    duration: 30
  - title: 'EXERCISE: Upgrade to JSX'
    description: "Re-do the previous exercise, and use JSX to make the creation of
      DOM entities as expressive and declarative (close to HTML) as possible. \n"
    item_type: exercise
    start_time: '11:00'
    duration: 20
- title: Components
  description: 'Components are modular, encapsulated and composable pieces of UI,
    and React places a very heavy emphasis on them. In fact, in a React app, anything
    visible (and even many non-visible things) are defined as Components. We will
    learn about several different types of components, starting with the lightest,
    fastest and simplest ones.

'
  duration: 325
  agenda_items:
  - title: Stateless Components and Props
    description: 'The simplest type of component in a React app is a Stateless Functional
      Component (SFC). Essentially, these are just functions that are passed arguments,
      which returns JSX expressions.

'
    item_type: lecture
    start_time: '11:20'
    duration: 30
  - title: 'EXERCISE: Upgrade to Stateless React Components '
    description: |-
      Rewrite the form from the previous two exercises using only Stateless Functional Components, and then use these components to build a form for creating or updating a recipe. This should include:
      * A `<MuiInput>` for the name of the recipe,
      * A `<MuiInput>` for preparation time (a numeric value),
      * A `<MuiTextarea>` for ingredients,
      * A `<MuiTextarea>` for instructions.
    item_type: exercise
    start_time: '11:50'
    duration: 30
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:20'
    duration: 60
  - title: Stateful Components
    description: So far, all “arguments” passed to components have been in the form
      of “props”, which look like HTML attributes when used with JSX. This allows
      us to render some HTML but until we introduce *state* (data that a user can
      change in the app), this app is not going to be interactive at all. React provides
      a different kind of component in the form of a JavaScript class, as the foundation
      for stateful components.
    item_type: lecture
    start_time: '13:20'
    duration: 30
  - title: 'EXERCISE: Interactive Form'
    description: |-
      Add a feature to our form, so that we can replace our “ingredients” field with a list of items, each with their own field. Users should be able to click an “add ingredient” button and be provided instantly with a `<MuiInput>` component. A “delete ingredient” button should be available for each field in this list to remove the associated item from our application state.

      For now, don’t worry about capturing the values the user has entered into these fields — we’ll deal with that as the next topic.
    item_type: exercise
    start_time: '13:50'
    duration: 20
  - title: Handling user interaction and setState
    description: 'We have already dealt with the basics of user interaction by responding
      to clicks for the “add ingredient” and “delete ingredient” buttons. There is
      more to user interactivity than what meets the eye - we’ll look at how an update
      to state works in React, and examine best practices for keeping your app performing
      smoothly and responsively.

'
    item_type: lecture
    start_time: '14:10'
    duration: 20
  - title: 'EXERCISE: Binding functions to DOM events'
    description: |-
      Functions are just another first-class value type in JavaScript, and we can use them in JSX just as easily as we use numbers, strings and booleans. Finish the work we started in the last exercise, by ensuring that ingredient names are updated in application state as the user enters them.

      Complete your work by adding an “edit ingredient” button on the outer-most component, to allow toggling between “viewing” and “editing” the recipe. If you are managing state properly, this should be a quick and easy feature to add.
    item_type: exercise
    start_time: '14:30'
    duration: 30
  - title: Lifecycle Hooks
    description: 'One of the most important features of components is that they have
      predictable and well-orchestrated lifecycles. By using lifecycle hooks — functions
      that are invoked at certain important moments in a component’s lifetime — we
      have the opportunity to customize how a component is set up, updated, or torn
      down. We’ll introduce the *mounting* and *updating* phases of a component’s
      lifecycle, and discuss specific examples of when and why you might want to customize
      these hooks.

'
    item_type: lecture
    start_time: '15:00'
    duration: 20
  - title: 'EXERCISE: Media Query Component'
    description: 'CSS media queries are great if we want to change how HTML is styled
      based on screen size, but what if we want to change the DOM structure? We can
      build a React component for that, but it’ll have to start listening to `window`
      for resize events. To avoid memory leaks, this listener must be removed as soon
      as the component is destroyed. Use the `componentDidMount` and `componentWillUnmount`
      hooks to handle this listener properly.

'
    item_type: exercise
    start_time: '15:20'
    duration: 30
  - title: PureComponent and skipping re-renders
    description: "Sometimes we can improve the re-rendering performance of an app
      by implementing `shouldComponentUpdate` to describe updates that should be “skipped”.
      Prior to React 15.3, this feature was only available on stateful components,
      but with the introduction of `PureComponent`, we can optimize stateless components
      too! \n"
    item_type: lecture
    start_time: '15:50'
    duration: 20
  - title: 'EXERCISE: Optimizing Rendering Performance'
    description: Optimize the “recipe summary” React component to avoid pointless
      re-renders. Keep stateless components stateless, but you may “upgrade” stateless
      functional components to pure components.
    item_type: exercise
    start_time: '16:10'
    duration: 20
  - title: Wrap-Up and Recap
    description: We'll recap everything we have covered so far, and set our sights
      on tomorrow's topics.
    item_type: lecture
    start_time: '16:30'
    duration: 15
- title: React-Router
  description: With support for asynchronous component loading, dynamic routing, code-splitting
    and scroll-restoration, it is not surprising that React-Router is the most popular
    client-side routing library in the React ecosystem. We will get hands-on experience
    with React Router v4 in a variety of scenarios carefully designed to represent
    the use cases most developers face when building their own React apps.
  duration: 120
  agenda_items:
  - title: Router, Route and Link
    description: 'At the heart of React-Router are three components: Router, Route,
      and Link. We’ll walk through a side-by-side comparison of the routers included
      with React-Router v4, and demonstrate how path expressions are used to render
      components based on URL.

'
    item_type: lecture
    start_time: '9:00'
    duration: 40
  - title: 'EXERCISE: Recipe as a resource'
    description: |-
      Create routes for creating, listing and updating recipe resources. You must meet the following requirements:
      * Users should be able to refresh the browser at any of these pages and see no change in what’s rendered,
      * Hitting the back button should take you back to the previous application state.
    item_type: exercise
    start_time: '9:40'
    duration: 40
  - title: Advanced Routing
    description: |-
      Now that we have some experience with the basics, we’ll address some more nuanced routing concerns like:
      * 404 Pages,
      * QueryParams,
      * Islands of URL-sensitive content,
      * Redirects.
    item_type: lecture
    start_time: '10:20'
    duration: 40
- title: Architecture Patterns
  description: 'Knowing how to build React components is just the beginning of our
    journey — it is important to know the best practices and patterns for using these
    tools effectively. In this unit, we will look at several architectural patterns
    that will serve you well as your app increase in complexity.

'
  duration: 220
  agenda_items:
  - title: Container vs. Presentation Components
    description: |-
      One common strategy for managing complexity in single-page apps is to divide components into two categories:
      * *Container components* which do not render anything all that impressive (except maybe other components), but do some heavy lifting when it comes to state management and data manipulation,
      * *Presentation components* which are usually stateless and handle almost no data manipulation.
      Effectively, this allows us to build components that are either responsible for making something work properly, or making something look right, but never both.
    item_type: lecture
    start_time: '11:00'
    duration: 30
  - title: 'EXERCISE: Autocomplete Component'
    description: Using the provided `autocomplete.js` module, build an autocomplete
      component where state is owned and managed by a `<AutocompleteContainer />`
      component. Build another component where results are presented by a `<AutocompleteResultSet
      />` component. Components that emit non-trivial DOM nodes should not own or
      change state directly, and components that manage state should not render anything
      fancy (except other components).
    item_type: exercise
    start_time: '11:30'
    duration: 30
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:00'
    duration: 60
  - title: Higher Order Components
    description: Higher Order Components are just functions that take a component
      class as an argument and return another component class. This advanced React
      architectural pattern provides some useful ways to reuse and compose component
      behaviors. We’ll study a few examples of when and how this comes in handy.
    item_type: lecture
    start_time: '13:00'
    duration: 30
  - title: 'EXERCISE: Higher Order Components'
    description: Build a higher order component that sorts the data passed to a “list”
      component, according to a comparator function passed to the higher-order-component
      constructor. Make sure to follow all of the best practices we’ve talked about!
    item_type: exercise
    start_time: '13:30'
    duration: 30
  - title: Server-Side Rendering
    description: 'The process of setting up production-grade server-side rendering
      (SSR) for a React app is complicated and error-prone. However, only part of
      this has to do with React. We''ll begin by walking through a checklist of what''s
      required for a proper production SSR setup. Then, we''ll work together to set
      up a “development use only” server-rendering React/Express app, to demonstrate
      how it all works at a basic level.

'
    item_type: lecture
    start_time: '14:00'
    duration: 40
- title: Preact - A 3KB React Alternative
  description: Preact has the same ES6 public API as React, but weigh in at just 3kb.
    It is a great choice for single-screen apps that do not have to deal with a lot
    of complexity. We will take a look at how Preact can be used as _almost_ a drop-in
    replacement for React, and how we can use Preact’s own API directly for an even
    smaller app!
  duration: 115
  agenda_items:
  - title: Preact as a Drop-In React Replacement
    description: 'Through using an additional library called `preact-compat` and changing
      a few things in our [Webpack](https://webpack.js.org/) configuration, we can
      swap out React for Preact and our app may not even know that anything has changed!
      We’ll walk through this setup process together as a group.

'
    item_type: lecture
    start_time: '14:40'
    duration: 40
  - title: Using Preact Directly
    description: Through using the `webpack-bundle-analyzer` plugin, we can see that
      we have already reduced the size of our app considerably. Part of what’s keeping
      our app from getting a bit smaller is that we are still trying to use Preact
      as a drop-in React replacement. Using Preact by itself will help us shed more
      weight.
    item_type: lecture
    start_time: '15:20'
    duration: 30
  - title: 'EXERCISE: Using Preact Directly'
    description: 'Convert all of our React components to Preact components, and then
      re-run the bundle analyzer to see how much our gzipped build size was reduced. '
    item_type: exercise
    start_time: '15:50'
    duration: 30
  - title: Wrap up and Recap
    description: We'll recap everything we have learned throughout the course, and
      discuss resources for further education.
    item_type: lecture
    start_time: '16:20'
    duration: 15
---