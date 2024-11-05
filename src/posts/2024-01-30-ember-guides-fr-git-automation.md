---
title: "Automating the maintenance of the Ember Guides in French"
authorHandle: academierenards
tags: [ember, node, git]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "Marine Dunstetter builds an automation script in Node.js to maintain the translation of the Ember Guides with git and GitHub."
og:
  image: "/assets/images/posts/2024-01-30-ember-guides-fr-git-automation/og-image.jpg"
tagline: |
  <p>
    One of the main blockers to translation projects is the overwhelming question: how do you maintain it? The tool you're building is already big, and the English docs for this tool are generally a complete website that you must keep up to date. What's the best approach to setting up translations? The answer's probably unique to each project. But how to make maintenance a realistic task? The answer contains a tiny bit of genericity: automation saves time. The Ember Guides are currently being translated into French, and what I built to automate the maintenance might give you some ideas. It's going to be about Node.js, git, and GitHub API.
  </p>

image: "/assets/images/posts/2024-01-30-ember-guides-fr-git-automation/header.jpg"
imageAlt: "The Ember logo on a grey background picture displaying a robot at work in a factory"
---

As I am writing this blog post, [the Ember Guides](https://guides.emberjs.com/release/) are being translated into French. [The French website](https://ember-fr-guides.netlify.app) documents only the latest version of Ember (for time and human resources purposes). It means that when a new version of Ember is documented in English, we must adjust the French website accordingly. Let's say we must _"catch up"_ with the English version.

At EmberFest 2023, I presented the approach used to build the French website, and I described [the manual process of catching up with English](https://www.youtube.com/watch?v=hTc_vH-AQdk&t=282s) when a new version of the docs is released. However, such process is not a realistic way to maintain the website in the long run.

Let's go on a journey to automate everything with a Node.js script that will run git commands and make requests to GitHub API! 🤖

**Disclaimer:**

✅ This article will be a technical article to build a modern Node.js script from scratch. It aims to be accessible to beginners~intermediates, and we'll use the maintenance of the Ember Guides FR as a theme to introduce many concepts like using a modern node version, running commands, managing files and making API requests. However, it's not a "tutorial", because we create the script in an existing app. We don't start from a blank page nor expect you to achieve exactly the same thing.

❌ This article won't be about how to bootstrap a translation project and how to organize it to make it work in the long term. I can simply say that automating the maintenance where it's possible and being confident in the tools you build is a good way to remove pressure and entertain motivation.

**Prerequisites:**

- To automate the maintenance, we are going to execute a [Node.js](https://nodejs.org/en) script to write instructions in JavaScript, so we need to have Node.js installed.
- The article could be easier to follow if you first have a look at [the part of the EmberFest talk related to git](https://www.youtube.com/watch?v=hTc_vH-AQdk&t=282s). At the beginning of each section, I will sum up the information we need in a small paragraph 🐹🎥 _The talk in a nutshell_.
- Finally, here is how my repository is configured. The French app's repo (`ember-fr-guides-source`) is a fork of the official Ember Guides' repo (`guides-source`):

```bash
% git remote -v
origin git@github.com:DazzlingFugu/ember-fr-guides-source.git (fetch and push)
upstream git@github.com:ember-learn/guides-source.git (fetch and push)
```

## Table of contents

- [1. Writing a modern Node.js script](#1.-writing-a-modern-node.js-script)
  - [a. Running an mjs script](#a.-running-an-mjs-script)
  - [b. Running a script with arguments](#b.-running-a-script-with-arguments)
  - [c. Using an environment variable](#c.-using-an-environment-variable)
- [2. Using git in a Node.js script](#2.-using-git-in-a-node.js-script)
  - [a. Running git commands from a script](#a.-running-git-commands-from-a-script)
  - [b. Using git diff like a boss](#b.-using-git-diff-like-a-boss)
  - [c. Managing new markdown files](#c.-managing-new-markdown-files)
  - [d. Closing commands](#d.-closing-commands)
- [3. Managing files with Node.js](#3.-managing-files-with-node.js)
  - [a. Reading files synchronously](#a.-reading-files-synchronously)
  - [b. Creating files into a new folder](#b.-creating-files-into-a-new-folder)
  - [c. Writing files asynchronously](#c.-writing-files-asynchronously)
  - [d. Waiting for asynchronous operations with `map` and `Promise.all`](#d.-waiting-for-asynchronous-operations-with-map-and-promise.all)
- [4. Posting GitHub API requests with Node.js](#4.-posting-github-api-requests-with-node.js)
  - [a. Preparing the payload](#a.-preparing-the-payload)
  - [b. Using the fetch API](#b.-using-the-fetch-api)
  - [c. Opening a PR with GitHub API](#c.-opening-a-pr-with-github-api)
- [Last words](#last-words)

## 1. Writing a modern Node.js script

🐹🎥 _The talk in a nutshell:_ A new version of the Ember Guides was published 🔥 What are the changes? To visualize them clearly, we can only compare English to English: our repository has a protected `ref-upstream` branch that corresponds to the English version under translation. We want to compare `ref-upstream` to `upstream/master` to see the changes between both English versions. If there are changes in files that are not translated yet, we want to apply them automatically. If there are changes in files that have been translated into French, we want GitHub to open an issue containing the diff. To picture this part better, here is the kind of issue we want to open: [#213 Translate /addons-and-dependencies/index.md, Ember 5.4](https://github.com/DazzlingFugu/ember-fr-guides-source/issues/213).

Out of this summary, there are a couple of things we already know about our script:

- It will post an issue on GitHub, which is an asynchronous fetch operation.
- It will know the versions of Ember we are dealing with, so we can write some beautiful "from Ember 5.4 to Ember 5.5" in the body of the issue.
- It will use GitHub API to post the issue.

Let's start with what we know then.

### a. Running an mjs script

🤔 What’s your version of Node.js, by the way?

You can check by running this command:

```js
% node -v
```

At the moment I am writing this, the latest version is v21.5.0. It lets us use modules and syntaxes like `async` and top-level `await` to bring clarity to our asynchronous operations. This might be very handy to manage our calls to GitHub API later, so let’s make sure we have the latest Node.js. The way to update Node.js depends on the tools you used to install it (`brew`, `nvm`, `volta`...) If, just like me, you never remember what it was, this could help:

```js
% whereis node
```

If you're not familiar with running Node.js scripts, here are the basics. In the `ember-fr-guides-source` folder, we create a file `scripts/catchup.mjs`:

```js
// ember-fr-guides-source/scripts/catchup.mjs
console.log("I love Ember");
```

ℹ️ The `m` in `mjs` stands for [Module](https://docs.fileformat.com/web/mjs/). By using modules, we'll be able to use `import` to bring functionality from node and external libraries into our script.

Then, from the terminal, we reach the folder `ember-fr-guides-source` and run:

```bash
% node scripts/catchup.mjs
> I love Ember
```

The output “I love Ember” shows up in the terminal. 🎉

### b. Running a script with arguments

🤔 If we want to write "from Ember 5.4 to Ember 5.5" in the body of our issue, then the script should know these numbers. First, we could declare two variables `currentEmberVersion` and `newEmberVersion`. Then we could assign hardcoded values `5.4` and `5.5`, but it would be inconvenient: each time we want to run the catch-up process in the future, we would have to modify the script. It would be better if we could specify the Ember versions in the command line.

Before running a node script, you can add arguments separated by spaces. When the script runs, the arguments will be accessible in `process.argv`. For instance, let's add the following log at the beginning of `catchup.mjs`:

```js
console.log(process.argv);
```

Then let's run:

```bash
% node scripts/catchup.mjs --from 5.1 --to=5.4 -o hey
> [
  '/Users/***/node/v21.5.0/bin/node',
  '/Users/***/ember-fr-guides-source/scripts/catchup.mjs',
  '--from',
  '5.1',
  '--to=5.4',
  '-o',
  'hey'
]
```

We could execute `process.argv.slice(2)` to remove the two first elements, then read options by index or using the [`indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf) function. Another handy solution is to rely on an external library like `minimist-lite`. This library maps the options we pass into a dictionary that makes the access more intuitive in the code:

```bash
% npm install minimist-lite --save-dev
```

ℹ️ This will add `minimist-lite` to the dev dependencies of our application. In our case, `ember-fr-guides-source` is already an Ember application with a `package.json`, so we have no problem running `npm install`. If you want to import dependencies in a standalone script, outside of an application folder, you'll need to initialize a package manager first. For instance, you can initialize `npm` with `npm init`.

We can now import `minimist-lite` in `catchup.mjs` and use it to map our options:

```js
import minimist from "minimist-lite";

var argv = minimist(process.argv.slice(2));
console.log(argv);
```

```bash
% node scripts/catchup.mjs --from 5.0 --to=5.4 -o hey
> { _: [], from: 5, to: 5.4, o: 'hey' }
```

As you can see, passing an option like `--to=5.4` would result in `argv.to === 5.4`, which is perfect. However, we have an issue with version numbers ending with `0`: `--from 5.0` would result in `5`. This is because `minimist-lite` manages numerical values as proper numbers. If we could indicate that options `from` and `to` should be treated as `string` values, this would solve our problem. `minimist-lite` can take options to let us specify the type of each argument. The documentation is a bit hard to decipher in my personal opinion, here is the syntax we need to figure out:

```diff
  import minimist from 'minimist-lite';

- var argv = minimist(process.argv.slice(2));
+ var argv = minimist(process.argv.slice(2), { string: ['from', 'to'] });
  console.log(argv);
```

`string` is an option that contains the array of arguments that should be handled as `string`:

```bash
% node scripts/catchup.mjs --from 5.0 --to=5.4 -o hey
> { _: [], from: '5.0', to: '5.4', o: 'hey' }
```

Now that we have the expected format, let's store the arguments into variables that we'll use later in our GitHub issue:

```js
import minimist from "minimist-lite";

// Read script argument
const argv = minimist(process.argv.slice(2), { string: ["from", "to"] });

// Read current Ember version (under translation)
const currentEmberVersion = argv.from;
if (currentEmberVersion.match(/\d+[.]\d+/g)?.[0] !== currentEmberVersion) {
  console.error(
    "Error: please provide the current Ember version under translation to option --from (e.g. --from=5.1)"
  );
  process.exit(9);
}
console.log(`Ember version under translation: ${currentEmberVersion}`);

// Read new Ember version (documented by the English guides)
const newEmberVersion = argv.to;
if (newEmberVersion.match(/\d+[.]\d+/g)?.[0] !== newEmberVersion) {
  console.error(
    "Error: please provide the new Ember version documented on upstream to option --to (e.g. --to=5.4)"
  );
  process.exit(9); // we'll come back to this line a bit later
}
console.log(`New Ember version documented on upstream: ${newEmberVersion}`);
```

ℹ️ `process.exit(9);` forces the process to exit. Any status but `0` indicates the process exited with errors. `9` is for invalid arguments. You can see the [list of error codes here](https://nodejs.org/api/process.html#exit-codes). Also, be aware that if you start async operations in a script and `process.exit(n);` executes, then you have no way to know for sure what operations the script could perform or not before existing. If for some reason all your async operations are not awaited, it's generally better to assign a value to `process.exitCode`. `process.exitCode = n;` means that _when the process finally exits_, it will exit with code `n`.

ℹ️ [`match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) finds all the occurrences of a given regexp in the string and returns them in an array. In our case, we expect the first occurrence of `d.d` (digit, dot, digit) to exist and to be equal to the argument value:

```bash
% node scripts/catchup.mjs --from=5.1typo --to=5.4
> Error: please provide the current Ember version under translation to option --from (e.g. --from=5.1)

% node scripts/catchup.mjs --from=5.1 --to=5.4
> Ember version under translation: 5.1
> New Ember version documented on upstream: 5.4
```

Great! Now we have the first piece of information to create a GitHub issue.

### c. Using an environment variable

Most of the time, when we want to create a new GitHub issue on a repository, we do it manually via GitHub UI. We can achieve the same thing using GitHub API. [Here is what it looks like](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue). As you can see in the JavaScript tab of the docs, GitHub recommends the usage of `Octokit` to interact with the API in JavaScript.

However, our case is pretty simple, and using the regular JavaScript method `fetch` with [https://api.github.com/](https://api.github.com/) is also possible. I decided to go with `fetch` because I think it’s a bit more accessible and generic, you could reuse this blog post more easily for different purposes. It’s essentially the same thing, except that we'll set our authorization header manually. Among other static things, the authorization header contains an `Authorization` field that must be filled with `Bearer <YOUR-TOKEN>`.

`<YOUR-TOKEN>` should be replaced with a secret token required by GitHub API to authenticate us and make sure we're allowed to use the API the way we try to use it. To generate a personal token, log in to your GitHub account and [follow this section of the docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic). Once your token is generated, copy it somewhere, in a local file, so you have it within easy reach.

🤔 `<YOUR-TOKEN>` is not supposed to change over time (at least not very often), but it’s sensitive, so it can’t be hardcoded in the script. We could pass a `token` as third argument:

```bash
% node scripts/togithub.mjs --from=5.1 --to=5.4 --token="<YOUR-TOKEN>"
```

It’s fine, but not good enough. We don’t want to copy the `token` manually from somewhere to our command line each time we want to run the script. It would be more convenient if the script could read the token by itself.

A common practice in web projects is to store the secret variables in a file `.env` which is added to the `.gitignore` file so we’re sure it won’t be committed to GitHub inadvertently. Along with this file, an `.env.example`, which contains fake values, is committed to GitHub and describes what secret variables the developer should set up to get the project working. The library [dotenv](https://www.npmjs.com/package/dotenv) brings this common practice into Node.js by providing the variables defined in `.env` through `process.env`:

```bash
% npm install dotenv --save-dev
```

```bash
// .env
GITHUB_TOKEN="<YOUR-TOKEN>"
```

❗ Make sure to add `.env` in the `.gitignore` file if it’s missing!

```js
import "dotenv/config";

console.log(process.env.GITHUB_TOKEN);
```

```bash
% node scripts/catchup.mjs --from=5.1 --to=5.4
> "<YOUR-TOKEN>"
```

Let's remove that `console.log`. The token can be read anywhere in the script, for instance in a function:

```js
/*
 * This function returns the headers required for all requests to GitHub API.
 * It includes both posting issues and opening the catch-up PR.
 */
const getRequestHeaders = () => {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
};
```

So far, we learned how to:

- execute a modern `mjs` script
- install and import external libraries
- pass and parse script arguments
- read environment variables

The script knows all the arguments it needs to automate the process 🎉

## 2. Using git in a Node.js script

🐹🎥 _The talk in a nutshell:_ A new version of the Ember Guides was published 🔥 To see the changes, we compare `origin/ref-upstream` to `upstream/master` and we print the result in a patch file `english.diff` that shows a list of diff blocks. If non-translated files have changes, we apply the changes automatically, which means these files are updated locally, which means we have to commit them in a working branch. Once that's done, we are officially translating the new Ember version, so we reset `origin/ref-upstream` to the same state as `upstream/master` to be ready for the next catch-up.

Sounds like the script is going to run a lot of git commands:

- It will create and switch to a new working branch.
- It will generate a patch file by comparing two branches.
- It will try to apply a patch file automatically.
- It will commit and push files.
- It will reset `origin/ref-upstream` to `upstream/master`.

### a. Running git commands from a script

First, we want to create a new "catch-up" branch to work on. In the terminal, we would do this with `git switch --create <branch-name>`. It would be nice to reuse our variable `newEmberVersion` in the name of the branch, both for the sake of clarity and to have the possibility to keep several catch-up branches locally if we need to. Unfortunately, we can’t write the shell commands we use in our terminal directly in the `catchup.mjs` file, because it’s not JavaScript! The good news is Node.js embeds a function to answer this problem. It's called `execSync`, and it's located in the `child_process` module:

```js
import { execSync } from "child_process";

const catchupBranch = `catchup-${newEmberVersion}`;

try {
  console.log(`Attempting to execute: "git switch --create ${catchupBranch}"`);
  execSync(`git switch --create ${catchupBranch}`);
} catch (error) {
  console.error(
    `Failed to prepare the git branches for the catch-up. This was caused by: ${error}`
  );
  process.exitCode = 1;
}
```

ℹ️ `Sync` stands for synchronous. It means the script execution will pause until the operation is complete. Node.js generally provides asynchronous functions along with a `Sync` version, so you can use one or the other (e.g. `exec` vs `execSync`). We'll come back to this later.

Our code will work once. If we call it twice, it will fail because the branch already exists. When the command specified to `execSync` fails, it throws an error, which could cause the process to exit immediately. We prevent this behavior with the [`try...catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) block and customize the error message.

Great! We can run git commands! 💪 We also want to run `git fetch` and `git fetch upstream` to make sure that `origin/ref-upstream` and `upstream/master` are both up to date before we start working with them. Let's abstract our logic in a function so we don't have to rewrite the log each time:

```diff
+ const runShell = (command) => {
+   console.log(`Attempting to execute: "${command}"`);
+   execSync(`${command}`);
+ }

  try {
-   console.log(`Attempting to execute: "git switch --create ${catchupBranch}"`);
-   execSync(`git switch --create ${catchupBranch}`);
+   // Create a catch-up branch out of the current branch (should be up to date master)
+   runShell('git switch --create ${catchupBranch}');
+   // Fetch the latest ref-upstream branch (English version under translation on this repo)
+   runShell('git fetch');
+   // Fetch the latest updates in the official Ember Guides
+   runShell('git fetch upstream');
  }
  // catch(error) { ... }
```

### b. Using git diff like a boss

The next step of the process is to generate the diff between `origin/ref-upstream` and `upstream/master` to view how the second impacts the first. In the talk, I gave several steps to build this command. The one we'll describe here is slightly different but does essentially the same thing:

```bash
git diff origin/ref-upstream upstream/master -- guides/release > english.diff
```

`git diff A B` compares one branch to another in the order A is impacted by B:

```diff
- Line number 24 in file myFile.md on branch A
+ Line number 24 in file myFile.md on branch B
```

The `--` option allows us to specify a path for the compare operation. We are not interested in all the changes in the whole app, we want to patch only the markdown files located in `guides/release`.

Then we output the result of this command in one big file called `english.diff`, which shows up at the root of the project. It contains one diff block per modified markdown file. This is where the manual process becomes a bit heavy:

- We run `git apply english.diff` to automatically apply the changes A → B to all files. But git can do this only if each target file is in English and hasn’t been translated yet. If at least one markdown file has been translated into French, it means both sides have been modified and are now completely different, so git doesn’t know what to do: the whole command fails.
- For each block causing a failure, we open manually a new issue on GitHub, copy the diff in there (so a translator can tackle it later), and then remove the block from `english.diff`. Then we run `git apply english.diff` again, etc, etc...
- We do this until `git apply english.diff` finally works because there are only non-translated English files targeted by the remaining diff blocks.

🤔 This iterative process doesn't look easy to automate. We probably need a quite different strategy, and we can probably make it simpler to picture!

`git apply` takes a path to a patch file. Instead of running `git apply english.diff` and the whole command fails when something goes wrong, it would be more convenient to try `git apply` block by block. What if we could have one patch file per markdown file? This way we could run `git apply file-1.diff`, `git apply file-2.diff`... and perform actions depending on the result.

Thanks to `-- guides/release` option, we learned that `git diff` command can scope the comparison to a given folder. We could also scope it to one single markdown file! So we would run the command with `-- [my-file-1].md > [my-file-1].diff` to output all the different patches. But how to get the list of markdown files that have been modified in `upstream/master`?

`git diff` can help us with another option called `--name-only`. Instead of returning all the diff blocks as we saw earlier, it will return only the name of the files containing changes!

To sum it up, here is the kind of implementation we want:

```js
/*
 * This function compares the given filename in both branches and output an [index].diff file.
 * Example:
 * filename = guides/accessibility/index.md, index = 3
 * The diff between ref-upstream and upstream/master for guides/accessibility/index.md is printed in 3.diff
 */
const createDiff = (filename, index) => {
  const diffName = `${index}.diff`;
  try {
    runShell(`git diff origin/ref-upstream upstream/master -- ${filename} > ${diffName}`);
    return diffName;
  } catch (error) {
    throw new Error(`Failed to create the diff for ${filename}. This was caused by: ${error}`);
  }
}

/*
 * This function generates a patch file for each file in files (using createDiff)
 * then tries to run 'git apply' for each patch.
 */
const applyPatches = (files) => {
  files.forEach((filename, index) => {
    try {
      let diffName = createDiff(filename, index);
      try {
        runShell(`git apply ${diffName}`);
      } catch (error) {
        console.log(`"git apply" command failed for ${diffName}`); // we prefer console.log over console.warn, because failure is part of the normal process
        // TODO: we'll need to keep track of this patch file to create a GitHub issue
      }
    } catch (error) {
      console.warn(error);
    }
  });
}

try {
  // Create catch-up branch and fetch last changes { ... }

  // Output the list of markdown files impacted by latest changes on upstream
  runShell('git diff --name-only origin/ref-upstream upstream/master -- guides/release > list.diff');

  // List of filenames that changed between origin/ref-upstream and upstream/master
  let files = /* TODO: read the content of 'list.diff' and parse it as an array of filename. */;

  if (files?.length > 0) {
    applyPatches(files);
  } else {
    console.log('No change between both versions of the Ember Guides.');
  }
} // catch(error) { ... }
```

That's a great start! There's just this blocking `TODO` (read the content of `list.diff`) we need to figure out, we'll come back to it in the next section.

### c. Managing new markdown files

🤔 We saw quite interesting `git diff` options to create all the resources we need. There's one case though, we didn't mention at all. What if some of the "changed" files are new files that have been added to the latest Ember docs and that don't exist at all in our current branch?

In that case, `git apply` will work like a charm and will create the new English file for us, but then... we'll need to open a GitHub issue to alert the translators there's something new to translate entirely. It means that the answer to the question "Should I open a GitHub issue?" doesn't depend only on `git apply`'s success or failure, it also depends on the existence of the file in the current branch, and at some point, we should probably track the files that need to be posted.

To check if the file exists on the current branch, we'll import a module called `fs` and use the function called `existsSync`. We'll learn more about the `fs` module in the next section of the blog post 😉

```diff
+ import fs from 'fs';

  const applyPatches = (files) => {
+   let filesToPost = [];
    files.forEach((filename, index) => {
      try {
        let diffName = createDiff(filename, index);
        try {
+         let isNew = !fs.existsSync(filename);
          runShell(`git apply ${diffName}`);
+         if (isNew) filesToPost.push(filename);
        } catch (error) {
          console.log(`"git apply" command failed for ${diffName}`); // we prefer console.log over console.error, because failure is part of the normal process
+         filesToPost.push(filename);
        }
      } catch (error) {
        console.warn(error);
      }
    });
+   return filesToPost;
  }

  // { ... }

- applyPatches(files);
+ let filesToPost = applyPatches(files);

```

ℹ️ `git apply` runs after we've initialized `isNew`, because it can create the missing file and therefore compromise the value.

### d. Closing commands

There are other git commands we need to include in the script: those happening at the end of the process:

- If we have local changes, we should commit them and push the catch-up branch to GitHub: this happens when at least one `git apply` worked.
- Once we're done with everything, we should reset `origin/ref-upstream` to `upstream/master` so we are ready for the next catch-up: this happens each time the process ends without error, even when there were no changes at all in `guides/release`.

There's no new concept here, we already have all the knowledge to put this in place:

```js
/*
 * This function performs the last actions once most of the catch-up is done.
 * It updates origin/ref-upstream to upstream/master if there's no pending manual action,
 * then it switches back to master.
 */
const closeProcess = pendingDiff => {
  if (!pendingDiff) {
    // This resets the ref-upstream branch to the latest upstream/master
    try {
      runShell("git switch ref-upstream");
      runShell("git reset --hard upstream/master");
      runShell("git push origin -f ref-upstream");
    } catch (error) {
      throw new Error(
        "Failed to reset ref-upstream to the latest upstream/master"
      );
    }

    // Then switches back to master
    try {
      runShell("git switch master");
    } catch (error) {
      console.warn(
        "The process is complete, but failed to switch back to master"
      );
    }
  }
};
```

We want `applyPatches` to tell us if at least one patch file couldn't be created and if at least one patch could be applied automatically. There are certainly different ways to achieve this, but for reasons we'll see in a later section of this blog post, let's go with a result code approach:

```diff
  const applyPatches = (files) => {
    let filesToPost = [];
+   let results = [];
    files.forEach((filename, index) => {
      try {
        let diffName = createDiff(filename, index);
        try {
          let isNew = !fs.existsSync(filename);
          runShell(`git apply ${diffName}`);
          if (isNew) filesToPost.push(filename);
+         results.push(0);
        } catch (error) {
          console.log(`"git apply" command failed for ${diffName}`);
          filesToPost.push(filename);
+         results.push(2);
        }
      } catch (error) {
        console.warn(error);
+       results.push(1);
      }
    });
-   return filesToPost;
+   return {
+     filesToPost,
+     hasAutoApply: result.some((status) => status === 0);
+     hasPendingDiff: result.some((status) => status === 1);
+   }
  }

  // { ... }

+ // True if origin/ref-upstream branch cannot be updated because we need some manual checks between ref-upstream and upstream/master
+ let pendingDiff = false;

  if (files && files.length > 0) {
-   let filesToPost = applyPatches(files);
+   let { filesToPost, hasAutoApply, hasPendingDiff } = applyPatches(files);
+   pendingDiff = hasPendingDiff;
+   if (hasAutoApply) {
+     // This adds, commits, and pushes changes in "guides" folder
+     try {
+       runShell("git add guides");
+       runShell(`git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"`);
+       runShell(`git push origin ${catchupBranch}`);
+       // TODO: if the changes have been pushed without error, then we can open a catch-up PR on GitHub
+     } catch (error) {
+       throw new Error("Failed to push the catch-up branch");
+     }
+   }
  } else {
    console.log('No change between both versions of the Ember Guides.');
  }

+ closeProcess(pendingDiff);

  // { ... }
```

So far, we learned how to:

- Run a shell command with `execSync`
- Output the result of a command in a file
- Compare branches with `git diff` and a panel of options to make it output information in different shapes

In theory, git does a lot of things for us at this point. "In theory" because our array of `files` is still desperately empty! Let's do something about that.

## 3. Managing files with Node.js

🐹🎥 _The talk in a nutshell:_ In the French website, we translate only the latest version of Ember, so the UI doesn't have a dropdown to navigate to legacy versions. To hide the dropdown automatically, our folders have a slightly different scaffolding. The subtlety is that our diff compares the markdown files located in `guides/release/`. But in our `master` branch (and our `catchup` branch), all these very same files are located directly in `guides/`. It means that the command `git apply ${diffName}` will fail to patch the updated files, because the script will look for them in `guides/release/` and notice they don't exist.

Here are the conclusions we can draw:

- We need to read `list.diff` and parse the list of filenames in our `files` array. Each item of the array will be a filename starting with `guides/release/`.
- To make our patch files valid in our scaffolding, we need a way to change the path to `guides/`.
- If a patch file cannot be applied automatically, we'll reuse its content to create the corresponding GitHub issue. And if we fail to post one GitHub issue among several, it will be easier to open it manually (trying to re-run the script for one given file is currently out of scope), so we'll keep the patch files easy to reach.

### a. Reading files synchronously

We want to read the content of `list.diff` to extract an array of filenames. To deal with files, we’re going to use [Node.js File System Module](https://nodejs.org/docs/latest-v21.x/api/fs.html#file-system) `fs`. It's the module we imported earlier, when we used `fs.existsSync`! Among all the functions this module provides, here are the ones we are interested in this time: `fs.readFile` and `fs.readFileSync`, which can read a file and return its content.

ℹ️ Just like we saw in the first section with `exec` versus `execSync`, most functions of the `fs` module are asynchronous and have a `Sync` alternative. The asynchronous functions should generally be preferred whenever it’s possible to use them because they allow the process to parallelize some tasks and therefore be faster.

But in our case, synchronicity makes more sense: as long as we don’t know the content of `list.diff`, we can’t know the list of files to handle next. `fs.readFileSync` retrieves the file out of the provided `filename` and returns its content:

```js
// Read list.diff to extract the list of paths to markdown files
let data = fs.readFileSync("list.diff", "utf8");
const files = data.split(/[\n\r]/).filter(name => name.length);
```

ℹ️ The first argument of `fs.readFileSync` is a relative path. `list.diff` is like `./list.diff`. Also, note that `./` is not the location of the `catchup.mjs` script, but it’s from where we are running the script. It means that if we are at the root of the `ember-fr-guides-source` folder and we use the command `node scripts/catchup.mjs` from there, then `./` is exactly where we are: the root of the `ember-fr-guides-source` folder. Here, the filename is `./list.diff` because we generated it at the root of the repository.

The content of `list.diff` contains one line per file name: using a [`split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) by line breakers then filtering potential empty values is enough to create our array.

We have our `files` ready, which means we can finally enter the function `applyPatches` to generate the patch file `[index].diff` for each of them.

🤔 But don't you think it's a bit rough to create all our files at the root of the project like this? Couldn't we create our patch files in a dedicated folder?

### b. Creating files into a new folder

When you need to create _temporary_ files and folders that are used only by the script and then can be deleted at the end of the process, you can use [the OS directory for temporary files](https://nodejs.org/api/os.html#ostmpdir) to ease the clean-up. Our patch files are not necessarily that kind of temporary files. Let's imagine we reuse these files to create 3 GitHub issues and for some reason one of the POST requests fails. Today, the easiest way to finish the catch-up is to open manually the missing issue, so having the patch file still around will become handy. For this reason, we will create the folder permanently on the catch-up branch.

Let’s create a new folder in the scripts folder:

```js
// Create a directory to put the children diff
fs.mkdirSync("scripts/patches", { recursive: true });
console.log("scripts/patches folder created to store the patch files");
```

ℹ️ Using the option `recursive: true` will prevent the command from failing if the `scripts` folder doesn't exist or there's already a `scripts/patches` folder. It's up to you to decide if that case is a problem or not.

We now have a good place for our files, so we can create them here:

```diff
  const createDiff = (filename, index) => {
-   const diffName = `${index}.diff`;
+   const diffName = `scripts/patches/${index}.diff`;
    try {
      runShell(`git diff origin/ref-upstream upstream/master -- ${filename} > ${diffName}`);
      return diffName;
    } // catch (error) { ... }
  }
```

The patch files are created in the `scripts/patches` folder. Once the file is written, `git apply` runs and... fails with the error "No such file or directory". Time to take care of this `guides` versus `guides/release` thing.

### c. Writing files asynchronously

The content of a patch file looks like this:

```diff
diff --git a/guides/release/accessibility/components.md b/guides/release/accessibility/components.md
index 2253b1bdd..6e0e2a99d 100644
--- a/guides/release/accessibility/components.md
+++ b/guides/release/accessibility/components.md
@@ -57,13 +57,15 @@ However, the most common methods for providing accessible names can be reviewed

 ### Adding a label to an input element

-The `<input>` element's `id` attribute value should be the same as the `for` attribute value on the `<label>`, like this:
+The `<input>` element's `id` attribute value should be the same as the `for` attribute value on the `<label>`. Ember has a built-in `unique-id` helper that can generate unique ids that you can use like this:

```

There are 4 occurrences of the path `guides/release` and we need to replace them with `guides`. It will mean it's the diff between `guides/accessibility/components.md` and some fictive `guides/accessibility/components.md` coming from the `b` branch. Manually, we would do this with “Find and Replace” in the code editor. Instead, let’s do it in JavaScript. The replacement function by itself is not the pain point, we've already done something similar before:

```js
/*
 * This function looks for the paths guides/release in the provided string and replaces it with guides.
 * We need this to adjust the paths to our scaffolding:
 * The official English guides allow to navigate to legacy versions of Ember, it's "versioned" docs.
 * The French guides show only the latest version, so we don't have a dropdown to navigate, it's "unversioned" docs.
 * It's the scaffolding of the guides folder that impacts the dropdown presence: instead of having a release/ folder
 * that corresponds to the latest version, we have the docs at the root of the guides folder.
 */
const unversionPath = stringContent => {
  return stringContent.replace(/guides\/release/g, "guides");
};
```

The question is more about how to use this function to edit files content. Just like before, there's a choice to make: `readFile` or `readFileSync`, then `writeFile` or `writeFileSync`:

```diff
  const applyPatches = (files) => {
    // { ... }
    files.forEach((filename, index) => {
      try {
        let diffName = createDiff(filename, index);

+       // TODO: fileContent = read(sync?) the content of 'diffName' file, then...

+       // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
+       const unversionedFileName = unversionPath(filename);
+       const replacement = unversionPath(fileContent);

+       // TODO: rewrite(sync?) the content of 'diffName' file with replacement, then...

        try {
-         let isNew = !fs.existsSync(fileName);
+         let isNew = !fs.existsSync(unversionedFileName);
          runShell(`git apply ${diffName}`);
-         if (isNew) filesToPost.push(filename);
+         if (isNew) filesToPost.push(unversionedFileName);
          results.push(0);
        } catch (error) {
          console.log(`"git apply" command failed for ${diffName}`);
-         filesToPost.push(filename);
+         filesToPost.push(unversionedFileName);
          results.push(2);
        }
      } // catch (error) { ... }
    });
    return { ... }
  }
```

With the async method, we don’t know when each "then" will be executed. For instance, even if our array is ordered, the file at index 12 could be edited before the file at index 3. Would this be a problem in our case? I don’t think so. At the end of the day, we want all the files to be edited, we are not interested in the execution order. So we can go with the async functions.

The asynchronous functions provided by `fs` module are essentially the same as the synchronous ones, except that the last argument is a callback function that will be executed only once the operation is done. To use the [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) syntax instead, we can rely on the `fs/promises` module that provides the same functions returning a promise.

Here is what the core of the loop should look like:

```js
import { readFile, writeFile } from 'fs/promises'; // This goes to the top of the script

const applyPatches = async (files) => { // The function is now async
  // { ... }
  files.forEach(async (filename, index) => { // 🙀 We'll change that in the next section
    try {
      let diffName = createDiff(filename, index);
      let fileContent = await readFile(diffName, 'utf8');

      // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
      const unversionedFileName = unversionPath(filename);
      const replacement = unversionPath(fileContent);
      await writeFile(diffName, replacement, 'utf8');

      try {
        let isNew = !fs.existsSync(unversionedFileName);
        runShell(`git apply ${diffName}`);
        if (isNew) filesToPost.push(unversionedFileName);
        results.push(0);
      } catch (error) {
        console.log(`"git apply" command failed for ${diffName}`);
        filesToPost.push(unversionedFileName, diffName);
        results.push(2);
      }

    } catch(error) {
      console.warn(error);
      results.push(1);
    }
  }
  // return { ... }
}
```

🙀 We can't use `async/await` in a `forEach` loop. In the next section, let's take a step back and see what the problem is.

But let's allow ourselves to be happy with the core of the loop. Inside the loop, `git apply` really does what we want it to do! For each patch file created and edited, we try to run `git apply`:

- If the target file is not translated, it works! 🎉 we have the diff automatically applied!
- If the target file is in French, the command fails. We will reuse the content of the patch file in the body of our GitHub issue.

### d. Waiting for asynchronous operations with `map` and `Promise.all`

Let's go back a second to the script instructions. We have a function `applyPatches` that creates all the patch files and tries to apply them. If there is at least one markdown file that could be updated automatically, we push the changes. If we tracked some patch files that couldn't be applied, we open GitHub issues:

```js
let { filesToPost, hasAutoApply, hasPendingDiff } = applyPatches(files);

// TODO: postAllIssues(filesToPost)

if (hasAutoApply) {
  // commit and push changes { ... }
  // TODO: open a catch-up PR on GitHub
}
```

The above supposes that once `applyPatches` is executed, `hasAutoApply`, `hasPendingDiff` and `filesToPost` have their final value. It used to be the case when `applyPatches` was a synchronous function, but we have just made it asynchronous. If we simply write the `await` operator before the function call... it won't work (at least, not yet). The code will move to the next instruction immediately without waiting for `hasAutoApply`, `hasPendingDiff` and `filesToPost` to be ready. Why that?

Because of the `forEach` loop in `applyPatches`. We can't use `async/await` in a `forEach` loop, because `forEach` is not promise-aware, the iteration doesn't return a value so there's no value to potentially wait for, and `forEach` never waits to move to the next iteration after an async code is executed. Any value returned asynchronously would be ignored. In other words, the `forEach` loop starts a series of “read → write” that run in parallel, and as soon as everything has started, we leave the loop and the function while the files edition is ongoing!

🤔 How do we make sure that all the operations on files are over before continuing the execution of the script? It was great to let the script deal with all the files as fast as possible without caring about the execution order. If we replace `readFile` and `writeFile` with their `Sync` equivalent, we would lose this advantage: our script would be slower because it wouldn't be able to parallelize the operations.

What we want is to keep the same approach we have now, and do something when we know all the files have been handled. To do so, we are going to use the method [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) along with the static method [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) provided by JavaScript.

Instead of calling directly the async instructions in a `forEach` loop, we are going to store them in an array of promises. Then we'll call `await Promise.all(array)` to wait for all the async instructions. This will pause the execution until all the promises are fulfilled, and only then we'll leave the function:

```diff
  const applyPatches = async (filename, index) => {
    let filesToPost = [];
-   let results = [];
-   files.forEach((filename, index) => {
+   let writePromises = await files.map(async (filename, index) => {
      try {
        let diffName = createDiff(filename, index);
        let fileContent = await readFile(diffName, 'utf8');

        // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
        const unversionedFileName = unversionPath(filename);
        const replacement = unversionPath(fileContent);
        await writeFile(diffName, replacement, 'utf8');

        try {
          let isNew = !fs.existsSync(unversionedFileName);
          runShell(`git apply ${diffName}`);
          if (isNew) filesToPost.push(unversionedFileName);
-         results.push(0);
+         return 0;
        } catch (error) {
          console.log(`"git apply" command failed for ${diffName}`);
          filesToPost.push(unversionedFileName );
-         results.push(2);
+         return 2;
        }
      } catch(error) {
        console.warn(error);
-        results.push(1);
+        return 1;
      }
    });
+   console.log('Ready to create the patch files');
+   let results = await Promise.all(writePromises);
    return {
      filesToPost,
      hasAutoApply: results.some((status) => status === 0);
      hasPendingDiff: results.some((status) => status === 1);
    }
  }
```

`files.forEach` has become `files.map`: instead of performing instructions at each iteration, we rather map our array of filenames to an array of promises.

When we use `return n`, `n` is the data returned by the promise. Each promise resolving to an integer means that, when all the promises are fulfilled, the `results` returned by `Promise.all` is an array of integers that replaces our previous variable `results`.

With this code, `applyPatches` has become an asynchronous function that we can call with `await applyPatches();` and we are all good to post or issues 🎉

## 4. Posting GitHub API requests with Node.js

### a. Preparing the payload

Let's have a fresh look at the kind of issue we want to open: [#213 Translate /addons-and-dependencies/index.md, Ember 5.4](https://github.com/DazzlingFugu/ember-fr-guides-source/issues/213). This can be turned into the following payload:

```js
// The repository of the Ember Guides in French
const repo = 'dazzlingfugu/ember-fr-guides-source'

// The API endpoint to post an new issue
const requestUrl = `https://api.github.com/repos/${repo}/issues`

// For each pair { filename, diffName }
const payload = {
  method: 'POST',
  headers: getHeader(), // we already wrote this one
  body: JSON.stringify({
    title: `Translate \`${shorterFilename}\`, Ember ${newEmberVersion}`,
    body: `
Please assign yourself to the issue or let a comment at the very moment you start the translation.

File: \`${filename}\`
From Ember: **${currentEmberVersion}**
To Ember: **${newEmberVersion}**

In the snippet below, you can see what changes were done in the latest English documentation. The purpose of this issue is to adjust the French translation to match the new version:

\`\`\`diff
${diffblock}
\`\`\`
`,
  labels: ['Guides FR trad']
}
```

`shorterFilename` is just a way to remove `guides` from the filename to cut the issue title down a bit. We can obtain it with a simple [`substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring):

```js
const shorterName = filename.substring(5);
```

`diffblock` is the content of the patch file `diffName` that we write in the body of the issue. One little detail to handle is that there are \``` symbols in the file content and this can break the body. To solve the problem and because we just want to show the diff on GitHub without it being necessarily a valid patch file, we can simply remove the \``` symbols from the file.

Also, the issue body above works only if there _is_ a diff block to paste. If the file is new, it means this is the first translation. We can implement a function `getIssueBodyDiff` to manage this properly:

````js
const getIssueBodyDiff = diffName => {
  if (!diffName) {
    return "This is the first translation for this file.";
  }

  diffblock = fs.readFileSync(diffName, "utf8");
  diffblock = diffblock.replaceAll("```", "");
  return `
In the snippet below, you can see what changes were done in the latest English documentation. The purpose of this issue is to adjust the French translation to match the new version:

\`\`\`diff
${diffblock}
\`\`\`
`;
};
````

Last but not least, we need a pair `{ filename, diffName }` to know what markdown file corresponds to what patch file. This one is quite easy to obtain, we can simply turn `filesToPost` into an array of objects:

```diff
// No diff block
- if (isNew) filesToPost.push(unversionedFileName);
+ if (isNew) filesToPost.push({ filename: unversionedFileName });

// With a diff block
- filesToPost.push(unversionedFileName);
+ filesToPost.push({ filename: unversionedFileName, diffName });
```

Alright! Looks like we have everything we need to complete the payload. Let's create a proper request!

### b. Using the fetch API

When we learned how to get the GitHub API `token` earlier, we said that we wanted to use the JavaScript method [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) to request on [https://api.github.com/](https://api.github.com/). With a modern Node.js version, we don't need any specific import, we can use `fetch` natively. In the end, the implementation could look this way:

```js
const postIssue = async (file, repo, currentEmberVersion, newEmberVersion) => {
  const { filename, diffName } = file;
  const shorterName = filename.substring(5);

  let response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({
      title: `Translate \`${shorterName}\`, Ember ${newEmberVersion}`,
      body: `
Please assign yourself to the issue or let a comment at the very moment you start the translation.
      
File: \`${filename}\`
From Ember: **${currentEmberVersion}**
To Ember: **${newEmberVersion}**

${getIssueBodyDiff(diffName)}
`,
      labels: ["Guides FR trad"],
    }),
  });

  return response.json();
};
```

And we will post all the issues that way:

```js
for (const file of filesToPost) {
  try {
    console.log(`Attempting to open an issue for ${file.filename}`);
    const jsonResponse = await postIssue(
      file,
      repo,
      currentEmberVersion,
      newEmberVersion
    );
    console.log("Server responded with:", jsonResponse);
  } catch (error) {
    console.warn(
      `The issue for file ${file.filename} (${file.diffName}) couldn't be opened automatically. This was caused by: ${error}`
    );
  }
}
```

🤔 This is a regular `for` loop. Using `await` in a good old `for` loop results in executing the iterations serially, it pauses the execution and waits for the result. It means this code posts the issues one by one. Is it what we want? (of course it is 😉)

In general, you want things to go as fast as possible. But when using GitHub API, [the recommendation is to send requests serially](https://docs.github.com/en/rest/guides/best-practices-for-using-the-rest-api?apiVersion=2022-11-28#avoid-concurrent-requests), so we'll wait for the server to respond before we do the next request. Also, let’s follow the documentation's [best practices](https://docs.github.com/en/rest/guides/best-practices-for-using-the-rest-api?apiVersion=2022-11-28#pause-between-mutative-requests) and set a timeout of 1 second after each request to avoid secondary rate limits:

```diff
  for (const file of filesToPost) {
    try {
      console.log(`Attempting to open an issue for ${file.filename}`);
      const jsonResponse = await postIssue(/* ... */);
      console.log('Server responded with:', jsonResponse);
    } catch (error) {
      console.warn(`The issue for file ${file.filename} (${file.diffName}) couldn't be opened automatically. This was caused by: ${error}`);
-   }
+   } finally {
+     await new Promise(resolve => setTimeout(resolve, 1000));
+   }
  }
```

Alright! Let's go back for a second to our main `try...catch` and add our loop here:

```diff
    let { filesToPost, hasAutoApply, hasPendingDiff } = await applyPatches(files);
+   for (const file of filesToPost) { ... }; // post all issues

    if (hasAutoApply) {
      // commit and push changes { ... }
      // TODO: open a catch-up PR on GitHub
    }

```

### c. Opening a PR with GitHub API

After we push the changes to GitHub, we can open the "catch-up PR" using GitHub API. It's essentially the same thing as GitHub issues, except that you need to specify what branch you want to merge into what other branch:

```js
const openCatchupPR = async (
  repo,
  catchupBranch,
  currentEmberVersion,
  newEmberVersion
) => {
  let response = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({
      title: `Catch up latest docs: from ${currentEmberVersion} to ${newEmberVersion}`,
      body: "This is an automatic catch up PR to align our non-translated documentation with the latest official documentation.",
      head: catchupBranch,
      base: "master",
      labels: ["Guides FR trad"],
    }),
  });

  return response.json();
};
```

Then we can call this function right after the branch is correctly pushed:

```js
try {
  // commit and push changes { ... }
  try {
    console.log("Attempting to post the catch up PR");
    const jsonPrResponse = await openCatchupPR(
      repo,
      catchupBranch,
      currentEmberVersion,
      newEmberVersion
    );
    console.log("Server responded with:", jsonPrResponse);
  } catch (error) {
    console.warn(
      `Failed to post the catch-up PR. This was caused by: ${error}`
    );
  }
} catch (error) {
  console.warn("Failed to push the catch-up branch.");
}
```

Sounds like our script is ready to work! We learned how to:

- Write `issues` and `pulls` requests for GitHub API
- Send requests with `fetch` and handle the response

## 5. Last words

This is it!

There are still a couple of details we can add to improve the script. Here are a few examples of things we could do, and there are certainly more:

- rework the logs to have a clear list of "required actions" the developer has to do manually when the process exits with warnings. For instance, if a GitHub issue wasn't posted.
- if there's a bit more time, offer the possibility to retry sending a failed request.
- in terms of clean-up, we could also remove the files we created and the `scripts/patches` folder if all the GitHub issues have been posted correctly.
- replace the usage of `existsSync()` with `await stats()` now that the function calling it is asynchronous.

On a different matter, we could also write some tests to make sure the script does what we think it does. Such tests don't exist yet as I am writing these lines. To check the render of the issues and what the catch-up PR looks like, I did what I usually do: manual process first, then switch to the automation when I am clear with what I want. I created a sandbox project that contains only a `guides/release/` folder with a couple of fake markdown files, then I forked it and added the `catchup.mjs` to the fork along with a package manager to import the few dependencies the script needs. By committing to the upstream sandbox, I could test many cases, including some that never occurred in the real guides so far, like the deletion of markdown files.

As said at the beginning of this article, none of this answers the question "how to bootstrap a translation project, what's the best approach to use?". However, all the above may have convinced you that maintenance automation is not that big of a deal. And it's an iterative process, too. I could have started using this script to automate the git commands before it was able to do the API requests. I did start using it before it was able to handle new markdown files, and I iterated on the code again afterward. Even now that it's complete, there are certainly improvements to make, but it doesn't prevent me from using the script and saving time today 😉.
