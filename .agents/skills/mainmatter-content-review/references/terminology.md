# Mainmatter terminology and canonical spellings

Canonical spellings for names, products, and terms that appear in Mainmatter
content. When a document gets any of these wrong, flag it as `must-fix`
(typos in proper nouns are always must-fix).

This list is not exhaustive. Extend it when new terms come up.

## Company and brand

- **Mainmatter** — one word, capital M, no capital M in the middle. Never
  "MainMatter", "mainmatter" (except in domains/URLs), "Main Matter",
  "Mainmater".
- **Mainmatter GmbH** — legal entity, capitalised exactly like this.
- Treat Mainmatter as **singular** in prose: "Mainmatter is", "Mainmatter
  offers", "Mainmatter specializes". Not "Mainmatter are".

## Technologies Mainmatter works on

- **Rust** — capital R. "rust" is wrong.
- **Ember.js** — with the `.js`. `Ember` alone is acceptable when the
  context is already clear (e.g., "the Ember Initiative"). `Embers` is never
  right. "EmberJS" and "Ember JS" both wrong.
- **Ember** (the framework, shorthand) — fine when context is set.
- **Svelte** — capital S. "svelte" is wrong.
- **SvelteKit** — one word, camelCase. "Svelte Kit", "SvelteKIT" wrong.
- **TypeScript** — one word, camelCase. "Typescript" wrong.
- **JavaScript** — one word, camelCase. "Javascript", "javascript" wrong.
  (`javascript:` URLs are a separate, lowercase-required case.)
- **Vite** — capital V. "vite" wrong.
- **Vitest** — capital V.
- **Embroider** — capital E.
- **Rolldown**, **Rollup**, **Babel**, **Webpack** (not "webpack" or
  "WebPack"), **esbuild** (lowercase), **pnpm** (lowercase).
- **Node.js** — with the `.js`, capital N.
- **Git**, **GitHub**, **GitLab** — capital G and capital H/L.

## Mainmatter engineers and founders (common names in content)

Be careful with these. Misspelling a team member's name is always
must-fix. If uncertain, flag with a note rather than silently guessing.

- **Marco Otte-Witte** — hyphenated surname. Founder.
- **Luca Palmieri** — two `l`s in surname? No, one. "Palmiere" wrong.
  Author of "Zero to Production in Rust".
- **Chris Manson** — one `n` at end. Ember.js Framework Core Team member.
- **Paolo Ricciuti** — double `c`, single `t`. Svelte core team member.
- **Marine Dunstetter** — "Marine" not "Marina".
- **Jonas Metzener** — double `z`? No, single. Check canonical source
  when uncertain.

If a name spelling is uncertain, write: "Author name spelling — please
verify against canonical source." Don't assume.

## Products, initiatives, events Mainmatter runs or sponsors

- **EuroRust** — one word, capital E and R. "EuroRust" not "Euro Rust".
- **EmberFest** — one word, capital E and F.
- **Svelte Summit** — two words.
- **Ember Initiative** — two words, both capitalised.
- **Ember Vite Codemod** / **ember-vite-codemod** — casing depends on
  context: human prose uses Title Case ("Ember Vite Codemod"), package
  name uses kebab-case ("ember-vite-codemod").
- **100 Exercises to Learn Rust** — exact title, in quotes in prose.
- **Zero to Production in Rust** — exact title, in quotes in prose.
- **rust-exercises.com** — lowercase, hyphenated domain.

## Service names (from Mainmatter's site)

Canonical forms as they appear in navigation and landing pages:

- **Rust Consulting**
- **C-to-Rust Migrations** — with hyphens, capital C and R.
- **Rust Team Augmentation**
- **Cloud-Native Rust Systems** — "cloud-native" hyphenated as adjective.
- **Rust Training and Workshops**
- **Svelte Consulting**
- **Svelte 5 Migrations** — with the version number.
- **Svelte Training and Workshops**
- **Svelte Team Augmentation**
- **Ember.js Consulting**
- **Ember.js Vite Migrations**
- **Ember.js Future-Proofing** — hyphenated.
- **Ember.js Multi-Framework Architectures** — hyphenated.
- **Team Reinforcement**
- **Launch Your Idea**
- **Tech Modernization**
- **Strategic Advice**
- **Workshops**

## Industry and tech terms Mainmatter uses

- **open source** (noun) — two words. "We contribute to open source".
- **open-source** (adjective before noun) — hyphenated. "An open-source
  library".
- **codebase** — one word. "Code base" is wrong in Mainmatter content.
- **frontend** / **backend** — one word (modern convention). Mainmatter
  content uses these as one word; flag two-word or hyphenated versions
  for consistency.
- **full-stack** (adjective) — hyphenated. **full stack** (noun) — two
  words, though this one varies.
- **cloud-native** (adjective) — hyphenated.
- **multi-framework** — hyphenated.
- **end-to-end** — hyphenated.
- **real-time** (adjective) — hyphenated. **in real time** (adverb) —
  no hyphen.
- **machine learning** — two words; "machine-learning" when used as
  adjective ("machine-learning model").
- **AI** — uppercase. Avoid "A.I." and "ai".
- **PR** — short for pull request, uppercase. On first use in a post for
  a non-technical audience, expand to "pull request (PR)".
- **API** — uppercase.
- **CI / CD / CI/CD** — uppercase.

## Preferred terminology

Mainmatter content consistently uses certain framings. Nudge toward these
when close synonyms appear:

| Prefer | Over |
|---|---|
| engineering consultancy | software agency, development shop, dev shop |
| engineers | developers (when distinguishing from non-engineers; both OK) |
| migration | transformation (when it's literally a migration) |
| modernization | digital transformation |
| training / workshop | boot camp (unless specifically a boot camp) |
| codebase assessment | code audit (both fine, but "assessment" is more common) |
| client | customer (for consulting engagements) |
| teammate | resource (always flag "resources" used to mean people) |

This is a soft preference. Author's choice wins if the alternate reads well.

## SEO and metadata length constraints

When reviewing or rewriting structured metadata, respect platform limits:

- **<title>** / SEO title: ≤ 60 characters to avoid truncation in search.
- **meta description**: ≤ 160 characters.
- **Open Graph title**: ≤ 90 characters (60 is safer).
- **Open Graph description**: ≤ 200 characters (160 is safer).
- **schema.org description**: no hard limit, but keep to 1–2 sentences.

Flag if a suggested rewrite pushes a field past its limit.

## Capitalisation conventions

- **Blog post titles** in URLs and page headings: observe the author's
  choice. Mainmatter has used both Title Case and sentence case over time.
  Flag only within-document inconsistency.
- **Section headings** within a blog post: usually Title Case on landing
  pages, sentence case in blog bodies. Check the rest of the document
  and match.
- **Mainmatter product names and services**: Title Case (as listed above).
