---
title: "Progressively Improving a Massive Codebase With Lint to the Future"
authorHandle: real_ate
tags: ["process"]
bio: "Senior Software Engineer, Creator of Lint to the Future"
description: "A walkthrough of the day-to-day process of using Lint to the Future to iteratively improve your codebase"
og:
  image: "/assets/images/posts/2025-03-03-lttf-process/lttf-process-og.jpg"
tagline: |
  <p>
    When did you last want to add a new lint rule to a massive codebase but decided against it because it would be too much effort to fix all the existing files? You may have considered turning the new rule on as a warning but realised it was pointless because lint warnings are too easy to ignore. This post offers a better way to add new lint rules to existing codebases with Lint to the Future and teaches you the best way to progressively improve your codebase over time.
  </p>
---

## Intro

Anyone who has talked to me recently in a professional capacity will know that I'm low-key obsessed with using [Lint to the Future](https://github.com/mansona/lint-to-the-future) to improve a codebase gradually. I'm going to showcase the day-to-day process I'm using to migrate ~6k files.

## What is Lint to the Future

To see more detail on what Lint to the Future is, you can see the talk that [I've given a talk at EmberConf](https://youtu.be/Nl8gHDdkI0Y?si=3GOYECfPkGVsj_YW). The high-level idea is this:

- You want to enable a new lint rule for your repo but you don't want to enable it and fix it for all the files all at once.
- You know it's pointless enabling a lint rule as a warning because it will just get ignored and people will find it annoying.
- You want to draw a **temporary** line under the files that you currently have in the repo
- You want to ensure that nobody introduces **new** files violating the lint rule to the codebase.
- Finally, you want to be able to keep track of all the files that you temporarily ignored so you can come back and fix them over time.

This is the situation that Lint to the Future is designed to help you with. Once you have identified a new lint rule (or written a custom one) that you want to enable you follow these steps:

- Enable that rule for your entire codebase as an **error**
- Install Lint to the Future (if you haven't already)
- Run `npx lttf ignore` to add file-based ignores to all the files that have lint errors
- Install the Lint to the Future dashboard to keep track of the files that you want to come back to

![Example graph the Lint to the Future dashboard produces](/assets/images/posts/2025-03-03-lttf-process/lttf-graph.png)

I have used this process to improve a number of codebases in the past years and it feels glorious. I guess it's just a trick of our psychology that seeing the graph slowly go down over time can be a great source of dopamine.

This only describes how to start using Lint to the Future. Now that you have started using it, what's the best way to burn down those graphs?

## Burning down the graphs

As I said in the intro, I am currently working with a client that has a rule they want to fix across ~6k files. You might think, "Fine, let's just run `eslint --fix` on the whole codebase and be done with it". I would not recommend this, even for lint rules with a perfect fixer implementation and no risk of failure. The reason it's better to split the work is because of the **cognitive load** that it puts on the reviewer to approve a massive PR. I firmly believe that you should always have small targeted PRs that make a single logical change, and I talk about them briefly in my [git good blog post](/blog/2021/05/26/keeping-a-clean-git-history/) if you want to read more about why that's a good thing.

Here is the process that I'm currently using to burn down those 6k files:

### Remove all the lint ignores from a part of the app

Lint to the Future started with the ability to automatically add lint ignores to all your files. As people began to use it the very first feature request was to add the ability to remove lint ignores from all your files; this may seem like a silly request at first but it can be very tedious to remove ignores from the top of each file you want to fix and using find and replace can be temperamental. So to remove a lint ignore across all your files you can run:

```
npx lttf remove my-custom-plugin/name-of-rule --filter 'app/**/*.[tj]s'
```

This command will remove all file-based ignores for the `my-custom-plugin/name-of-rule` rule from each JS or TS file in `app/`.

### Fix the rule if it has an auto fixer

For most repos, running eslint should be super quick so you can fix rules using the standard recommended eslint command:

`eslint . --fix`

Unfortunately, not all of us have a fast setup 😔 Because I'm working with such a large codebase that has 6k files to fix, my eslint is a bit slower than usual, but the real problem that we face with this repo is the use of the [`typescript-eslint` plugin](https://typescript-eslint.io). With `typescript-eslint` it has to do a complete `tsc` compilation of your codebase before it can give you any type information for your lint rules, and if your `tsc` is slow your `eslint` is doubly slow. Since you know which rule you want to target it would be nice to run `eslint` with just one rule setup to improve the performance, but alas this isn't easy.

If you search for "how to run eslint with one rule" you will find many different approaches. You might find some eslint plugins and even an eslint wrapper script that can do what you need. I have been working with a carefully crafted command line execution that I edit accordingly. I'll show you the command first and then break it down:

```
eslint --no-eslintrc --parser-options "{ecmaVersion: 2021, sourceType: \"module\"}" --env "es6" --parser "@typescript-eslint/parser" --fix --no-inline-config --rule "{ my-custom-plugin/name-of-rule: error }" --plugin "my-custom-plugin" ./app/**/*.[tj]s
```

If you think this is a mouthful, you'd be right 🫠. Executing eslint for a single rule shouldn't be this hard, but as I break it down, you'll understand why it is.

The key thing here is that when we pass `--no-eslintrc`, it will not load **anything** from your config, and that doesn't just mean rules. If you are using TypeScript in your project you probably have parser options that allow eslint to even read your files; this is what the first block of commands refers to:

```
--parser-options "{ecmaVersion: 2021, sourceType: \"module\"}" --env "es6" --parser "@typescript-eslint/parser"
```

Next we have `--fix` which is the same as the simple case. Then `--no-inline-config` will stop any extra config you have added to files using eslint comments from interfering with what we're trying to do.

Then we need to set up your custom rule:

```
--rule "{ my-custom-plugin/name-of-rule: error }" --plugin "my-custom-plugin"
```

If you've written your own eslint rule in your own plugin, it's not enough to pass the rule name; you need to tell eslint which plugin that rule comes from.

**Bonus argument:** If you're working in a monorepo and want to run things from the root but there are eslint ignores set up that are stopping you then you can add `--no-ignore` to the command. ⚠️ This can cause you to run the fix on files that you didn't intend to so be careful.

### Batch commit your fixes

If you're following along with the steps you should have a whole bunch of files in your app folder changed but not committed to git yet. If we want to split these into separate PRs, we need a way to split the file changes into different commits, and I have a tool for that! I created the tool [codeowners-commit](https://github.com/mansona/codeowners-commit) for this purpose. If you're working on a project that has 6k files to fix you will likely also already know about a [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) file. You might even have some review process that requires a team to review their code. `codeowners-commit` batches files into commits that are

- grouped by their codeowner
- grouped into batches with a maximum of 100 files (by default)

If you don't have a codeowners file, that's fine. This would result in an empty codeowner for each file, and you would only be batching by maximum files in this case. To run it all you need to do is:

```
npx codeowners-commit
```

And your current branch will have a number of new batched commits that you can cherry-pick into new PRs to your heart's content!

**Bonus argument** If the default of 100 files per commit is just too little then you can pass `--max-files <number_of_files>` and it will bump up the max files per batch 👍

## Summary of the commands in this post

Here is a recap of each of the commands that we have learned about in this post; this will give you an easy place to refer back to and a convenient anchor to bookmark if you wanted to:

- `npx lttf ignore`
- `npx lttf remove my-custom-plugin/name-of-rule --filter 'app/**/*.[tj]s'`
- `eslint --no-eslintrc \`
  - `--parser-options "{ecmaVersion: 2021, sourceType: \"module\"}" \`
  - `--env "es6" --parser "@typescript-eslint/parser" \`
  - `--fix --no-inline-config --rule "{ my-custom-plugin/name-of-rule: error }" \`
  - `--plugin "my-custom-plugin" ./app/**/*.[tj]s`
- `npx codeowners-commit`

**Note:** Remember the eslint command is massive so I had to split it into multiple lines here.

## Conclusion

If you found this helpful, please [let me know on Bluesky](https://bsky.app/profile/chris.manson.ie) and feel free to send me your awesome graphs going down and to the right, together we can make our code better, one step at a time 💪
