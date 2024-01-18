---
title: "Automating the maintenance of the Ember Guides in French"
authorHandle: academierenards
tags: [ember, node, git]
bio: "Marine Dunstetter, Senior Software Engineer"
description:
  "Marine Dunstetter builds an automation script in Node.js to maintain the
  translation of the Ember Guides with git and GitHub."
og:
  image: "/assets/images/posts/2024-01-10-ember-guides-fr-git-automation/og-image.jpg"
tagline: |
  <p>
    One of the main blockers to translation projects is the overwhelming question: how do you maintain it? The tool you're building is already big, and the English docs for this tool are generally a complete website that you must keep up to date. What's the best approach to setting up translations? The answer's probably unique to each project. But how to make maintenance a realistic task? The answer contains a tiny bit of genericity: automation saves time. The Ember Guides are currently being translated into French, and what I built to automate the maintenance might give you some ideas. It's going to be about Node.js, git, and GitHub API.
  </p>

image: "/assets/images/posts/2024-01-10-ember-guides-fr-git-automation/header.jpg"
imageAlt:
  "The Ember logo on a grey background picture displaying a robot at work in a
  factory"
---

As I am writing this blog post,
[the Ember Guides](https://guides.emberjs.com/release/) are currently being
translated into French.
[The French website](https://ember-fr-guides.netlify.app) documents only the
latest version of Ember (for time and human resources purposes). It means that
when a new version of Ember is documented in English, we must adjust the French
website accordingly. Let's say we must _"catch up"_ with the English version.

At EmberFest 2023, I presented the approach used to build the French website,
and I described
[the manual process of catching up with English](https://www.youtube.com/watch?v=hTc_vH-AQdk&t=282s)
when a new version of the docs is released. However, such process is not a
realistic way to maintain the website in the long run.

Let's go on a journey to automate everything with a Node.js script that will run
git commands and make requests to GitHub API! 🤖

**Disclaimer:**

✅ This article will be a technical article to build a modern Node.js script
from scratch. It aims to be accessible to beginners~intermediates, and we'll use
the maintenance of the Ember Guides FR as a theme to introduce many concepts
like using a modern node version, running commands, managing files and making
API requests. However, it's not a "tutorial", because we create the script in an
existing app. We don't start from a blank page nor expect you to achieve exactly
the same thing.

❌ This article won't be about how to bootstrap a translation project and how to
organize it to make it work in the long term. I can simply say that automating
the maintenance where it's possible and being confident in the tools you build
is a good way to remove pressure and entertain motivation.

**Prerequisites:**

- To automate the maintenance, we are going to execute a
  [Node.js](https://nodejs.org/en) script to write instructions in JavaScript,
  so we need to have Node.js installed.
- The article could be easier to follow if you first have a look at
  [the part of the EmberFest talk related to git](https://www.youtube.com/watch?v=hTc_vH-AQdk&t=282s).
  At the beginning of each section, I will sum up the information we need in a
  small paragraph 🐹🎥 _The talk in a nutshell_.
- Finally, here is how my repository is configured. The French app's repo
  (`ember-fr-guides-source`) is a fork of the official Ember Guides' repo
  (`guides-source`):

```bash
% git remote -v
origin git@github.com:DazzlingFugu/ember-fr-guides-source.git (fetch and push)
upstream git@github.com:ember-learn/guides-source.git (fetch and push)
```

## Table of contents

- [1. Writing a modern Node.js script](#1.-writing-a-modern-node.js-script)
  - [a. Running a mjs script](#a.-running-a-mjs-script)
  - [b. Running a script with arguments](#b.-running-a-script-with-arguments)
  - [c. Using an environment variable](#c.-using-an-environment-variable)
  - [d. Controlling the exit](#d.-controlling-the-exit)
- [2. Using git in a Node.js script](#2.-using-git-in-a-node.js-script)
  - [a. Running git commands from a script](#a.-running-git-commands-from-a-script)
  - [b. Using git diff like a boss](#b.-using-git-diff-like-a-boss)
  - [c. Dealing with new files](#c.-managing-new-files)
  - [d. Closing commands](#d.-closing-commands)
- [3. Managing files with Node.js](#3.-managing-files-with-nodejs)
  - [a. Reading files synchronously](#a.-reading-files-synchronously)
  - [b. Deleting files asynchronously](#b.-deleting-files-asynchronously)
  - [c. Creating files into a new folder](#c.-creating-files-into-a-new-folder)
  - [d. Writing files](#d.-writing-files)
- [4. Posting GitHub API requests with Node.js](#4.-posting-github-api-requests-with-node.js)
  - [a. Preparing the payload](#a.-preparing-the-payload)
  - [b. Using the fetch API](#b.-using-the-fetch-api)
  - [c. Waiting for asynchronous operations with promises and `await`](#c.-waiting-for-asynchronous-operations-with-promises-and-await)
  - [d. Opening a PR with GitHub API](#d.-opening-a-pr-with-github-api)
- [Last words](#last-words)

## 1. Writing a modern Node.js script

🐹🎥 _The talk in a nutshell:_ A new version of the Ember Guides was published
🔥 What are the changes? To visualize them clearly, we can only compare English
to English: our repository has a protected `ref-upstream` branch that
corresponds to the English version under translation. We want to compare
`ref-upstream` to `upstream/master` to see the changes between both English
versions. If there are changes in files that are not translated yet, we want to
apply them automatically. If there are changes in files that have been
translated into French, we want GitHub to open an issue containing the diff. To
picture this part better, here is the kind of issue we want to open:
[#213 Translate /addons-and-dependencies/index.md, Ember 5.4](https://github.com/DazzlingFugu/ember-fr-guides-source/issues/213).

Out of this summary, there are a couple of things we already know about our
script:

- It will post an issue on GitHub, which is an asynchronous fetch operation.
- It will know the versions of Ember we are dealing with, so we can write some
  beautiful "from Ember 5.4 to Ember 5.5" in the body of the issue.
- It will use GitHub API to post the issue.

Let's start with what we know then.

### a. Running an mjs script

🤔 What’s your version of Node.js, by the way?

You can check by running this command:

```js
% node -v
```

At the moment I am writing this, the latest version is v21.5.0. It lets us use
modules and syntaxes like `async` and top-level `await` to bring clarity to our
asynchronous operations. This might be very handy to manage our calls to GitHub
API later, so let’s make sure we have the latest Node.js. The way to update
Node.js depends on the tools you used to install it (`brew`, `nvm`, `volta`...)
If, just like me, you never remember what it was, this could help:

```js
% whereis node
```

If you're not familiar with running Node.js scripts, here are the basics. In the
`ember-fr-guides-source` folder, we create a file `scripts/catchup.mjs`:

```js
// ember-fr-guides-source/scripts/catchup.mjs
console.log("I love Ember");
```

ℹ️ The `m` in `mjs` stands for [Module](https://docs.fileformat.com/web/mjs/).
By using modules, we'll be able to use `import` to bring functionality from node
and external libraries into our script.

Then, from the terminal, we reach the folder `ember-fr-guides-source` and run:

```bash
% node scripts/catchup.mjs
> I love Ember
```

The output “I love Ember” shows up in the terminal. 🎉

### b. Running a script with arguments

🤔 If we want to write "from Ember 5.4 to Ember 5.5" in the body of our issue,
then the script should know these numbers. First, we could declare two variables
`currentEmberVersion` and `newEmberVersion`. Then we could assign hardcoded
values `5.4` and `5.5`, but it would be inconvenient: each time we want to run
the catch-up process in the future, we would have to modify the script. It would
be better if we could specify the Ember versions in the command line.

Before running a node script, you can add arguments separated by spaces. When
the script runs, the arguments will be accessible in `process.argv`. For
instance, let's add the following log at the beginning of `catchup.mjs`:

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

We could execute `process.argv.slice(2)` to remove the two first elements, then
read options by index or using the
[`indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
function. Another handy solution is to rely on an external library like
`minimist-lite`. This library maps the options we pass into a dictionary that
makes the access more intuitive in the code:

```bash
% npm install minimist-lite --save-dev
```

ℹ️ This will add `minimist-lite` to the dev dependencies of our application. In
our case, `ember-fr-guides-source` is already an Ember application with a
`package.json`, so we have no problem running `npm install`. If you want to
import dependencies in a standalone script, outside of an application folder,
you'll need to initialize a package manager first. For instance, you can
initialize `npm` with `npm init`.

We can now import `minimist-lite` in `catchup.mjs` and use it to map our
options:

```js
import minimist from "minimist-lite";

var argv = minimist(process.argv.slice(2));
console.log(argv);
```

```bash
% node scripts/catchup.mjs --from 5.0 --to=5.4 -o hey
> { _: [], from: 5, to: 5.4, o: 'hey' }
```

As you can see, passing an option like `--to=5.4` would result in
`argv.to === 5.4`, which is perfect. However, we have an issue with version
numbers ending with `0`: `--from 5.0` would result in `5`. This is because
`minimist-lite` manages numerical values as proper numbers. If we could indicate
that options `from` and `to` should be treated as `string` values, this would
solve our problem. `minimist-lite` can take options to let us specify the type
of each argument. The documentation is a bit hard to decipher in my personal
opinion, here is the syntax we need to figure out:

```diff
  import minimist from 'minimist-lite';

- var argv = minimist(process.argv.slice(2));
+ var argv = minimist(process.argv.slice(2), { string: ['from', 'to'] });
  console.log(argv);
```

`string` is an option that contains the array of arguments that should be
handled as `string`:

```bash
% node scripts/catchup.mjs --from 5.0 --to=5.4 -o hey
> { _: [], from: '5.0', to: '5.4', o: 'hey' }
```

Now that we have the expected format, let's store the arguments into variables
that we'll use later in our GitHub issue:

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

ℹ️ `process.exit(9);` forces the process to exit. Any status but `0` indicates
the process exited with errors. `9` is for invalid arguments. You can see the
[list of error codes here](https://nodejs.org/api/process.html#exit-codes).

ℹ️
[`match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
finds all the occurrences of a given regexp in the string and returns them in an
array. In our case, we expect the first occurrence of `d.d` (digit, dot, digit)
to exist and to be equal to the argument value:

```bash
% node scripts/catchup.mjs --from=5.1typo --to=5.4
> Error: please provide the current Ember version under translation to option --from (e.g. --from=5.1)

% node scripts/catchup.mjs --from=5.1 --to=5.4
> Ember version under translation: 5.1
> New Ember version documented on upstream: 5.4
```

Great! Now we have the first piece of information to create a GitHub issue.

### c. Using an environment variable

Most of the time, when we want to create a new GitHub issue on a repository, we
do it manually via GitHub UI. We can achieve the same thing using GitHub API.
[Here is what it looks like](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue).
As you can see in the JavaScript tab of the docs, GitHub recommends the usage of
`Octokit` to interact with the API in JavaScript.

However, our case is pretty simple, and using the regular JavaScript method
`fetch` with [https://api.github.com/](https://api.github.com/) is also
possible. I decided to go with `fetch` because I think it’s a bit more
accessible and generic, you could reuse this blog post more easily for different
purposes. It’s essentially the same thing, except that we'll set our
authorization header manually. Among other static things, the authorization
header contains an `Authorization` field that must be filled with
`Bearer <YOUR-TOKEN>`.

`<YOUR-TOKEN>` should be replaced with a secret token required by GitHub API to
authenticate us and make sure we're allowed to use the API the way we try to use
it. To generate a personal token, log in to your GitHub account and
[follow this section of the docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).
Once your token is generated, copy it somewhere, in a local file, so you have it
within easy reach.

🤔 `<YOUR-TOKEN>` is not supposed to change over time (at least not very often),
but it’s sensitive, so it can’t be hardcoded in the script. We could pass a
`token` as third argument:

```bash
% node scripts/togithub.mjs --from=5.1 --to=5.4 --token="<YOUR-TOKEN>"
```

It’s fine, but not good enough. We don’t want to copy the `token` manually from
somewhere to our command line each time we want to run the script. It would be
more convenient if the script could read the token by itself.

A common practice in web projects is to store the secret variables in a file
`.env` which is added to the `.gitignore` file so we’re sure it won’t be
committed to GitHub inadvertently. Along with this file, an `.env.example`,
which contains fake values, is committed to GitHub and describes what secret
variables the developer should set up to get the project working. The library
[dotenv](https://www.npmjs.com/package/dotenv) brings this common practice into
Node.js by providing the variables defined in `.env` through `process.env`:

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

const token = process.env.GITHUB_TOKEN;
console.log(token);
```

```bash
% node scripts/catchup.mjs --from=5.1 --to=5.4
> "<YOUR-TOKEN>"
```

Let's remove that `console.log`. Once the `token` variable is declared and
assigned, it can be used anywhere in the script, for instance in a function:

```js
/*
 * This function returns the headers required for all requests to GitHub API.
 * It includes both posting issues and opening the catch-up PR.
 */
const getRequestHeaders = () => {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
};
```

### d. Controlling the exit

Earlier in this section, we wrote the following line:

```js
process.exit(9);
```

This is used to force the process to exit if a critical error prevents us from
continuing.

🤔 For now, it's ok, because all the operations are synchronous. But later in
this blog post, we will deal with async operations like writing files and
posting to GitHub API. What happens if, at some point, a `process.exit(n);`
instruction is executed while an async operation is running?

The answer is that you don't know. You don't know for sure what operations the
script could perform before existing, and what operations were still to do.
Let's imagine this kind of algorithm:

```js
// async operation1 = create a file 'my-file.txt', then {
//   async operation2 = write the text 'I love Ember' in 'my-file.txt'
// }
process.exit(0);
```

If we implement the real code and run it, we don't know if the script could
finish `operation1` and `operation2`. For instance, it may have done the first
one but not the second, and in the end, we have a file `my-file.txt` which is
empty.

It's usually good practice to have control over the process exit when you deal
with async operations. On one hand, you generally don't write things like
`process.exit(0);` because the script will exist with `0` code by itself when
all the operations (including async operations) are finished. On the other hand,
rather than forcing the exit when something goes wrong, there are ways to
control errors and what part of the code shouldn't execute afterward.

To play with error handling and understand async behaviors in general, a nice
tip is to use the JavaScript function
[setTimeout](ttps://developer.mozilla.org/en-US/docs/Web/API/setTimeout). It
allows you to execute code after a given delay. Here is an example of how you
can let a script terminate an async operation before exiting, but prevent the
next operations from starting. It uses
[`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)
and
[`try...catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch):

```js
try {
  setTimeout(() => {
    console.log("code in setTimeout is exectuted!");
  }, 2000);
  throw new Error("something went wrong!");
  console.log("code after throw is exectuted!");
} catch (error) {
  console.log(error.message);
  process.exitCode = 1;
}
```

ℹ️ `process.exitCode = n;` means that _when the process finally exits_, it will
exit with code `n`.

After about two seconds, the script exited with an error state and the following
logs:

```bash
% node scripts/test.mjs --from=5.1 --to=5.4
> something went wrong!
> code in setTimeout is exectuted!
```

In our case, we'll keep `process.exit(9);` while the script reads arguments
because it's synchronous. But once the script really starts to work, we'll
centralize error handling with a global `try...catch` for readability. With the
big parts cut, here is what our script looks like:

```js
import "dotenv/config";
import minimist from "minimist-lite";

// Read script arguments
const argv = minimist(process.argv.slice(2), { string: ["from", "to"] });

// Read current Ember version (under translation)
const currentEmberVersion = `${argv.from}`;
// if (currentEmberVersion.match...
console.log(`Ember version under translation: ${currentEmberVersion}`);

// Read new Ember version (documented by the English guides)
const newEmberVersion = `${argv.to}`;
// if (newEmberVersion.match...
console.log(`New Ember version documented on upstream: ${newEmberVersion}`);

// Read GitHub token
const token = process.env.GITHUB_TOKEN;

const getRequestHeaders = () => {
  /* ... */
};

try {
  // The next step 🎉
} catch {
  console.error(error);
  process.exitCode = 1;
}
```

So far, we learned how to:

- execute a modern `mjs` script
- install and import external libraries
- pass and parse script arguments
- read environment variables
- control the exit with `exitCode` and `try...catch`

The script knows all the arguments it needs to automate the process 🎉

## 2. Using git in a Node.js script

🐹🎥 _The talk in a nutshell:_ A new version of the Ember Guides was published
🔥 To see the changes, we compare `origin/ref-upstream` to `upstream/master` and
we print the result in a patch file `english.diff` that shows a list of diff
blocks. If non-translated files have changes, we apply the changes
automatically, which means these files are updated locally, which means we have
to commit them in a working branch. Once that's done, we are officially
translating the new Ember version, so we reset `origin/ref-upstream` to the same
state as `upstream/master` to be ready for the next catch-up.

Sounds like the script is going to run a lot of git commands:

- It will create and switch to a new working branch.
- It will generate a patch file by comparing two branches.
- It will try to apply a patch file automatically.
- It will commit and push files.
- It will reset `origin/ref-upstream` to `upstream/master`.

### a. Running git commands from a script

First, we want to create a new "catch-up" branch to work on. In the terminal, we
would do this with `git switch --create <branch-name>`. It would be nice to
reuse our variable `newEmberVersion` in the name of the branch, both for the
sake of clarity and to have the possibility to keep several catch-up branches
locally if we need to. Unfortunately, we can’t write the shell commands we use
in our terminal directly in the `catchup.mjs` file, because it’s not JavaScript!
The good news is Node.js embeds a function to answer this problem. It's called
`execSync`, and it's located in the `child_process` module:

```js
import { execSync } from 'child_process';

// Read script arguments { ... }

try {
  console.log(`Attempting to execute: "git switch --create catchup-${newEmberVersion}"`);
  execSync(`git switch --create catchup-${newEmberVersion}`);
}
// catch(error) { ... }
```

ℹ️ `Sync` stands for synchronous. It means the script execution will pause until
the operation is complete. Node.js generally provides asynchronous functions
along with a `Sync` version, so you can use one or the other (e.g. `exec` vs
`execSync`). We'll come back to this later.

Our code will work once. If we call it twice, it will fail because the branch
already exists. When the command specified to `execSync` fails, it throws an
error, which would cause the process to exit immediately without the global
`try...catch` block we added.

Great! We can run git commands! 💪 We also want to run `git fetch` and
`git fetch upstream` to make sure that `origin/ref-upstream` and
`upstream/master` are both up to date before we start working with them. Let's
abstract our logic in a function so we don't have to rewrite the log each time:

```diff
+ const runShell = (command) => {
+   console.log(`Attempting to execute: "${command}"`);
+   execSync(`${command}`);
+ }

  try {
-   console.log(`Attempting to execute: "git switch --create catchup-${newEmberVersion}"`);
-   execSync(`git switch --create catchup-${newEmberVersion}`);
+   // Create a catchup branch out of the current branch (should be up to date master)
+   runShell('git switch --create catchup-${newEmberVersion}');
+   // Fetch the latest ref-upstream branch (English version under translation on this repo)
+   runShell('git fetch');
+   // Fetch the latest updates in the official Ember Guides
+   runShell('git fetch upstream');
  }
  // catch(error) { ... }
```

### b. Using git diff like a boss

The next step of the process is to generate the diff between
`origin/ref-upstream` and `upstream/master` to view how the second impacts the
first. In the talk, I gave several steps to build this command. The one we'll
describe here is slightly different but does essentially the same thing:

```bash
git diff origin/ref-upstream upstream/master -- guides/release > english.diff
```

`git diff A B` compares one branch to another in the order A is impacted by B:

```diff
- Line number 24 in file myFile.md on branch A
+ Line number 24 in file myFile.md on branch B
```

The `--` option allows us to specify a path for the compare operation. We are
not interested in all the changes in the whole app, we want to patch only the
markdown files located in `guides/release`.

Then we output the result of this command in one big file called `english.diff`,
which shows up at the root of the project. It contains one diff block per
modified markdown file. This is where the manual process becomes a bit heavy:

- We run `git apply english.diff` to automatically apply the changes A → B to
  all files. But git can do this only if each target file is in English and
  hasn’t been translated yet. If at least one markdown file has been translated
  into French, it means both sides have been modified and are now completely
  different, so git doesn’t know what to do: the whole command fails.
- For each block causing a failure, we open manually a new issue on GitHub, copy
  the diff in there (so a translator can tackle it later), and then remove the
  block from `english.diff`. Then we run `git apply english.diff` again, etc,
  etc...
- We do this until `git apply english.diff` finally works because there are only
  non-translated English files targeted by the remaining diff blocks.

🤔 This iterative process doesn't look easy to automate. We probably need a
quite different strategy, and we can probably make it simpler to picture!

`git apply` takes a path to a patch file. Instead of running
`git apply english.diff` and the whole command fails when something goes wrong,
it would be more convenient to try `git apply` block by block. What if we could
have one patch file per markdown file? This way we could run
`git apply file-1.diff`, `git apply file-2.diff`... and perform actions
depending on the result.

Thanks to `-- guides/release` option, we learned that `git diff` command can
scope the comparison to a given folder. We could also scope it to one single
markdown file! So we would run the command with
`-- [my-file-1].md > [my-file].diff` to output all the different patches. But
how to get the list of markdown files that have been modified in
`upstream/master`?

`git diff` can help us with another option called `--name-only`. Instead of
returning all the diff blocks as we saw earlier, it will return only the name of
the files containing changes!

To sum it up, here is the kind of implementation we want:

```js
// List of filenames that changed between origin/ref-upstream and upstream/master
let files;

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
    throw new Error(`Failed to create the diff for ${filename}. This was caused by: ${err}`);
  }
}

/*
 * This function generates a patch file for each file in files (using createDiff)
 * then tries to run 'git apply' for each patch.
 */
const applyPatches = () => {
  files.forEach((filename, index) => {
    try {
      let diffName = createDiff(filename, index);
      try {
        runShell(`git apply ${diffName}`);
      } catch (error) {
        console.log(`"git apply" command failed for ${diffName}`); // we prefer console.log over console.warn, because failure is part of the normal process
      }
    } catch (error) {
      console.warn(error);
    }
  });
}

try {
  // Create catchup branch and fetch last changes { ... }
  // Output the list of markdown files impacted by latest changes on upstream
  runShell('git diff --name-only origin/ref-upstream upstream/master -- guides/release > list.diff');

  // TODO: files = read the content of 'list.diff' and parse it as an array of filename.

  if (files && files.length > 0) {
    applyPatches();
  } else {
    console.log('No change between both versions of the Ember Guides.');
  }
} // catch(error) { ... }
```

That's a great start! There's just this blocking `TODO` we need to figure out,
we'll come back to it in the next section.

### c. Managing new files

🤔 We saw quite interesting `git diff` options to create all the resources we
need. There's one case though, we didn't mention at all. What if some of the
"changed" files are new files that have been added to the latest Ember docs and
that don't exist at all in our current branch?

In that case, `git apply` will work like a charm and will create the new English
file for us, but then... we'll need to open a GitHub issue to alert the
translators there's something new to translate entirely. It means that the
answer to the question "Should I open a GitHub issue?" doesn't depend only on
`git apply`'s success or failure, it also depends on the existence of the file
in the current branch, and at some point, we should probably track the files
that need to be posted.

To check if the file exists on the current branch, we'll import a module called
`fs` and use the function called `existsSync`. We'll learn more about the `fs`
module in the next section of the blog post 😉

```diff
+ import fs from 'fs';

+ let filesToPost = [];

  const applyPatches = () => {
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
  }
```

ℹ️ `git apply` runs after we've initialized `isNew`, because it can create the
missing file and therefore compromise the value.

### d. Closing commands

There are other git commands we need to include in the script: those happening
at the end of the process:

- If we have local changes, we should commit them and push the catch-up branch
  to GitHub: this happens when at least one `git apply` worked.
- Once we're done with everything, we should reset `origin/ref-upstream` to
  `upstream/master` so we are ready for the next catch-up: this happens each
  time the process ends without error, even when there were no changes at all in
  `guides/release`.

There's no new concept here, we already have all the knowledge to put this in
place. Let's create new functions to group more clearly the git commands and
their purpose, then let's see where to call them:

```js
/*
 * This function adds, commits, and pushes the modifications in "guides" folder
 */
const pushChanges = () => {
  try {
    runShell("git add guides");
    runShell(
      `git commit -m "feat: automatic catch up from ${currentEmberVersion} to ${newEmberVersion}"`
    );
    runShell(`git push origin ${catchupBranch}`);
  } catch (error) {
    throw new Error("Failed to push the catch-up branch");
  }
};

/*
 * This function switches to the ref-upstream branch to reset it to the latest upstream/master,
 * then it pushes ref-upstream branch to the origin repository.
 */
const updateRefUpstream = () => {
  try {
    runShell("git switch ref-upstream");
    runShell("git reset --hard upstream/master");
    runShell("git push origin -f ref-upstream");
  } catch (error) {
    throw new Error(
      "Failed to reset ref-upstream to the latest upstream/master"
    );
  }
};

/*
 * This function performs the last actions once most of the catchup is done
 * It updates ref-upstream to upstream/master if there's no pending manual action,
 * then it switches back to master.
 */
const closeProcess = () => {
  if (!hasPendingDiff) {
    // See the next snippet
    try {
      updateRefUpstream();
      try {
        runShell("git switch master");
      } catch (error) {
        console.warn(
          "The process is complete, but failed to switch back to master"
        );
      }
    } catch (error) {
      throw error;
    }
  }
};
```

```diff
+ // True if origin/ref-upstream branch cannot be updated because we need some manual checks between ref-upstream and upstream/master
+ let hasPendingDiff = false;

  const applyPatches = () => {
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
+       hasPendingDiff = true; // the developer will need to check what happened and may need to keep ref-upstream in the current state
+       results.push(1);
      }
    });
+   return result.some((status) => status === 0);
  }

  // { ... }

  if (files && files.length > 0) {
-   applyPatches();
+   let hasAutoApply = applyPatches();
+   if (hasAutoApply) {
+     pushChanges();
+   }
  } else {
    console.log('No change between both versions of the Ember Guides.');
  }

+ closeProcess();

  // { ... }
```

So far, we learned how to:

- Run a shell command with `execSync`
- Output the result of a command in a file
- Compare branches with `git diff` and a panel of options to make it output
  information in different shapes

In theory, git does a lot of things for us at this point. "In theory" because
our array of `files` is still desperately empty! Let's do something about that.

## 3. Managing files with Node.js

🐹🎥 _The talk in a nutshell:_ In the French website, we translate only the
latest version of Ember, so the UI doesn't have a dropdown to navigate to legacy
versions. To hide the dropdown automatically, our folders have a slightly
different scaffolding. The subtlety is that our diff compares the markdown files
located in `guides/release/`. But in our `master` branch (and our `catchup`
branch), all these very same files are located directly in `guides/`. It means
that the command `git apply ${diffName}` will fail to patch the updated files,
because the script will look for them in `guides/release/` and notice they don't
exist.

Here are the conclusions we can draw:

- We need to read `list.diff` and parse the list of filenames in our `files`
  array. Each item of the array will be a filename starting with
  `guides/release/`.
- To make our patch files valid in our scaffolding, we need a way to change the
  path to `guides/`.
- Once the `list.diff` is read, we no longer need it. And once a patch file is
  successfully applied, we no longer need it either, so we can remove these
  files.
- On the contrary, if a patch file cannot be applied automatically, we'll reuse
  its content to create the corresponding GitHub issue.

### a. Reading files synchronously

We want to read the content of `list.diff` to extract an array of filenames. To
deal with files, we’re going to use
[Node.js File System Module](https://nodejs.org/docs/latest-v21.x/api/fs.html#file-system)
`fs`. It's the module we imported earlier, when we used `fs.existsSync`! Among
all the functions this module provides, here are the ones we are interested in
this time: `fs.readFile` and `fs.readFileSync`, which can read a file and return
its content.

ℹ️ Just like we saw in the first section with `exec` versus `execSync`, most
functions of the `fs` module are asynchronous and have a `Sync` alternative. The
asynchronous functions should generally be preferred whenever it’s possible to
use them because they allow the process to parallelize some tasks and therefore
be faster.

But in our case, synchronicity makes more sense: as long as we don’t know the
content of `list.diff`, we can’t know the list of files to handle next.
`fs.readFileSync` retrieves the file out of the provided `filename` and returns
its content:

```js
// Read list.diff to extract the list of paths to markdown files
let data = fs.readFileSync("list.diff", "utf8");
const files = data.split(/[\n\r]/).filter(name => name.length);
```

ℹ️ The first argument of `fs.readFileSync` is a relative path. `list.diff` is
like `./list.diff`. Also, note that `./` is not the location of the
`catchup.mjs` script, but it’s from where we are running the script. It means
that if we are at the root of the `ember-fr-guides-source` folder and we use the
command `node scripts/catchup.mjs` from there, then `./` is exactly where we
are: the root of the `ember-fr-guides-source` folder. Here, the filename is
`./list.diff` because we generated it at the root of the repository.

The content of `list.diff` contains one line per file name: using a
[`split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
by line breakers then filtering potential empty values is enough to create our
array.

### b. Deleting files asynchronously

The variable `files` now contains an array of filenames. `list.diff` did its job
and we no longer need it. To remove `list.diff`, we can use `fs.unlink` or
`fs.unlinkSync`. Do we need the operation to be completed before moving to the
next step? No, even if `list.diff` is still there, we can move forward and start
using our `files` array. So let's go with the asynchronous version:

```js
fs.unlink("list.diff", function (err) {
  if (err) {
    console.warn("Failed to delete list.diff");
  } else {
    console.log("list.diff did its job, deleted");
  }
});
```

ℹ️ The asynchronous functions are essentially the same as the synchronous ones,
except that the last argument is a callback function that will be executed only
once the operation is done.

We have our `files` ready, which means we can finally enter the function
`applyPatches()` to generate the patch file `[index].diff` for each of them.

🤔 But don't you think it's a bit rough to create all our files at the root of
the project like this? Couldn't we create our patch files in a dedicated folder?

### c. Creating files into a new folder

To keep things clean, let’s not do what we did for `list.diff` and create a new
folder in the scripts folder:

```js
// Create a directory to put the children diff
fs.mkdirSync("scripts/patches", { recursive: true });
console.log("scripts/patches folder created to store the patch files");
```

ℹ️ Using the option `recursive: true` will prevent the command from failing if
there's already a `scripts/patches` folder. It's up to you to decide if that
case is a problem or not.

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

The patch files are created in the `scripts/patches` folder. Once the file is
written, `git apply` runs and... fails with the error "No such file or
directory". Time to take care of this `guides` versus `guides/release` thing.

### d. Writing files

The content of a patch file looks like this:

```diff
diff --git a/guides/release/accessibility/components.md b/guides/accessibility/components.md
index 2253b1bdd..6e0e2a99d 100644
--- a/guides/release/accessibility/components.md
+++ b/guides/release/accessibility/components.md
@@ -57,13 +57,15 @@ However, the most common methods for providing accessible names can be reviewed

 ### Adding a label to an input element

-The `<input>` element's `id` attribute value should be the same as the `for` attribute value on the `<label>`, like this:
+The `<input>` element's `id` attribute value should be the same as the `for` attribute value on the `<label>`. Ember has a built-in `unique-id` helper that can generate unique ids that you can use like this:

```

There are 4 occurrences of the path `guides/release` and we need to replace them
with `guides`. It will mean it's the diff between
`guides/accessibility/components.md` and some fictive
`guides/accessibility/components.md` coming from the `b` branch. Manually, we
would do this with “Find and Replace” in the code editor. Instead, let’s do it
in JavaScript. The replacement function by itself is not the pain point, we've
already done something similar before:

```js
/*
 * This function looks for the paths guides/release in the provided string and replaces it with guides.
 * We need this to adjust the paths to our scaffolding:
 * The official English guides allow to navigate to legacy versions of Ember, it's "versioned" docs.
 * The French guides show only the latest version, so we don't have a dropdown to navigate, it's "unversioned" docs.
 * It's the scaffolding of the guides folder that impacts the dropdown presence: instead of having a release/ folder
 * that corresponds to the latest version, we have the docs at the root of guides directly.
 */
const unversionPath = stringContent => {
  return stringContent.replace(/guides\/release/g, "guides");
};
```

The question is more about how to use this function to edit files content. Just
like before, there's a choice to make: `readFile` or `readFileSync`, then
`writeFile` or `writeFileSync`:

```diff
  const applyPatches = () => {
    let results = [];
    files.forEach((filename, index) => {
      try {
        let diffName = createDiff(filename, index);
+       // TODO: data = read(sync?) the content of 'diffName' file, then {
+         // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
+         const unversionedFileName = unversionPath(filename);
+         const replacement = unversionPath(data);
+         // TODO: rewrite(sync?) the content of 'diffName' file with replacement, then {
            try {
-             let isNew = !fs.existsSync(fileName);
+             let isNew = !fs.existsSync(unversionedFileName);
              runShell(`git apply ${diffName}`);
-             if (isNew) filesToPost.push(filename);
+             if (isNew) filesToPost.push(unversionedFileName);
              results.push(0);
            } catch (error) {
              console.log(`"git apply" command failed for ${diffName}`);
-             filesToPost.push(filename);
+             filesToPost.push(unversionedFileName);
              results.push(2);
            }
+         }
+       }
      } // catch (error) { ... }
    });
    return result.some((status) => status === 0);
  }
```

With the async method, we don’t know when the callback function will be
executed. For instance, even if our array is ordered, the file at index 12 could
be edited before the file at index 3. Would this be a problem in our case? I
don’t think so. At the end of the day, we want all the files to be edited, we
are not interested in the execution order. So we can go with the async
functions:

```js
const applyPatches = () => {
  let results = [];
  files.forEach((filename, index) => {
    try {
      let diffName = createDiff(filename, index);
      fs.readFile(diffName, 'utf8', function(err, data) {
        if (err) {
          throw new error(`Failed to read ${diffName} to edit the patch path. This was caused by: ${err}`);
        }
        // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
        const unversionedFileName = unversionPath(filename);
        const replacement = unversionPath(data);

        fs.writeFile(diffName, replacement, 'utf8', function(err) {
          if (err) {
            throw new error(`Failed to write ${diffName} to edit the patch path. This was caused by: ${err}`);
          }
          try {
            let isNew = !fs.existsSync(unversionedFileName);
            runShell(`git apply ${diffName}`);
            if (isNew) filesToPost.push(unversionedFileName);
            results.push(0);
            // Remove the file if the apply was successfull, we no longer need it (non-critical operation)
            fs.unlink(diffName, function(err) {
              if (err) {
                console.warn(err);
              } else {
                console.log(`${diffName} handled and deleted`);
              }
            });
          } catch (error) {
            console.log(`"git apply" command failed for ${diffName}`);
            filesToPost.push(unversionedFileName );
            results.push(2);
          }
        }
      }
    } catch (error) {
      console.warn(error);
      hasPendingDiff = true; // the developer will need to check what happened and may need to keep ref-upstream in the current state
      results.push(1);
    }
  });
  return result.some((status) => status === 0);
}
```

`fs.readFile` is the first async operation. Its callback function executes only
once we have the data. The same philosophy applies to `fs.writeFile`: it also
takes a callback function, and it's only when the file has been edited with the
correct path that we can put the `git apply` block. Additionally, we can remove
the patch files when applied successfully, but this operation is not critical
and doesn't impact the `results` of the function.

Good! `git apply` really does what we want it to do! For each patch file created
and edited, we try to run `git apply`:

- If the target file is not translated, it works! 🎉 we have the diff
  automatically applied!
- If the target file is in French, the command fails and we don't delete the
  patch file from `scrptis/patches`. This way, we'll be able to reuse its
  content in the body of our GitHub issue.

At this point, we've gained a lot of time by letting the script take care of all
these local operations. The next step is posting GitHub issues for the files git
couldn’t change automatically, so translators are notified and can adjust the
translation! 💪

## 4. Posting GitHub API requests with Node.js

### a. Preparing the payload

Let's have a fresh look at the kind of issue we want to open:
[#213 Translate /addons-and-dependencies/index.md, Ember 5.4](https://github.com/DazzlingFugu/ember-fr-guides-source/issues/213).
This can be turned into the following payload:

```js
// The repository of the Ember Guides in French
const repo = 'dazzlingfugu/ember-fr-guides-source'
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

`shorterFilename` is just a way to remove `guides` from the filename to cut the
issue title down a bit. We can obtain it with a simple
[`substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring):

```js
const shorterName = filename.substring(5);
```

`diffblock` is the content of the patch file `diffName` that we write in the
body of the issue. One little detail to handle is that there are \``` symbols in
the file content and this can break the body. To solve the problem and because
we just want to show the diff on GitHub without it being necessarily a valid
patch file, we can simply remove the \``` symbols from the file:

````js
let diffblock;
if (diffName) {
  diffblock = fs.readFileSync(diffName, "utf8");
  diffblock = diffblock.replaceAll("```", "");
}
````

We also need a pair `{ filename, diffName }` to know what markdown file
corresponds to what patch file. This one is quite easy to obtain, we can simply
turn `fileToPost` into an array of objects:

```diff
// No diff block
- if (isNew) filesToPost.push(unversionedFileName);
+ if (isNew) filesToPost.push({ filename: unversionedFileName });

// With a diff block
- filesToPost.push(unversionedFileName);
+ filesToPost.push({ filename: unversionedFileName, diffName });
```

Last but not least, the issue body above works only if there is a diff block to
paste. If the file is new, it means this is the first translation. We can
implement a function `getIssueBody` to manage this properly:

```js
const getIssueBody = (filename, diffblock) => {
  diffblock = diffblock
    ? `
In the snippet below, you can see what changes were done in the latest English documentation. The purpose of this issue is to adjust the French translation to match the new version:

\`\`\`diff
${diffblock}
\`\`\`
`
    : "This is the first translation for this file.";

  return `
Please assign yourself to the issue or let a comment at the very moment you start the translation.
      
File: \`${filename}\`
From Ember: **${currentEmberVersion}**
To Ember: **${newEmberVersion}**

${diffblock}
`;
};
```

Alright! Looks like we have everything we need to complete the payload. Let's
create a proper request!

### b. Using the fetch API

When we learned how to get the GitHub API `token` earlier, we said that we
wanted to use the JavaScript method
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) to request on
[https://api.github.com/](https://api.github.com/). With a modern Node.js
version, we don't need any specific import, we can use `fetch` natively. In the
end, the implementation could look this way:

````js
const postIssue = file => {
  const { filename, diffName } = file;
  const shorterName = filename.substring(5);

  let diffblock;
  if (diffName) {
    diffblock = fs.readFileSync(diffName, "utf8");
    diffblock = diffblock.replaceAll("```", "");
  }

  return fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({
      title: `Translate \`${shorterName}\`, Ember ${newEmberVersion}`,
      body: getIssueBody(filename, diffblock),
      labels: ["Guides FR trad"],
    }),
  });
};

const postAllIssues = async () => {
  for (const file of filesToPost) {
    try {
      console.log(`Attempting to open an issue for ${file.filename}`);
      const response = await postIssue(file);
      const jsonResponse = await response.json();
      console.log("Server responded with:", jsonResponse);
    } catch (error) {
      console.warn(
        `The issue for file ${file.filename} (${file.diffName}) couldn't be opened automatically. This was caused by: ${error}`
      );
    }
  }
};
````

🤔 This is a regular `for` loop, not a `forEach` like the one we have in
`applyPatches`. Using `await` in a good old `for` loop results in executing the
iterations serially, it pauses the execution and waits for the result. It means
this code posts the issues one by one. Is it what we want? (of course it is 😉)

In general, you want things to go as fast as possible. But when using GitHub
API,
[the recommendation is to send requests serially](https://docs.github.com/en/rest/guides/best-practices-for-using-the-rest-api?apiVersion=2022-11-28#avoid-concurrent-requests),
so we'll wait for the server to respond before we do the next request. Also,
let’s follow the documentation's
[best practices](https://docs.github.com/en/rest/guides/best-practices-for-using-the-rest-api?apiVersion=2022-11-28#pause-between-mutative-requests)
and set a timeout of 1 second after each request to avoid secondary rate limits:

```diff
  const postAllIssues = async () => {
    for (const file of filesToPost) {
      try {
        console.log(`Attempting to open an issue for ${file.filename}`);
        const response = await postIssue(file);
        const jsonResponse = await response.json();
        console.log('Server responded with:', jsonResponse);
      } catch (error) {
        console.warn(`The issue for file ${file.filename} (${file.diffName}) couldn't be opened automatically. This was caused by: ${error}`);
-     }
+     } finally {
+       await new Promise(resolve => setTimeout(resolve, 1000));
+     }
    };
}
```

ℹ️ Note you can't use `async/await` in a `forEach` loop, because `forEach` is
not promise-aware, the iteration doesn't return a value so there's no value to
potentially wait for, and `forEach` never waits to move to the next iteration
after an async code is executed. Any value returned asynchronously would be
ignored.

Alright! Let's go back for a second to our main `try...catch` and add the call
to `postAllIssues`:

```diff
  if (files && files.length > 0) {
    fs.mkdirSync('scripts/patches', { recursive: true });
    console.log('scripts/patches folder created to store the patch files');

    applyPatches();
    let hasAutoApply = applyPatches(); // 🙀
+   postAllIssues();

    if (hasAutoApply) {
      pushChanges();
    }

```

Owww but wait a second 🙀. Earlier in this blog post, we introduced async
behaviors in the function `applyPatches` but we didn't go back to where it's
called. Our code no longer works, because the execution is not paused during
`applyPatches`. In `applyPatches`, each iteration of the `forEach` loop starts
an async series of “read → write”, the iterations are parallel, and we don’t
know when the very last callback will be executed. To say it differently, when
the `forEach` loop will be executed, the script will leave the function and
execute the next instruction while the files edition is still ongoing! In other
words, when we leave the loop, `filesToPost` is not necessarily filled entirely,
and some automatic patches may not have run.

We are about to try posting issues and pushing changes when the context is not
ready! And it's not like we could just put everything in the callback function
of `fs.writeFile` right? It would be very dirty to stage and push files on
GitHub one by one as soon as they are patched. Regarding files that can't be
patched, posting the GitHub PR in the callback would prevent us from properly
controling timing and concurrency like we did in `postAllIssues`.

No, here we really want to turn `applyPatches();` into `await applyPatches();`
and make the function `async`. Let's figure out how to do that.

### c. Waiting for asynchronous operations with promises and `await`

🤔 How do we make sure that all the operations on files are over before
continuing the execution of the script? It was great to let the script deal with
all the files as fast as possible without caring about the execution order. If
we replace `fs.readFile` and `fs.writeFile` with their `Sync` equivalent, we
would lose this advantage: our script would be slower because it wouldn't be
able to parallelize the operations.

What we want is to keep the same approach we have now, and do something when we
know all the files have been handled. To do so, we are going to use the method
`map` along with the object `Promise` and the static method `Promise.all`
provided by JavaScript.

Instead of calling directly all the `fs.readFile` instructions in a `forEach`
loop, we are going to store them in an array of `Promise` objects. Then we'll
call await `Promise.all(array)` to wait for all the async instructions. This
will pause the execution until all the promises are fulfilled, and only then
we'll leave the function:

```diff
  const applyPatches = () => {
-   let results = [];
-   files.forEach((filename, index) => {
+   let writePromises = files.map((filename, index) => {
+     return new Promise((resolve) => {
        try {
          let diffName = createDiff(filename, index);
          fs.readFile(diffName, 'utf8', function(err, data) {
            if (err) {
              throw new error(`Failed to read ${diffName} to edit the patch path. This was caused by: ${err}`);
            }
            // Matching Guidemaker scaffolding consists in replacing path guides/release with guides
            const unversionedFileName = unversionPath(filename);
            const replacement = unversionPath(data);

            fs.writeFile(diffName, replacement, 'utf8', function(err) {
              if (err) {
                throw new error(`Failed to write ${diffName} to edit the patch path. This was caused by: ${err}`);
              }
              try {
                let isNew = !fs.existsSync(unversionedFileName);
                runShell(`git apply ${diffName}`);
                if (isNew) filesToPost.push({ filename: unversionedFileName });
-               results.push(0);
                fs.unlink(diffName, function(err) { ... });
+               resolve(0);
              } catch (error) {
                console.log(`"git apply" command failed for ${diffName}`);
                filesToPost.push({ filename: unversionedFileName, diffName });
-               results.push(2);
+               resolve(2);
              }
            }
          }
        } catch (error) {
          console.warn(error);
-         hasPendingDiff = true;
-         results.push(1);
+         resolve(1);
        }
+     });
    });
-   return results.some((status) => status === 0);
+   console.log('Ready to create the patch files');
+   return Promise.all(writePromises).then((results) => {
+     const hasErrors = results.some((status) => status === 1);
+     if (hasErrors) {
+       hasPendingDiff = true;
+       console.warn('Writing operations have been completed with errors. Some of the patch files are applied or stored in scripts/patches/, and manual actions have been added to the warning list.');
+     } else {
+       console.log('All writing operations have been completed without errors, patch files are applied or stored in scripts/patches/');
+     }
+     return results.some((status) => status === 0);
+   });
  }
```

That's a lot of changes, let's see them in detail:

- `files.forEach` has become `files.map`: instead of performing instructions at
  each iteration, we rather map our array of filenames to an array of `Promise`
  objects.
- The `Promise` constructor takes a function in argument. The core of this
  function is executed when the promise is requested. Also, it has two
  parameters: `resolve` and `reject`. These are functions to call respectively
  when the promise is successful and when an error happens. Here, we didn't
  declare `reject` and we use only `resolve`, because we don't have proper
  errors, only warnings. The distinction is important when looking at MDN doc:
  "[`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
  rejects when any of the input's promises rejects, with this first rejection
  reason." It means that if we used for instance `reject()` instead of
  `resolve(1)` in the top-level `catch` of the function, and there's an error at
  iteration 2/5, we would immediately enter the `catch` callback of
  `Promise.all` even if there are still 3 files to handle. The operations on
  these files would still be performed, but we would miss our goal of waiting
  for all the files to be handled before continuing the execution.
- When we use `resolve(n)`, `n` is the data returned by the promise. Each
  promise resolving to an integer means that, when all the promises are
  fulfilled, the `results` data in the `then` callback of `Promise.all` is an
  array of integers that replaces our previous variable `results`.

With this code, `applyPatches` has become an asynchronous function that we can
call with `await applyPatches();` and we are all good to call `postAllIssues` 🎉

### d. Opening a PR with GitHub API

After the function `pushChanges()` is executed, we can open the "catchup PR"
using GitHub API. It's essentially the same thing as GitHub issues, except that
you need to specify what branch you want to merge into what other branch:

```js
const openCatchupPR = () => {
  return fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: getRequestHeaders(),
    body: JSON.stringify({
      title: `Catch up latest docs: from ${currentEmberVersion} to ${newEmberVersion}`,
      body: "This is an automatic catch up PR to align our non-translated documentation with the latest official documentation.",
      head: catchupBranch, // === `catchup-${newEmberVersion}`
      base: "master",
      labels: ["Guides FR trad"],
    }),
  });
};
```

Then we can call this function right after the branch is correctly pushed:

```js
try {
  pushChanges();
  try {
    console.log("Attempting to post the catch up PR");
    const prResponse = await openCatchupPR();
    const jsonPrResponse = await prResponse.json();
    console.log("Server responded with:", jsonPrResponse);
  } catch (error) {
    console.warn(`Failed to post the catchup PR. This was caused by: ${error}`);
  }
} catch (error) {
  console.warn("Failed to push the catchup branch.");
}
```

Sounds like our script is ready to work! We learned how to:

- Write `issues` and `pulls` requests for GitHub API
- Send requests with `fetch` and handle the response
- Manage nested asynchronous operations with `Promise` and `Promise.all`

## 5. Last words

This is it!

There are still a couple of details we can add to improve the script. For
instance, reworking the logs to have a clear list of "required actions" the
developer has to do manually if something goes wrong, and that is visually
separated from the rest of the logs. We could also switch back to the `master`
or `catchup` branch after resetting `ref-upstream`, depending on the required
actions. In terms of clean-up, we could also remove the `scripts/patches` folder
and all its content once all the GitHub issues have been posted.

On a different matter, we could also write some tests to make sure the script
does what we think it does. In case you wonder, such tests don't exist yet as I
am writing these lines. To test the render of the issues and what the catch-up
PR looks like, I did what I usually do: manual process first, then switch to the
automation when I am clear with what I want. I created a sandbox project that
contains only a `guides/release/` folder with a couple of fake markdown files,
then I forked it and added the `catchup.mjs` to the fork along with npm package
manager to import the few dependencies the script needs. By committing to the
upstream sandbox, I could test many cases, including some that never occurred in
the real guides so far, like the deletion of markdown files.

You can see the final version of the script in the `ember-fr-guides-source`
repository, it's
[right there](https://github.com/DazzlingFugu/ember-fr-guides-source/blob/master/scripts/catchup.mjs).

As said at the beginning of this article, none of this answers the question "how
to bootstrap a translation project, what's the best approach to use?". However,
all the above may have convinced you that maintenance automation is not that big
of a deal. And it's an iterative process, too. I could have started using this
script to automate the git commands before it was able to do the API requests.
Even now that it's complete, there are certainly improvements to make, but it
doesn't prevent me from using the script and saving time today 😉.
