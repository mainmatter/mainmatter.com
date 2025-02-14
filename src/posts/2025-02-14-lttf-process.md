---
title: "Progressively Improving a Massive Codebase With Lint to the Future"
authorHandle: real_ate
tags: ["lint"]
bio: "Senior Software Engineer, Creator of Lint to the Future"
description: "A walkthrough of the day-to-day process of using Lint to the Future to iteratively improve your codebase"
og:
  image: 
tagline: |
  <p>
    With Lint to the Future you can quickly add new lint rules and track all the places that you still need to fix. In this article, we'll go into more detail about how to work through those big lists of files you have yet to fix all the lint rules for.
  </p>
---

## Intro

For anyone who has talked to me recently in a professional capacity, you will know that I'm low-key obsessed with using [Lint to the Future](https://github.com/mansona/lint-to-the-future) to gradually improve a codebase. This post isn't going to go much into what Lint to the Future is, but instead I'm going to showcase the day-to-day process I'm using to migrate ~6k files.

## TLDR;

I'll list the commands that you'll learn about in this post, feel free to keep reading to get the context:

- `npx lttf ignore`
- `npx lttf remove my-custom-plugin/name-of-rule --filter 'app/**/*.[tj]s'`
- `eslint --no-eslintrc --parser-options "{ecmaVersion: 2021, sourceType: \"module\"}" --env "es6" --parser "@typescript-eslint/parser" --fix --no-inline-config --rule "{ my-custom-plugin/name-of-rule: error }" --plugin "my-custom-plugin" ./app/**/*.[tj]s`
- `npx codeowners-commit`

## What is Lint to the Future

Like I said in the intro, I'm not going to go into this too much. [I've given a talk at EmberConf](https://youtu.be/Nl8gHDdkI0Y?si=3GOYECfPkGVsj_YW) if you want a bit more detail but the high level idea is this:

You want to enable a new lint rule for your repo but you don't want to enable it and fix it for all the files at once. You know it's pointless enabling a lint rule as a warning because it will just get ignored and people will find it annoying. You want to draw a **temporary** line under the files that you currently have in the repo and make sure that any new files don't get introduced that violate the lint rule. And finally you want to be able to keep track of all the files that you temporarily ignored so you can come back and fix them over time.

This is the process that Lint to the Future enables 🎉 Once you have identified a new lint rule (or written a custom one) that you want to enable you follow these steps:

- enable that rule for your entire codebase as an **error**
- Install Lint to the Future (if you haven't already)
- Run `npx lttf ignore` to add file-based ignores to all the files that have lint errors
- Install the Lint to the Future dashboard to keep track of your files that you want to come back to

I have used this process to improve a number of codebases in the past years and I have to say it feels glorious. I guess it's just a trick of our psycology that seeing the graph slowly go down over time can be a great source of dopamine.

But this just describes how to start using Lint to the Future, now that you have started using it what's the best way to work down those graphs?

## Burning down the graphs

As I said in the intro, I am currently working with a client that has a rule they want to fix across ~6k files. You might think, "fine, let's just run `eslint --fix` on the whole codebase and be done with it". I would not recommend this, even for lint rules that have a perfect fixer implementation with no risk of failure. The reason it's better to split the work is because of the **cognitive load** that it puts on the reviewer to give an approval to a massive PR. I talk about the briefly in my [git good blog post](/blog/2021/05/26/keeping-a-clean-git-history/), but you should have small targeted PRs that make a single logical change at a time.

Here is the process that I'm currently using to burn down those 6k files

### Remove all the lint ignores from a part of the app

Lint to the future started with the ability to automatically add lint ignores to all your files. As people started to use it the very first feature request was to add the ability to remove lint ignores from all your files, this may seem like a silly request at first but it can be very tedious to remove ignoes from the top of each file you want to fix and using find and replace can be tempermental. So to remove a lint ignore across all your files you can run:

```
npx lttf remove my-custom-plugin/name-of-rule --filter 'app/**/*.[tj]s'
```

This will remove all of the file-based ignores from each of the JS or TS files in `app/`.

### Fix the rule if it has an auto fixer

If you have a fast eslint setup this step is super easy

`eslint . --fix`

But alas not all of us have a fast setup 😔 And you can probalby guess that if I'm working with such a large codebase that has 6k files to fix I don't have a fast eslint setup. Since you know which rule you want to target it would be pretty nice to run eslint with just one rule setup to improve the performance, but alas this isn't easy.

If you search for "how to run eslint with one rule" you will get a number of different approachs, some plugins, and even an eslint wrapper that can do what you need. I tend to work with a carefully crafted command line execution that I edit accordingly. I'll show you the command first and then I'll break it down:

```
eslint --no-eslintrc --parser-options "{ecmaVersion: 2021, sourceType: \"module\"}" --env "es6" --parser "@typescript-eslint/parser" --fix --no-inline-config --rule "{ my-custom-plugin/name-of-rule: error }" --plugin "my-custom-plugin" ./app/**/*.[tj]s
```

If you think this is a mouthful then you'd be right 🫠 It shouldn't really be this hard to execute eslint for a single rule but as I break it down you'll understand why it is.

The key thing here is that when we pass `--no-eslintrc` it's not going to load **anything** from your config, and that doesn't just mean rules. If you are using typescript in your project you probably have parser options that allow eslint to even read your files, this is what the first block of commands referrs to:

```
--parser-options "{ecmaVersion: 2021, sourceType: \"module\"}" --env "es6" --parser "@typescript-eslint/parser"
```

Next we have `--fix` which is the same as the simple case. Then `--no-inline-config` will stop any extra config that you have added to files using elint comments from interfering with what we're trying to do.

Then we need to setup your custom rule:

```
--rule "{ my-custom-plugin/name-of-rule: error }" --plugin "my-custom-plugin"
```

If you've written your own eslint rule in your own plugin it's not enough to just pass the rule name, you need to tell eslint about which plugin that rule comes from.

> Bonus argument: If you're working in a monorepo and want to run things from the root but there are eslint ignores stopping you then you can add `--no-ignore` to the command. ⚠️ this can cause to you run the fix on files that you actually didn't intend to so be careful.

### Batch commit your fixes

If you're following along with the steps you should have a whole bunch of files in your app folder changed but not committed to git yet. If we're going to split these up to separate PRs we need a way to easily split these commits, and I have a tool for that! I created the tool [codeowners-commit](https://github.com/mansona/codeowners-commit) for exactly this purpose. If you're working on a project that has 6k files to fix you will likely also already know about a [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) file. You might even have some sort of review process that requires a team to review their code. `codeowners-commit` batches files into commits that are

- grouped by their codeowner and
- into batches with a maximum of 100 files (by default)

If you don't have a codeowners file that's fine, that would just be a empty codeowner for each file and you would only be batching by maximum files in this case. To run it all you need to do is:

```
npx codeowners-commit
```

And your current branch will have a number of new batched commits that you can cherry-pick into new PRs to your heart's content!

> Bonus argument: if the default of 100 files per commit is just too little then you can pass `--max-files 200` and it will bump up the max files per batch 👍

## Conclusion

If you found this helpful please [let me know on Bluesky](https://bsky.app/profile/chris.manson.ie) and feel free to send me your awesome graphs going down and to the right, together we can make our code better one step at a time 💪
