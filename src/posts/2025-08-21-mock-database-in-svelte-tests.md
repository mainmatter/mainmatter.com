---
title: "Mock database in Svelte e2e tests with drizzle and playwright fixtures"
authorHandle: paoloricciuti
tags: [svelte]
customCta: ""
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "Writing tests when you are loading your data from a database is very annoying but we can make it better."
autoOg: true
tagline: <p>Writing tests when you are loading your data from a database is very annoying but we can make it better</p>

image: "/assets/images/posts/2025-08-21-mock-database-in-svelte-tests/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

In the good old days of Single Page Applications there was a single way to get data from the db: since all the code ran on the client you had to expose an API endpoint and use `fetch` to get the data from it. It was simple and, most importantly, very easy to test: this is all it took

```ts
window.fetch = () => {
  return my_mocked_data;
};
```

Nowadays it's not as simple: we live in an isomorphic world where your Javascript runs on the server first and on the client then. This has several advantages:

- You can easily SSR your application for faster load times and better SEO
- The data loading is done on the server so there's no back and forth...you load the data from the db, it's injected into your application and you can just use it to build your page.

This is particularly important when you have a single server because the information is bound to travel at the speed of light. This means that if your server is in the United States and someone accesses it from Australia, the request would look something like this

![a diagram showing the back and forth between a server in the USA and a client in Australia, there's two arrows from the client to the server adding to 200ms and two arrows from the server to the client adding to another 200ms for a total of 400ms](/assets/images/posts/2025-08-21-mock-database-in-svelte-tests/data-flow-before.png)

Notice that the more API calls we make, the more the delay between when you load the page and when you can actually see the data increases.

This is how it would look with the isomorphic, server-side rendered model

![a diagram showing the back and forth between a server in the USA and a client in Australia, there's one arrow from the client to the server adding to 100ms and one arrow from the server to the client adding to another 100ms for a total of 200ms, there are two additional arrows with a red box on top signaling they are not needed anymore](/assets/images/posts/2025-08-21-mock-database-in-svelte-tests/data-flow-after.png)

Even with this very simple example we cut the total time in half because we don't need to request additional data: once the page is on the client, that's it.

## The problem

As we hinted before, this approach sounds like the most reasonable...there's a problem however: testability! Doing end-to-end tests when a database is involved is not an easy task and while, to be frank, this mostly boils down to the lack of mocking ability of the database drivers, it's definitely something to keep in mind.

Now one of the solutions could be to simply add an API layer in front of our db and mock that, or we could contain all our db access into a single module and mock that module during testing, but both are not ideal: the first one adds an unnecessary network jump, the second one forces us to structure our code in a certain way and we are one new hire away from messing up that structure (and we would also need to reimplement all the logic in the mocking module).

What we really want is a way to write our code naturally while also having the ability to interact with the database from our tests.

## Before we start

Small aside before we dive into the solution: this is an opinionated article, I'm going to use the recommended tools that, as of today, you can add to your SvelteKit project using `pnpm dlx sv@latest add` or `pnpm dlx sv@latest create`...let's jump right into it.

## The solution

Let's start by creating a brand new SvelteKit project, we are going to select TypeScript, Prettier, ESLint, Playwright and Drizzle with SQLite (libSQL) as our stack (you can find the initial setup at the `main` branch of [this repo](https://github.com/mainmatter/svelte-mock-db))

```
> pnpm dlx sv@latest create
┌  Welcome to the Svelte CLI! (v0.9.2)
│
◇  Where would you like your project to be created?
│  svelte-mock-db
│
◇  Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  prettier, eslint, playwright, devtools-json, drizzle
│
◇  drizzle: Which database would you like to use?
│  SQLite
│
◇  drizzle: Which SQLite client would you like to use?
│  libSQL
│
◆  Successfully installed dependencies
│
◇  Successfully formatted modified files
│
◇  What's next? ───────────────────────────────────────────────────────────╮
│                                                                          │
│  📁 Project steps                                                        │
│                                                                          │
│    1: cd svelte-mock-db                                                  │
│    2: pnpm run dev --open                                                │
│                                                                          │
│  To close the dev server, hit Ctrl-C                                     │
│                                                                          │
│  🧩 Add-on steps                                                         │
│                                                                          │
│    drizzle:                                                              │
│      - You will need to set DATABASE_URL in your production environment  │
│      - Check DATABASE_URL in .env and adjust it to your needs            │
│      - Run pnpm run db:push to update your database schema               │
│                                                                          │
│  Stuck? Visit us at https://svelte.dev/chat                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
└  You're all set!
```

Let's explore the relevant files: our db lives in `./src/lib/server/db/index.ts`

```ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = createClient({ url: env.DATABASE_URL });

export const db = drizzle(client, { schema });
```

and here's our very simple schema (in `./src/lib/server/db/schema.ts`)

```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  name: text("name"),
});
```

In case we need it we can obviously export other tables from here.

As you might have guessed, we do need a `DATABASE_URL` environment variable in our `.env` file

```
DATABASE_URL="file:local.db"
```

We can use `file:local.db` to generate a SQLite db locally (this setup uses SQLite but it can work with more complex setups with PostgreSQL and MySQL in the same way).

If we run `pnpm db:generate` and `pnpm db:migrate` we'll notice a brand new `local.db` file generated in our project with a `user` table with an `id` and a `name` column.

Let's actually take a look at how we use this db. In `/src/routes/+page.server.ts` we can see our load function

```ts
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";

export async function load() {
  const users = await db.select().from(user).all();
  return {
    users,
  };
}
```

For the sake of the example we are gonna just select all the users and return them. We can then access them in our `/src/routes/+page.svelte` and show them all in a list

{% raw %}

```svelte
<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.users as user (user.id)}
		<li>{user.id} - {user.name}</li>
	{/each}
</ul>
```

{% endraw %}

### Some changes

Before we start writing our tests we need to make some changes: what we will do is actually spin up a brand new database specific for testing but this introduces a slight problem...since Playwright doesn't run through `vite` we can't use any virtual module from SvelteKit...luckily we don't need to do much to change this

```ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = createClient({ url: process.env.DATABASE_URL });

export const db = drizzle(client, { schema });
```

We just need to get rid of `env` from `$env/dynamic/private` and substitute that with good old `process.env`...we also need to install `dotenv-cli` since we need to manually load our `.env` file. Speaking of which, let's create a `.env.test`

```
DATABASE_URL="file:test.db"
```

And now let's update our `package.json` file to make use of `dotenv`

```json
{
  // rest of the package json
  "scripts": {
    "dev": "dotenv vite dev",
    "build": "dotenv vite build",
    "preview": "dotenv vite preview",
    "prepare": "svelte-kit sync || echo ''",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "format": "prettier --write .",
    "lint": "prettier --check . && eslint .",
    "test:e2e": "dotenv --env-file=.env.test playwright test",
    "test": "pnpm test:e2e",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
  // rest of the package json
}
```

Notice that with `test:e2e` we are specifying `.env.test` as the `--env-file`.

With these changes...our application runs exactly like before 😅

### The actual magic trick

Now that we have set up our database file to work regardless of SvelteKit/vite we can start working on our magic trick! Our ace up the sleeve is a pretty neat library from the Drizzle team: `drizzle-seed`! This library has a method to `seed` the database with random but consistent data and a method to completely wipe the db (you actually don't have to do this with the library but they figured out how to reset a db for all the supported dbs for you...if you prefer to do it by hand you can just send a raw SQL query to wipe the db).

But where should we use those methods? Well, we want to seed the database before each test and then wipe it completely when it finishes. If this description didn't strike you, we are basically describing a Playwright fixture!

#### Playwright fixtures

This is the initial sentence in the documentation for Playwright fixtures

> Playwright Test is based on the concept of test fixtures. Test fixtures are used to establish the environment for each test, giving the test everything it needs and nothing else. Test fixtures are isolated between tests. With fixtures, you can group tests based on their meaning, instead of their common setup.

An example of a fixture is the `page` you destructure in your Playwright tests...that page is unique and isolated for each test and the nice thing about Playwright is that you can create your own!

Start by creating an `index.ts` file in your `e2e` folder...we need to import `test` from `@playwright/test` and use the `extend` API to create a new `test` function that will include your new fixtures.

```ts
/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";

export const test = base.extend<{ my_fixture: string }>({
  my_fixture: async ({}, use) => {
    // your setup code here
    await use("fixture_value");
    // your cleanup code here
  },
});
```

Let's explain what's going on here: we are extending the original `test` function and we pass a generic to tell TypeScript what's the name of the fixture and what it will provide to each test (in this case a string). Then we pass an object to `extend` that will have a function for each fixture you are adding to the `base`. The first argument of this function is an object containing all the fixtures already defined, we could for example destructure `page` and automatically navigate to a certain page before invoking `await use`...this portion of code is also where we can do our setups.

We then invoke `await use` passing a value...this value needs to be the type we are defining in the `extend` generic (in this case `string`). This function call will resolve once the test has finished, we can now clean things up.

If we now import this `test` function in our test files we can use it like this

```ts
import { expect } from "@playwright/test";
import { test } from "../index.js";

test("my fixture", async ({ my_fixture }) => {
  expect(my_fixture).toBe("fixture_value");
});
```

Can you see where this is going? With this method we can provide our tests with an access to our `db`!

```ts
/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { db } from "../src/lib/server/db/index.js";

export const test = base.extend<{ db: typeof db }>({
  db: async ({}, use) => {
    // your setup code here
    await use(db);
    // your cleanup code here
  },
});
```

This is already a huge step forward but we can also do better...as we said, we want to seed our db before every test and reset it after...let's see how it works with `drizzle-seed`

#### Putting it all together

```ts
/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { db } from "../src/lib/server/db/index.js";
import * as schema from "../src/lib/server/db/schema.js";
import { reset, seed } from "drizzle-seed";

export const test = base.extend<{ db: typeof db }>({
  db: async ({}, use) => {
    await seed(db as never, schema);
    await use(db);
    await reset(db as never, schema);
  },
});
```

Note we need to use `as never` in this case because we are using LibSQL and [there's an open issue for this](https://github.com/drizzle-team/drizzle-orm/issues/4435)...however it's just a type error and the functionality works just fine (and you will not have this problem if you are using any other provider).

Based on how Drizzle structures the queries you will need to import the schema too in every test...so why not do that only once and expose it as a fixture?

```ts
/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { db } from "../src/lib/server/db/index.js";
import * as schema from "../src/lib/server/db/schema.js";
import { reset, seed } from "drizzle-seed";

export const test = base.extend<{ db: typeof db; schema: typeof schema }>({
  db: async ({}, use) => {
    await seed(db as never, schema);
    await use(db);
    await reset(db as never, schema);
  },
  schema: async ({}, use) => {
    await use(schema);
  },
});
```

The last thing that we need to do is actually migrate our db when we launch our test suite...we can do this in `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./src/lib/server/db/index.js";

migrate(db, {
  migrationsFolder: "./drizzle",
});

export default defineConfig({
  webServer: {
    command: "pnpm build && pnpm preview",
    port: 4173,
  },
  testDir: "e2e",
});
```

And just like that we have access to our db in each test

```ts
import { expect } from "@playwright/test";
import { test } from "./index.js";

test("home page has the right first user", async ({ page, db, schema }) => {
  const first_user = await db.select().from(schema.user).limit(1).get();
  await page.goto("/");
  await expect(page.locator("li").first()).toHaveText(
    `${first_user?.id} - ${first_user?.name}`
  );
});
```

If we launch our Playwright tests with UI using `pnpm test:e2e -- --ui` we can see that the test passes and we have 10 users in our db!

![UI for Playwright showing a passing test](/assets/images/posts/2025-08-21-mock-database-in-svelte-tests/playwright.png)

Now, there's still a couple of problems with this: the fixture only executes when we actually use it inside a test...that might be fine but I would say it's better to always reset the db, otherwise stuff from the previous test could leak into the next and all of a sudden the test suite is non-deterministic anymore. We can fix this with a slight change to our fixture

```ts
/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { db } from "../src/lib/server/db/index.js";
import * as schema from "../src/lib/server/db/schema.js";
import { reset, seed } from "drizzle-seed";

export const test = base.extend<{ db: typeof db; schema: typeof schema }>({
  db: [
    async ({}, use) => {
      await seed(db as never, schema);
      await use(db);
      await reset(db as never, schema);
    },
    { auto: true },
  ],
  schema: async ({}, use) => {
    await use(schema);
  },
});
```

`{ auto: true }` instructs Playwright to always run the fixture even if it's not destructured in the test.

The other inconvenience is that right now we need to do all our changes to the db before running the test...but since we wipe our db every time we can do better...with an `option` fixture!

```ts
/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";
import { db } from "../src/lib/server/db/index.js";
import * as schema from "../src/lib/server/db/schema.js";
import { reset, seed } from "drizzle-seed";

export const test = base.extend<{
  db: typeof db;
  schema: typeof schema;
  seed?: Record<string, unknown[]>;
}>({
  // the first element of the array is the default of the fixture
  seed: [undefined, { option: true }],
  db: [
    async ({ seed: seed_data }, use) => {
      // if we have the seed data instead of seeding the db with `drizzle-seed` we manually insert
      // the data in the db
      if (seed_data) {
        for (const table in seed_data) {
          if (seed_data[table] && seed_data[table].length > 0) {
            await db.insert(schema[table]).values(seed_data[table]);
          }
        }
      } else {
        await seed(db as never, schema);
      }
      await use(db);
      await reset(db as never, schema);
    },
    { auto: true },
  ],
  schema: async ({}, use) => {
    await use(schema);
  },
});
```

We can now use `test.use` inside a module or a describe block to seed our db with specific data

```ts
import { expect } from "@playwright/test";
import { test } from "./index.js";

test("home page has the right first user", async ({ page, db, schema }) => {
  const first_user = await db.select().from(schema.user).limit(1).get();
  await page.goto("/");
  await expect(page.locator("li").first()).toHaveText(
    `${first_user?.id} - ${first_user?.name}`
  );
});

test.describe("empty database", () => {
  test.use({
    seed: {
      user: [],
    },
  });

  test("home page has no users", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("li")).toHaveCount(0);
  });
});

test.describe("one specific user", () => {
  test.use({
    seed: {
      user: [
        {
          id: 1,
          name: "Paolo Ricciuti",
        },
      ],
    },
  });

  test("home page has a single user", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("li")).toHaveText(`1 - Paolo Ricciuti`);
  });
});
```

And that's it! All of this can be further improved using the `refine` function of `drizzle-seed` (more documentation on the package [here](https://orm.drizzle.team/docs/seed-overview)) but now that you know the basics the world is your playground!

## Conclusions

This is a small example and as I've said it can be improved but should give you the basis to make your setup perfect for your needs! You can find the final code [here](https://github.com/mainmatter/svelte-mock-db/tree/completed).
