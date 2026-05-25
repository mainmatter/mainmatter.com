# Mainmatter voice

The Mainmatter voice is **confident, technically grounded, approachable, and insightful**. It speaks credibly to developers who will scrutinize every technical claim, and to engineering leaders who need to understand the business case. Good Mainmatter writing earns trust with specifics, respects the reader's time, and avoids both marketing fluff and gratuitous jargon.

This guide captures the patterns observed in published Mainmatter content (case studies, blog posts, landing pages). Use it as a reference when reviewing content, not a rulebook — the author's personal voice matters too.

## What the Mainmatter voice sounds like

### 1. Confident, with evidence

Strong claims are paired with specifics a skeptical reader can verify:

> Key modules have already been ported and released to the public, validating the approach and demonstrating tangible benefits.

> Team led by Luca Palmieri, author of "Zero to Production in Rust".

Flag: claims that sound big but carry no evidence. "Industry-leading expertise" means nothing. "Organizers of EuroRust, Europe's Rust conference" means something.

### 2. Concrete, not abstract

Mainmatter writes about real systems, real engineers, real outcomes:

> We started by deconstructing the extensive C codebase of the query engine into modular components, prioritizing the less entangled "leaf" modules for early migration.

> A performance test implemented by Discourse inspired the build-start-rebuild-perf tool, which provides metrics about your application's build time.

Flag: abstract verbs with no object. "We help clients succeed" — at what? "We accelerate transformation" — which transformation?

### 3. Technical without walls of jargon

Technical terms are used precisely, and named without over-explaining to readers who know them:

> We setup a CI pipeline covering tests, linting, sanitizers (including Miri), and coverage tracking.

A developer reads this and trusts the writer. A manager reads it and gets the shape of the work without being drowned. When a term needs unpacking for non-specialists, the unpacking is short:

> context-engineering — the practice of providing AI the tools, context, and direction it needs to be efficient.

Flag: either extreme. Jargon walls that alienate managers, or over-explanation that patronizes developers.

### 4. Active voice, precise verbs

> We migrated the Redis Query Engine from C to Rust. Mainmatter embeds expert Rust engineers into client teams. The Ember Initiative allocates time to migrate addons to v2.

Flag: passive where active works. "Improvements were made to performance" → "We cut p95 latency by 4×". "Can be accelerated" → "accelerates".

### 5. Business outcome paired with technical reality

A strong Mainmatter sentence often names both sides:

> Incremental migration of C and C++ codebases to Rust, improving memory safety, reliability, and maintainability without disrupting day-to-day operations.

Technical content: incremental migration, memory safety. Business content: doesn't disrupt operations. Both.

Flag: content that lands only on one side. Pure marketing ("improves business outcomes") or pure technical ("migrates the AST parser to Rolldown") both miss the Mainmatter register when selling a service.

### 6. Direct invitations and acknowledgements

Mainmatter content addresses the reader directly and ends with a concrete next step:

> We're here to guide you through that transition as teammates, so you don't have to navigate it alone.

> If you're facing challenges with Ember.js and need a helping hand, reach out!

Flag: endings that trail off, or that pivot into generic CTAs unrelated to the post's argument.

### 7. Honest about trade-offs

Mainmatter writes about what's hard, not just what's good:

> It's not as simple as just getting everyone a Claude account and then expecting velocity to double overnight.

> Contributing to Embroider usually involves a steep learning curve — it's the kind of project that requires more than just a few hours and good intentions.

Flag: content that claims everything is easy, or that hides the real cost of a decision.

## What the Mainmatter voice avoids

### Empty marketing adjectives

Never reinforce, usually flag:

- "cutting-edge", "world-class", "best-in-class", "industry-leading", "state-of-the-art", "next-generation", "revolutionary", "game-changing", "premium" (as filler), "innovative" (as filler)
- "seamless", "robust", "scalable", "holistic", "end-to-end" — acceptable when the word is technically exact, lazy filler otherwise

If a sentence still says something when you delete the adjective, the adjective was filler.

### Business buzzwords

Flag: "synergize", "stakeholder alignment", "leverage synergies", "value proposition" (when used as filler), "mission-critical" (unless technically accurate), "transformation journey", "digital transformation" (as filler).

"Leverage" itself is borderline — Mainmatter content does use it occasionally when it means "make use of a specific advantage". Flag only when it's filler for "use".

### AI-slop phrases

Flag on sight:

- "It's not just X — it's Y"
- "Let's dive in" / "Let's unpack"
- "In today's fast-paced world"
- "Navigate the complexities of"
- "It's worth noting that"
- "Whether you're a X or a Y"
- "Unlock the potential of"
- "Elevate your workflow"
- "Gone are the days when..."
- "In an era of..."
- "A testament to..."
- Heavy reliance on the "not X, but Y" rhetorical frame
- Bullet-listing every idea instead of writing paragraphs that flow

### Filler words that weaken claims

Usually cut or flag:

- "very", "really", "quite", "rather", "somewhat", "fairly"
- "simply", "just" (unless used for contrast: "not just X, but Y")
- "basically", "essentially" (often filler)
- "In order to" → "To"
- "Due to the fact that" → "Because"
- "At this point in time" → "Now"
- "A large number of" → "Many"

### Overclaiming and overhedging

Both are weaknesses. Mainmatter voice is confident where it has evidence and honest where it doesn't:

- Overclaiming: "the only Rust consultancy that can..." → soften to "one of few", or name what specifically is unique.
- Overhedging: "we might possibly be able to help you potentially improve" → pick one verb and commit.

## Formatting conventions

- **Headings**: sentence case dominates blog posts; Title Case dominates product/landing pages. Flag mixes within one document.
- **Em dash**: `—` (U+2014), not `--`. Used for asides and emphasis. Mainmatter uses them liberally, which is fine.
- **Oxford comma**: preferred but not mandatory. Flag when absence creates ambiguity.
- **Curly vs. straight quotes**: Mainmatter content mostly uses curly quotes ("", ''). Don't force a rewrite, but flag if one document mixes.
- **Italics for emphasis**: yes, used for emphasis on relational words (_you_, _your_) or for book titles ("Zero to Production in Rust" — note this one is in quotes in Mainmatter copy).
- **Links**: embedded inline, not numbered endnotes. Descriptive link text, not "click here" or "this link".

## People and team

When introducing a Mainmatter team member in content, name both the role and a specific credential:

> Team led by Chris Manson, member of the Ember.js Framework Core Team. Team led by Luca Palmieri, author of "Zero to Production in Rust". Team led by Paolo Ricciuti, Svelte core team member, author of SvelteLab.

Flag: name-drops without context, or generic titles like "expert" without substantiation.

## Examples of voice corrections

### Example 1: marketing filler → concrete claim

Before:

> Mainmatter is a world-class engineering consultancy that delivers cutting-edge solutions to help clients unlock their potential.

After:

> Mainmatter is an engineering consultancy specializing in Rust, Ember.js, and Svelte. We help teams modernize codebases, migrate between technologies, and build production systems that scale.

### Example 2: passive → active

Before:

> Performance improvements were delivered through the migration.

After:

> The migration cut p95 query latency by 4× and reduced memory usage by 30%.

### Example 3: vague → specific evidence

Before:

> We have deep experience in the Rust ecosystem.

After:

> We organize EuroRust, maintain "100 Exercises to Learn Rust", and migrated the Redis Query Engine from C to Rust.

### Example 4: AI-slop frame → direct

Before:

> It's not just about writing code — it's about shaping the systems that turn ideas into products. Let's dive into how we do that.

After:

> Our work is about shaping the systems and processes that reliably turn ideas into running products. Here's how.

(Note: Mainmatter content does occasionally use the "not X but Y" frame — for example Marco's AI hype post — so this is a soft flag. If it appears once as a deliberate rhetorical beat, fine. If it appears three times in one post, flag at least two.)
