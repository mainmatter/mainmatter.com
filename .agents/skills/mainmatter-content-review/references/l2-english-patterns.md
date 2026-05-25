# L2 English patterns and translation smells

Mainmatter's team is international. Most content authors speak English as a
second language, typically with a strong technical vocabulary and occasional
transfer patterns from German, French, Italian, Spanish, or Russian. This
reference catalogues the patterns to scan for.

These are frequency-ordered (most common at the top). Not all are errors —
some are acceptable variants in international English. Flag the ones that
read as clearly non-native, and leave the ones that are defensible as
stylistic.

## Articles (the, a, an)

Article usage is the single most common L2 slip across native-German,
Slavic, and East Asian writers.

**Missing definite article**
- "We migrated Redis Query Engine from C to Rust" → "the Redis Query
  Engine".
- "Company behind Ember Initiative" → "the Ember Initiative".

**Extra definite article**
- "We work with the Svelte and the Rust" → "with Svelte and Rust".
- "The developers prefer the TypeScript" → "developers prefer TypeScript".

**Missing indefinite article**
- "Mainmatter is engineering consultancy" → "is an engineering
  consultancy".

**Overuse with abstract nouns**
- "The machine learning is everywhere" → "Machine learning is everywhere".

## Prepositions

Prepositions don't transfer cleanly between languages. Common errors:

| Wrong | Right |
|---|---|
| discuss about X | discuss X |
| depend of X | depend on X |
| consist in X | consist of X |
| suffer of X | suffer from X |
| in the internet | on the internet |
| in time (for deadlines) | on time |
| in the weekend | on the weekend (US) / at the weekend (UK) |
| different than | different from (or "different to" in UK) |
| married with X | married to X |
| responsible of X | responsible for X |
| since 3 years | for 3 years |
| capable to do X | capable of doing X |
| interested to do X | interested in doing X |

## Verb patterns (common L2 miss)

English verb patterns are quirky. L2 writers often produce grammatically
close-but-wrong constructions:

- "support them deliver" → "help them deliver" or "support them in
  delivering". ("Support" doesn't take bare infinitive.)
- "help to do X" vs. "help do X" — both acceptable. Don't flag.
- "allow to do X" (no object) → "allow us to do X" (object required).
- "let to do X" → "let us do X" (no "to" after "let").
- "make to do X" → "make us do X" (no "to" after "make" as causative).
- "suggest me to do X" → "suggest that I do X" / "suggest I do X".
- "explain me X" → "explain X to me".
- "discuss with X about Y" → "discuss Y with X".

## Word order

English adjective order and adverb placement rarely match other languages:

- "a red big ball" → "a big red ball" (opinion, size, age, shape, color,
  origin, material, purpose).
- "I often am doing X" → "I am often doing X" or "I often do X".
- "We have since long time worked with..." → "We have worked with ... for
  a long time".

## False friends

These land especially often from German, French, Italian, Spanish:

| Written | Probably meant | Source language |
|---|---|---|
| actually | currently / now | German "aktuell" |
| eventually | possibly / maybe | German "eventuell", FR "éventuellement" |
| sensible | sensitive | French/German "sensible" |
| sympathic / sympathetic | likeable | German/French/Italian |
| control (verb) | check / verify | French "contrôler", German "kontrollieren" |
| realize | carry out / implement | French/Italian "réaliser" |
| pretend | claim | French "prétendre" |
| assist at | attend | French "assister à" |
| demand | ask | French "demander" |
| deception | disappointment | French "déception" |
| library | bookshop | French "librairie" → "library" is often meant the other way |
| formation | training | French "formation" |
| memory (for computer RAM vs. recollection) | usually fine, but check context | |
| actuality | current events / news | |
| engagement | commitment / appointment | French "engagement" |

**Heads up:** when a word looks like a false friend but the sentence makes
sense under the native meaning, flag it gently and ask — don't assert.

## Translation calques

Literal word-for-word translations of native-language idioms:

- "in the last time" → "recently" (DE "in letzter Zeit")
- "since always" → "always" / "as long as I can remember" (FR "depuis toujours")
- "make a formation" → "do a training" / "take a course" (FR "faire une formation")
- "take a decision" → "make a decision" (FR "prendre une décision"; UK often accepts "take")
- "informations" (plural) → "information" (uncountable in EN; DE/FR both use plural)
- "a news" → "some news" / "a piece of news" (uncountable)
- "staffs" (plural of staff) → "staff" (collective)
- "advices" → "advice" (uncountable)
- "equipments" → "equipment" (uncountable)
- "feedbacks" → "feedback" (uncountable)
- "trainings" → usually "training" (uncountable). Mainmatter content does
  sometimes use "trainings" as count noun for individual training events,
  which is acceptable jargon but flag if mixed with the uncountable use.

## Count vs. uncountable nouns

Common uncountables that L2 writers pluralize:

- advice, information, feedback, equipment, research, progress, evidence,
  software, hardware, knowledge, homework, furniture, luggage

Acceptable count-noun use within tech jargon:
- "trainings" (individual training events)
- "softwares" — never acceptable, always flag

## Tense and aspect

- Present perfect vs. simple past. "I have worked on this yesterday" →
  "I worked on this yesterday". Present perfect doesn't combine with a
  specific past time.
- Will vs. going to. Both acceptable in international English; flag only
  if clearly wrong.
- Progressive with stative verbs. "I am knowing this" → "I know this".

## Punctuation transfer

- **German**: comma before every subordinate clause ("We decided, that we
  would migrate"). Remove the comma before "that".
- **French**: spaces before `?`, `!`, `:`, `;`. Remove the spaces in English.
- **Spanish/Italian/German**: double punctuation (`?!`, `!!`). Flag in
  published content; acceptable in social posts if deliberate.
- **German**: quotes as „X" or "X" → use straight or curly English quotes.
- **French**: `«guillemets»` → curly or straight English quotes.

## Capitalization

- Days of week, months, nationalities — capitalized in English. L2 writers
  from Romance languages often leave them lowercase.
- Job titles — capitalize only when part of a specific name (President Smith)
  or a formal title directly preceding a name.
- After a colon: lowercase in English unless a proper noun or a full
  quotation follows.

## Phrase-level smells

- "As well" at the start of a sentence → usually "Also" or restructure.
  "As well" at sentence-end is fine.
- "Permit me to..." → "Let me..." / "May I...".
- "I am writing you" → "I am writing to you".
- "Thanks you" → "Thank you".
- "Waiting for your news" → "Looking forward to hearing from you".
- "Please find attached" — fine in formal email, stiff in marketing copy.

## When not to flag

- **International English variants**: "whilst" (UK) vs. "while" (US) — both
  fine. "amongst" vs. "among" — both fine. "spelt" vs. "spelled" — both
  fine.
- **Mild formality**: L2 writers sometimes sound slightly more formal than
  native speakers. This is often a feature, not a bug, in B2B content.
- **Oxford comma**: consistent use of either style is fine.
- **Technical shorthand**: "stood up a service", "spun up a cluster" — these
  are domain-correct even if they sound odd.

## How to flag in the review

For L2 patterns, the explanation should be specific:

Good:
> "support them deliver" is ungrammatical. "Support" doesn't take a bare
> infinitive. Use "help them deliver" or "support them in delivering".

Not:
> This sounds non-native.

The author is likely to want to understand the rule so they avoid the same
mistake next time. A one-line explanation is the right length — not a grammar
lecture.
