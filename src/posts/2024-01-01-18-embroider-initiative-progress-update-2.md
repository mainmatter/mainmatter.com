---
title: "Embroider Initiative: Second Progress Update"
authorHandle: lolmaus
tags: [ember]
bio: "Andrey Mikhaylov"
description:
  "❗ [this is the last post's descritpion] An update on the work the Mainmatter
  team has done on the Embroider initiative so far, the achievements that have
  been made and what the next steps ahead are."
og:
  image: /assets/images/posts/2023-11-16-embroider-initiative-progress-update/og-image.jpeg
tagline: |
  ❗ [this is the last post's descritpion ]
  <p>This post covers the progress over the last few months on <a href="https://github.com/embroider-build/embroider">the Embroider project</a> that has been made through Mainmatter's <a href="https://mainmatter.com/embroider-initiative/">Embroider Initiative</a>. While this isn't a comprehensive update, it should give you a taste of the significant progress we've made and understand some of the challenges that are still remaining.</p>
image: /assets/images/posts/2023-11-16-embroider-initiative-progress-update/header-visual.jpeg
imageAlt:
  "The ember logo on a background showing people working together on a laptop"
---

- What Embroider is
- Chris Mansons's points from Embroider Initiative part 2 kickoff ❗ Raw
  transcript, needs editing!

  - In the last six months we have done a lot of stuff. I wrote a blog post that
    went through a lot of detail at the start of November. Since then we have
    come up with a few strategies for the future of Embroider. The key thing,
    key decision that was made late November / early December was that we don't
    want to try and keep making incremental changes to Embroider that are safe
    to release and are expected to be stable. And what I mean by that is that
    we're really focused at trying to aim towards Vite, modernizing the build,
    having less of the stuff that' happening in the Ember build being very
    weird. And we have to make big changes to make that work. Some of those big
    changes slow people. We had two stable releases in a row where we were
    making changes that would only help people with Vite, and nobody can use
    Vite yet, but would slow down people who weren't using Vite. So it didn't
    make sense anymore. So the big change that was made late November / early
    December was that we split Embroider into two branches: `main` for the
    future and `stable` that is branched off. Any small incremental changes that
    we make will go into the `stable` branch, and `main` is now a breaking
    release.

    So what does that mean? If you were to run the `main` Embroider branch in
    your apps now, things will likely break. But we are getting much closer to
    being able to implement Vite in a sensible way that needs to be implemented.
    We literally merged something today that makes it a lot easier for us to
    keep removing the need for the rewritten app. The rewritten app is something
    that's necessary for Embroider today, and Vite does not really like that.
    Vite wants to look at your source, repo, and it want to build things from
    there, so that's what we're aiming for.

    One of the challenges that we were facing, though is that we as the Ember
    community have to always look at backwards compatibility. And if you look at
    the CI jobs in Embroider, it has been testing all of our PRs against 3.28,
    4.4 and the release, whatever the current release is. That is a big window,
    and there are a lot of changes there that make it hard for us to make the
    progress that we want to. So the thing that we just merged actually only
    supporte Ember Canary right now, which is going to be Ember 5.7.

    That is not to say that the next release of Embroider will only support 5.7.
    It means that what we're doing is that we're removing some of our obstacles
    to make us moving a little faster and when we get it all working in Vite, we
    will start backfilling support as far as we can. We will likely support some
    range of 4.x, I don't know if there's an early end there, I don't know if
    there's much change on the modules side that will make it difficult for us
    to go back past like 4.4 or whatever. The team hopes that we will support
    3.28, because a lot of people are stuck on 3.28. We're not sure if that's
    gonna be a possibility. We hope that we can do that 'cause stable Embroider
    still does. If we can, we will, but we're not going to sink like an infinite
    amount of effort into doing that. It might be a case that there will be a
    minimal supported version here.

  - Another thing that we're aiming for — it hasn't happened yet, but we're
    aiming for it in the next few weeks — is to make the Embroider test suite be
    Vite-only. So we're no longer thinking of the old way of using Ember CLI to
    call Embroider which calls Webpack. We're gonna do it the other way round:
    everything just runs Vite from the start. And again, in the same way as the
    previous Ember versions, this isn't to say that the next version of
    Embroider will be Vite-only, it's just that we're gonna get that working
    first and then we're gonna backfill in Webpack support.

    But the key thing here is that is not gonna look the way it is today. We
    want to remove the need for this rewritten app idea that happens in
    Embroider today, and we want to have your repo to be the entrypoint for Vite
    and the entrypoint for Webpack at the same time. So in the next major
    version of Embroider you're gonna need to have a Webpack config that will
    have an Embroider plugin configured in it. And instead of Ember CLI calling
    Webpack and auto-configuring it, Webpack will call Embroider and ask
    questions in the same way as Vite does, essentially.

  - So that's the big status update, that's the stuff that we've been working
    on. And even just thinking like that has allowed us to work at the speed
    that we haven't been able to in a very long time, because we don't have to
    keep constantly be looking behind us and making sure that everything is
    fixed. But we know that when we get to the time when we want to support
    older Ember versions and Webpack again, we're gonna backfill that stuff in a
    reasonable way that's using modern concepts and sensibilities, essentially.
    And that is the status update.

  - Ed Faulkner: this switch that you were talking about was always the plan,
    right. It's something that we have communicated for a long time that we
    wanted to eventually invert control, so that you can actually use existing
    tooling in the JavaScript ecosystem without a lot of extra layers between
    you and it. This is good for very specific tactical reasons in terms of
    developer experience. But even more importantly, it's good for our community
    because it means we don't have to be weird and custom. Because there are a
    lot of materials out there on how to e. g. add Sass to your app with Vite —
    questions that the community does not have to maintain answers to. You get
    access to a wider world of resources, once we add more mainstream usage of
    the tools. So that's what nice about not hiding them behind our tractions
    anymore.

    Up until now we have had them behind layers in order to minimize the change
    that Ember developer would have to do [to the configuration]. Developers
    were used to running `ember s`, and we hid everything behind `ember s`. But
    we always knew there was a point where we were gonna stop doing that and we
    were gonna be able to use the tools directly. What Chris is describing is
    that it is good time now, and we wanted to do a leap from Webpack to Vite
    anyway. My goal with these changes... they are breaking changes, but the
    kind of breaking changes that costs to scale at your app, it's a change from
    config A to config B. The cost is not proportional to how big your app is.

    The big vision is of course is still that apps can... the vast majority of
    investment in all that code, no matter how vast it is, all occurs ❓ across.
    The fact that we're asking you to spell something differently in your
    `index.html` file is a breaking change, but it's a change that will be very
    easily absorbable because it does not scale at the size of your application.

    Compatibility is the whole name of the game, so I don't want to give you an
    impression that we don't care about it. We wery much do. But what we're
    talking about here is some costs that we think are very reasonable. Once you
    get onto the next major there are gonna be things that your teams can test
    out and do relitvely well scoped changes that do not scale with the size of
    your app.

  - Chris Manson on the roadmap for the next 6 months: For anybody who's new to
    the initiative and hasn't following along with Embroider, we have a public
    Embroider roadmap [here](). This is the Embroider core team roadmap, it's
    not the same as the initiative, but we're trying to get Embroider done,
    these items need to be done. The focus, as I have mentioned in the status
    update, we are laser-focused on the next step that myself and Andrey are
    working on with Ed's help is chipping away at the things that the rewritten
    app needs to be there for: pulling out the things that need to be written on
    disk and virtualized and essentially bubbling up into a better entry point
    into your app, all the work that's happening inside of the rewritten app.

    So we're gonna get that working and the plan is to make it so that
    Embroider's whole CI is using just the Vite app rather than the oldschool
    way of doing it with Ember CLI and Webpack. And once that's done, once we
    have Vite working, then we need to work on the inversion of control for
    Webpack, backfilling Webpack support. Then as I said we have to work as far
    as we can on getting previous versions of Ember supported. What that looks
    like is likely going to be a lot of compat adapters for Ember itself or for
    Ember Data. Ember Data has proved to be especially tricky for use of modules
    for us. [Ed: the newest Ember Data is in good shape.] There might be a case
    that `ember-source`'s support will be larger than Ember Data's support, but
    we'll see about that. Ideally we'd like to support both, but we'll see.

    So that's from the technical perspective. Obviously, getting the work done
    is important, but the second thing that the initiative is all about is
    getting these things to be the default experience for everybody else in
    Ember. What we're trying to do is getting everybody along with us and making
    sure that our community isn't forked from an old way of doing things to the
    new way. And what that means in practice is that there are a number of RFCs
    that need to be implemented and completed as the ones Ed's working on at the
    moment, deprecating AMD (asyhncrhonous module definition). That RFC is also
    known as "strict ES modules", which essentially prohibits addons from using
    things like `window.require.*` entries, checking if things are loaded
    already in the AMD loader. It's kind of not the way that you're supposed to
    do it in modern JavaScript. If we deprecate that — and there's also a time
    limit as to what version of Ember it can be removed in — it also means that
    lots of addons will start getting deprecation warnings, and hopefully more
    and more addons will stop doing the bad thing and start being supportable in
    this new modern world of Embroider.

    The other two key RFCs are v2 addon as default, we've got this v2 addon
    format that's pretty robust at the moment, there's a lot of work still to be
    done, but there's a separate process to make that when you do `ember addon`,
    or whatever the generator looks like at the time of release, when you
    generate an addon, it's not opting into v2, it's just v2 by default. There's
    going to be a lot of community work to make sure that it's good enough. For
    example right now we don't have generators for v2 addons. So if we accept
    that the community relies on generators to produce e. g. components in a v2
    addon, then we need to have a story for that. And we have the hard work
    story on how to make something awesome for it, and then we have a backup
    which is so just we can use the blueprints that we have now, which is not
    great for various reasons, but it's not gonna be impossible for us to fix
    that issue.

    And then the last notable RFC is what we've been calling internally the v2
    app spec. v2 addon spec was very strict as to how your addon's layered, how
    things are laid out on disk and how things are published. We are
    experimenting with the new app layout as part of the work that's currently
    happening on `main` in Embroider, but we'll have to get the community buy in
    on that. Essentially, when you do `ember new`, it will look different, and
    we want people to buy into that as a community to make sure that it's okay
    with that, resolving all the difficulties and all the problems. Vite by
    default will be part of that and there are a lot of pieces there, but that's
    essentially a bucket that will hold a lot of work for us, that's the big
    ticket. When v2 app RFC is recommended, people using `ember new` will have
    an Embroider-only Vite app that works very well.

    Ed: and when we say "changing the app layer", we don't really mean drastical
    changes to where you put your stuff, it's gonna be like how the `index.html`
    is stated, where it goes, what's in it, changing the `config/environment`
    system, having a Babel config that is actually present in the app and not
    embedded into Ember CLI. Kinda the setup machinery changing. We're not
    proposing changes to the `app/` folder that would affect developer learning
    experience. It's not gonna be like another Module Unification System or
    anything like that.

    Chris: that's all for the roadmap. Some of the buckets mentioned are quite
    large, there is a lot of devil in the details. But I think if we get those
    things done, we can consider this a successful project. Ed: one way we're
    gonna get things working by default and get them smooth as Chris said, some
    of that comes down to doing RFCs so that we can begin pushing deprecations
    out into all existing Ember apps whenever they get an upgrade. It's
    effectively a pull-based thing [opt-in], until we're ready, of course, so
    doing new things as Embroider is a pull-based thing so if you stick to the
    defaults, it does not bother you. But as we begin to land RFCs, the default
    experience is gonna change.

    Ed: The reason we're testing on Ember Canary as our target while we're
    experimenting with Vite is because `ember-source` as of Canary now has got
    rid of all of internal dependencies on the AMD loader. That stuff is already
    gonna be benefitting to all EmberJS users on the regular release chain,
    without any opt into Emboroider. There's more of that coming down the pipe.
    The cleanup in Ember itself (`ember-source`), in Ember CLI, in
    `ember-auto-import` to make opt-ins to stricter behaviors that are gonna
    make things much closer, and even though they aren't gonna work on Embroider
    and Vite, they are already warning people in the ecosystem. I'm prioritizing
    this because I do want it landed in the timeframe where we will deprecate
    not having the strict behaviors and remove in Ember 6, so that Ember 6 only
    supports true ES module behaviors.

    Chris: and to everybody who is not in the inner circle, there's new rule
    where we can't add new deprecations after 5.10. There's gonna be 5.12 and
    then 6 'cause of the new RFCs that came out recently, but the last chance
    for new deprecations is 5.10. It essentially means that we have between 12
    and 18 weeks to get deprecations that we want to remove in Ember 6 done from
    start to finish.

    Ed: and of course the point is to do it properly so that it's practical for
    people to actually achieve. We don't want to slam people with very difficult
    deprecations that they can't get over.

    Ed: we have a list of popular addons that are touching the wrong stuff. I
    don't actually think that it's a super long list, things that are gonna
    block... Most apps don't have hundreds of places that are using or touching
    the AMD loader. We have one or two, but they are quite popular because they
    were encouraged to everybody to use.

    Chris: a lot of things that I have been able to successfully do in the last
    six months have been a result of trying to solve things for the initiative
    backers. For example, we've just more than halved the build time for one of
    the clients. Something in Embroider was looping too many times while not
    having cache. This will be also quite useful when moving to Vite because
    iniative backers will try it on their apps early, and they will explode for
    fun and wonderful reasons, and that will ultimately make the wider
    community's experience of moving to Vite a lot better and that we have to
    rememeber is the reason we're here with the initiative: we have to make sure
    that the community is strong, that we get new Ember developers wanting to
    build Ember apps and actually inventing new things that everybody can use.

- Current progress

  - Work on virtualizing the app folder

    - What it is

      The role of Embroider is to transform Ember app files in such a way that
      they are compatible with standard JS practices that Vite understands,
      working around numerous Ember and Ember CLI quirks. Currently, a portion
      of this task is implemented by re-emitting transformed `app/` directory to
      a temporary folder on disk. We are changing this approach. Instead of
      making app files physically available on disk, they are _virtualized_.
      Vite will be asking Embroider about each such file via a Vite hook, and
      Embroider will be serving it dynamically.

    - Why is it necessary

      The current way of building app files has three major disadvantages:

      - It is slow, as everything needs to be built all at once, rather than on
        demand (for development builds).
      - It happens during the stages 1 and 2 of Embroider, meaning that it's in
        Broccoli realm.
      - Ember app makes Vite confused: Vite cannot distinguish between app files
        and dependencies, which is important.

    - The progress

      This has been an "exploratory attack" as much as development effort.

      We started by changing the entry point of an Ember app. Currently, the
      entry point is a dummy `assets/app-name.js` file that imports Ember's
      `app.js` along with all the app and addon modules. Our goal is to make
      `app.js` the entry point it import all the app and addon modules from it.

      We have started refactoring away of
      [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) and
      its `require`/`define` globals towards using native `import`. This is a
      big deal, as reliance on a custom AMD implementation was a thing that made
      Ember stand out and also prevented made it impossible to run more than one
      Ember app on one page.

      In the process, we also strive to replace Embroider's `importSync` with
      native `import` as much as possible.

      We are moving the list of modules to import from the `app.js` file into a
      virtual file that `app.js` imports but that does not exist on disk. Vite
      asks Embroider for the contents of that file via a hook, and Embroider
      provides it.

      Though Vite works during Embroider's stage 3, our WIP implementation will
      still rely on a list of app modules prepared during stages 1 and 2. Our
      current goal, after finishing the previous step, is to stop relying on
      stage 2 for this. This is a challenging task as it implies leaving the and
      leave the Broccoli realm and preparing the list of modules based solely on
      inspecting the contents of the `app/` directory.

    - Next challenge

      Ember addons are able to add their own content into the `app/` directory.
      For example, you can import from `my-app/foo`, but that module does not
      exists in your app's codebase and is provided by one of the addons. When a
      naming collision happens and the same module is provided both by an addon
      and the app, the app wins.

      In the case of a naming collision, we don't want Embroider to import both
      files into the app, so we need to detect such collisions and resolve them.

      But this is only the tip of the iceberg, as app files can be created and
      removed during development. This results in a regression caused by a race
      condition, which has been caught by one of the watch mode tests mentioned
      in
      [the previous blog post](2023-11-16-embroider-initiative-progress-update).
      To resolve this, we need to very carefully build a custom watcher, looking
      for changes to the app folder and re-evaluating naming collisions.
