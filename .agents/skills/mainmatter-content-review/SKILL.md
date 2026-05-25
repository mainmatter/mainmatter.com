---
name: mainmatter-content-review
description: >
  Review Mainmatter-authored content (blog posts, case studies, marketing pages,
  landing pages, white papers, workshop materials, conference talks, newsletters,
  social posts) for typos, grammatical errors, English correctness, and alignment
  with the Mainmatter voice. Use this skill whenever anyone at Mainmatter asks to
  proofread, review, copy-edit, check, fix, polish, or improve a piece of written
  content, or shares a GitHub PR, Notion page, markdown file, or raw text for
  review. Trigger on phrases like "review this post", "check this for typos",
  "is this in Mainmatter voice", "copy-edit this", "proofread the PR", "look
  over this draft", "does this read right", "tone check", "how does this sound",
  or "fix the English". Also trigger on Notion URLs referencing drafts, case
  studies, blog outlines, SEO or content pages, and on GitHub PRs touching
  src/*.njk files, blog markdown files, cases/*, or other prose-heavy files.
  This skill reviews prose only, never code.
---

# Mainmatter content review

Review Mainmatter content for language correctness and voice fit. The team is
international, so English is most authors' second language: the skill is tuned
to catch translation smells and L2 patterns without being precious about
US-vs-UK preferences. The skill reads international English — either US or UK
spelling is fine, as long as one document is consistent.

The skill's job is to help a writer find the balance between their own voice
and the Mainmatter writing standard. It is not a style police. It surfaces
concrete, actionable suggestions with a clear before/after, so the writer can
accept or reject each one fast.

## Inputs

Accept any of:
- **GitHub PR URL** (e.g. `https://github.com/mainmatter/mainmatter.com/pull/2857`) —
  diff the PR branch against master, isolate prose changes, review those.
- **Notion page URL** — fetch via Notion MCP, review the page content.
- **Markdown, .txt, or .docx file** uploaded or passed by path — review the full
  document.
- **Raw text** pasted into the chat — review in-place.

If the input is ambiguous (e.g. a repo URL without a PR number), ask what to
review. If the PR or page is large and mixes code with prose, make clear which
parts were reviewed and which were skipped.

## What this skill reviews (and doesn't)

Reviews:
- Prose in blog posts, case studies, landing page copy, marketing pages,
  workshop and talk outlines, newsletters, social posts, SEO metadata (title,
  description, name), and the prose portions of `.njk`, `.md`, `.mdx` files.
- Human-readable fields in structured files: `title`, `description`, `name`,
  `og:*` text, schema.org text fields.

Does not review:
- Source code, code blocks, shell commands, configuration values, dependency
  versions, imports, exports, or the technical correctness of anything.
- Auto-generated content (lockfiles, build output, transcripts) unless the user
  explicitly asks.

When in doubt, skip and note it at the top of the output.

## Workflow

### Step 1: Fetch the content

- **GitHub PR**: clone the PR branch shallowly and diff against `master`.
  Use the clone tool when `web_fetch` is rate-limited — the `github.com` domain
  is allowed for bash. The repo is generally `mainmatter/mainmatter.com` but
  can be any Mainmatter repo.

  ```bash
  git clone --depth 50 --branch <branch> https://github.com/<org>/<repo>.git /home/claude/review
  cd /home/claude/review
  git fetch origin master:master --depth 50
  git diff master..<branch> -- <prose-files>
  ```

  Prose-file filter (rough heuristic): `*.md`, `*.mdx`, `*.njk`, `*.html`,
  `*.txt`, plus text fields within `*.yaml`, `*.json` when they are clearly
  human-facing (title, description, name, body, content).

- **Notion page**: call `Notion:notion-fetch` on the page URL. Extract plain
  text content and preserve section structure so location references are
  meaningful.

- **Uploaded file**: read from `/mnt/user-data/uploads/`. For `.docx`, follow
  `/mnt/skills/public/docx/SKILL.md` to extract text.

- **Raw text**: take it as-is.

### Step 2: Identify prose spans

Separate prose from non-prose before reviewing:
- Skip fenced code blocks (```), inline code (`` ` ``), YAML keys and non-text
  values, shell output, HTML tag names/attributes (review attribute **values**
  only when they are user-facing text like `alt`, `title`, `aria-label`,
  `<meta content="...">`).
- In `.njk` frontmatter, review values for keys: `title`, `description`,
  `name`, `og:*` text, `description`, schema.org text fields. Skip: permalinks,
  image paths, type enums, booleans, arrays of tech keywords.
- In Notion pages, skip property values that are enums, dates, or IDs. Review
  rich text content.

### Step 3: Run the review

Run the six checks below against the prose spans. For each finding, capture:
- **Location** — file + line, or section heading for Notion.
- **Category** — one of: Typo, Grammar, Punctuation, Consistency, Voice,
  Clarity.
- **Severity** — `must-fix`, `should-fix`, `nice-to-have`.
- **Before / After** — exact text.
- **Why** — one short sentence.

#### Check 1: Spelling and typos

- Flag misspellings.
- Pay special attention to product, framework, and person names:
  Mainmatter (one word, capital M only at the start), Svelte, SvelteKit,
  Ember.js (with `.js`), Rust, EuroRust, EmberFest, Svelte Summit, Embroider,
  Vite, TypeScript, JavaScript.
- Flag capitalization errors in product names (e.g. `svelte`, `ember`,
  `Typescript`, `Javascript` — all wrong in prose).
- Flag Mainmatter engineers' names when misspelled: Luca Palmieri,
  Chris Manson, Paolo Ricciuti, Marco Otte-Witte, Marine Dunstetter, etc.
  If unsure about a name spelling, note it as uncertain rather than silently
  correcting.

#### Check 2: Grammar

Subject-verb agreement, article usage (`a/an/the`), preposition choice, tense
consistency, pronoun reference, dangling modifiers, sentence fragments.

Treat "Mainmatter" as singular in prose ("Mainmatter is", "Mainmatter offers"),
not plural ("Mainmatter are"). Published Mainmatter content is consistent on
this — flag inconsistencies when one document mixes both.

#### Check 3: Punctuation

Comma splices, missing commas before conjunctions in long sentences, run-on
sentences, mismatched quotes, inconsistent use of em dashes vs. hyphens vs.
en dashes. Em dashes are fine in Mainmatter content (`—`, not `--`).

#### Check 4: Consistency

Within a single document:
- US vs. UK spelling — pick one and stick to it (flag mixes like "organize"
  alongside "optimisation").
- Title Case vs. sentence case in headings — pick one.
- Product names: always `Ember.js` (not `Ember` inconsistently, though
  `Ember` alone is fine when the context is clear).
- Hyphenation of compounds: `open source` (noun) vs. `open-source` (adjective);
  `cloud native` vs. `cloud-native`. Match the doc's chosen style.

#### Check 5: Voice and tone (Mainmatter voice)

Read `references/mainmatter-voice.md` for the full voice guide and a checklist
of patterns to reinforce and to flag. Core tests:

- **Confident without bluster.** Flag empty marketing language
  ("cutting-edge", "world-class", "best-in-class", "next-generation",
  "revolutionary") unless backed by specific, falsifiable evidence. Flag
  over-hedging too ("we might possibly be able to perhaps").
- **Technical and concrete.** Flag claims that don't land in specifics.
  "We improved performance" is weak; "We cut p95 latency from 420 ms to
  110 ms" is Mainmatter-shaped.
- **Approachable to both devs and decision-makers.** Flag walls of jargon
  unexplained (a manager skims off), and flag empty business-speak a
  developer would roll their eyes at ("synergize", "stakeholder alignment",
  "holistic solution").
- **Active voice.** Flag passive where active works.
- **No AI slop.** Flag "It's not just X — it's Y", "Let's dive in", "In
  today's fast-paced world", "It's worth noting that", "Navigate the
  complexities of", and similar LLM tics.
- **No filler.** Flag "very", "really", "quite", "simply", "just" when they
  add nothing. Flag "In order to" when "to" works.

Voice findings are usually `should-fix` or `nice-to-have`, not `must-fix` —
the author's own voice matters. Suggest, don't mandate.

#### Check 6: Translation smells and L2 patterns

Read `references/l2-english-patterns.md` for the full list. Most common ones
to scan for:

- **Article errors**: missing or extra `the`, `a`, `an`. L2 speakers from
  German, Slavic, or Romance backgrounds frequently miss or over-use
  articles.
- **Preposition errors**: "discuss about", "depend of", "consist in",
  "suffer of", "on the internet" vs. "in the internet".
- **False friends** from German, French, Italian, Spanish: e.g.
  "actually" (should be "currently" from German "aktuell"),
  "eventually" (not "possibly"), "sensible" (not "sensitive"),
  "deliver in time" (should be "on time").
- **Word-order calques**: adverb placement, adjective order.
- **Over-literal translations**: "in the last time" (recently), "since
  long time" (for a long time).
- **Verb pattern errors**: "help them deliver" (correct) vs. "support them
  deliver" (ungrammatical).

### Step 4: Write the output

Create a markdown file at `/mnt/user-data/outputs/content-review-<slug>-<YYYY-MM-DD>.md`
where `<slug>` is a short identifier (PR number, page name, filename).

For short reviews (< 8 findings) and when the source was a chat paste, respond
inline in the chat instead of creating a file.

Follow the output format below exactly.

## Output format

```markdown
# Content review: <source title or PR number>

**Source:** <URL or filename>
**Reviewed:** <date>
**Files checked:** <list>
**Scope note:** <one line on what was reviewed / skipped>

## Summary

<2–3 sentence overview: how many findings by category, overall voice read,
anything the author nailed particularly well.>

## Must-fix

### 1. <Category>: <short description>

**Location:** `path/to/file.njk`, line 27 (or section "Heading")

```diff
- Mainmtter offers hands-on Rust training for engineering teams.
+ Mainmatter offers hands-on Rust training for engineering teams.
```

**Why:** Company name is misspelled.

---

### 2. <Category>: <short description>
...

## Should-fix

### 3. <Category>: <short description>
...

## Nice-to-have

### 4. <Category>: <short description>
...

## Voice notes (not line-level)

<Only include this section if there are document-level voice observations
that don't fit a single line change. Keep to 1–4 short bullets.>

- <Observation, e.g. "Opening paragraph is strong on specifics; middle third
  drifts into generic SaaS language — consider re-anchoring with a concrete
  example from the engagement.">
```

Rules for the output:

- **One finding per section.** Don't combine unrelated issues under one
  header, even in the same line.
- **Exact before/after.** The `+` line should be copy-paste ready. No
  ellipses in the "After" unless the surrounding context is truly unchanged.
- **Show enough context.** If the fix changes a single word, include the full
  sentence so the writer can locate it without ambiguity.
- **Group by severity, not by file.** Writers want to see the important
  things first. Use file paths in the location to keep grouping readable.
- **Short reasons.** One sentence each. The writer either agrees or doesn't —
  they don't need a paragraph.
- **Neutral tone.** The author is a colleague, often an L2 writer, often
  under deadline. Don't condescend, don't pile on.

## Severity guidelines

- **Must-fix**: typos, broken grammar, factually wrong product names,
  inconsistencies that will make a reader reread. Anything a professional
  proofreader would always flag.
- **Should-fix**: L2 patterns that read as unnatural, voice issues that
  weaken a key claim, marketing language in a spot where a concrete claim
  would be stronger.
- **Nice-to-have**: preference-level suggestions, stylistic smoothing,
  optional cuts for tightness.

When uncertain between two levels, go lower. Over-flagging trains the
writer to ignore the review.

## Edge cases

- **Quoting an external source**: don't correct typos inside verbatim quotes
  from third parties. Flag only if the quote is broken in a way that's
  clearly a transcription error.
- **Deliberate informality**: social posts and some blog intros use
  conversational language by design. If the whole piece reads conversational,
  don't flag informality — adjust the bar to match the register.
- **Author voice vs. Mainmatter voice**: Marine, Paolo, Luca, Chris, Marco
  and others each have recognizable voices. Preserve them. Flag voice
  issues only when something works against the writer rather than for them.
- **Schema.org and SEO metadata**: these are user-facing (they appear in
  search snippets, knowledge panels, llms.txt), so review them as prose.
  But keep descriptions within the length constraints implied by the
  platform (meta descriptions ≤ 160 chars, titles ≤ 60 chars) — flag if a
  suggested rewrite exceeds the constraint.
- **Conflicting US/UK spelling in a codebase that already mixes**: if the
  rest of the repo is clearly one variant, recommend that one. Otherwise
  pick the most common variant in the current document and align to it.
- **Large PRs with many files**: if the PR has 20+ prose-containing files,
  ask the user which files to prioritize. Offer a quick "headlines only"
  pass as an alternative.

## Reference files

- `references/mainmatter-voice.md` — full voice guide with examples of what
  to reinforce and what to flag.
- `references/l2-english-patterns.md` — common L2 English patterns and
  translation smells with examples.
- `references/terminology.md` — canonical spellings of Mainmatter product
  names, service names, people names, and preferred terms.

Read these references when the inline guidance above isn't enough to decide
a specific case.
