# Likho prosody benchmark and annotation protocol

Status: **version 0.1.0, draft exercised by an internal ten-item pilot.** Independent annotation, adjudication and effort measurement have not occurred. This document defines a proposed process; it is not evidence that the process is stable or that Likho's scansion is accurate.

Related artifacts:

- `data/benchmarks/prosody/schema/benchmark.schema.json` — structural schema, version 1.0.0.
- `data/benchmarks/prosody/pilot-2026-10/benchmark.json` — ten-item internal pilot.
- `scripts/validate-benchmark.mjs` — semantic validator and on-disk pin checks.
- `tests/benchmark.test.mjs` — validator regression tests.
- `docs/PROSODY_BENCHMARK_PILOT_2026-10.md` — observed pilot results and limitations.

## 1. Purpose and non-claims

The benchmark exists to answer four separate questions with evidence:

1. When the engine accepts a line for a declared form, is that analysis admissible?
2. When it rejects or cannot resolve a line, is the line actually invalid, ambiguous, or out of scope?
3. Which forms, poets, features and failure families are covered, and which are only provisional?
4. Do changes improve frozen evidence rather than only newly written examples?

The benchmark is not a marketing accuracy figure. A positive item is not proof that the engine handles the form generally. A pilot is not a gold corpus. A benchmark score is not a claim of scholarly correctness unless qualified reviewers produced and adjudicated the items under this protocol.

No natural line may be marked correct merely because the engine recognises a complete verse string. Correctness is always relative to an independently adjudicated analysis.

## 2. Roles and independence

| Role | Responsibility | Independence requirement |
| --- | --- | --- |
| Corpus steward | Selects sources, verifies rights and revisions, maintains schema and versions, runs the evaluator | Must not edit an annotator's readings before adjudication |
| Annotator A | Independently records metre, all admissible analyses, word readings, rules and uncertainty | Blind to engine output and to Annotator B |
| Annotator B | Same task as A, independently | Blind to engine output and to Annotator A |
| Adjudicator | Resolves disagreements or marks an item disputed | Qualified in Urdu prosody; not one of the two annotators for that item |
| Engineering owner | Implements the runner, pins versions, publishes reports | Does not convert an internal check into independent evidence |

An annotator is independent only when all of the following hold:

- The person is qualified to analyse Urdu prosody and is not the engine author.
- The person has not seen the engine's output, suggested readings or prior benchmark result for that item.
- The person records a decision before seeing the other annotator's worksheet.
- The person has no undisclosed financial or authorship interest in the result.

The internal pilot does not meet these conditions. It was prepared by one internal process with engine output visible. It must be labelled `engine-assisted-internal` everywhere it is cited.

## 3. Item model

Each item has a stable identifier of the form `LKH-PRO-NNNN`. Identifiers are never reused, including after an item is retired. A benchmark file is versioned as a whole.

The schema records:

- **Exact text**: the source-exact line, NFC-normalised, with source punctuation preserved. No silent diacritic insertion or deletion.
- **Source and rights**: title, author, death year, publication year, stable revision URL, revision ID, retrieval date, rights status, rights basis and licence.
- **Provenance**: poem identifier, poem title, split, verse-line index, couplet index, half and text status.
- **Target**: metre identifier, names, family, target pattern and whether the form is benchmark-supported.
- **Expectation**: classification (`admissible`, `invalid-against-target`, `invalid-against-all-supported-meters`, `unresolved`, `out-of-scope`) and gold status.
- **Analyses**: every admissible complete analysis, plus rejected or disputed analyses where useful. Each analysis records its metre, target and actual scansion patterns, distance, documented meter variants and word readings.
- **Word readings**: exact token span, normalized token, pronunciation if attested, scansion pattern, licensed contextual rules, source IDs, source class and alternative licensed readings.
- **Uncertainty**: codes and a note explaining what is unresolved.
- **Reviewer decisions and adjudication**: who decided what, when, on which analysis, and why.

The current engine exposes an aggregate scansion pattern per word, not independently segmented syllable text and shape. The pilot therefore records `readingPattern` and alternative patterns rather than inventing syllable boundaries. A corpus-scale decision on syllable-level export is still open (see §12).

## 4. Source, provenance and rights

1. Prefer public-domain classical text with a stable, verifiable transcription.
2. For Wikisource, pin the page revision with `oldid` and record the retrieval date. A page title without a revision is not a provenance record.
3. Verify the exact line against the pinned revision before annotation. If the line is changed, create a new item version; do not silently replace the text.
4. Record the edition, volume and page when the source is a printed edition. A scan or transcription without a locator is insufficient for a gold item.
5. Contemporary writing requires documented consent from the rights holder. Record the consent record identifier. Do not ingest private drafts, unpublished poems or user text without explicit permission.
6. Constructed, unfinished or deliberately invalid examples are labelled as such. They must not be presented as natural source lines.
7. Preserve source spelling, punctuation and visible formatting. If the benchmark must use a normalized analysis form, keep the source form in `text`, set `textStatus` to `source-normalized`, and record the transformation.
8. Rights status is recorded even when the text is public domain. A public-domain item still carries the transcription's licence and attribution.

## 5. Corpus composition and splits

The planned base corpus is 1,200 items: 600 development, 400 locked evaluation and 200 challenge items. These are target item counts, not a claim that all forms will be ready at first release.

The initial evidence set should include:

- 100 independently annotated natural lines;
- 100 reviewed invalid variants;
- 25 repair tasks;
- multiple poets and multiple metre families;
- rubai and other advertised forms;
- long and short words, ambiguous vowels, hamza, madda, shadda, aspiration, nasalization, izafat, conjunction, liaison and caesura boundaries;
- Unicode-equivalent spellings, punctuation, invisible formatting, repeated words, unsupported scripts and unknown vocabulary;
- classical public-domain writing, consenting contemporary writing, and separately labelled constructed or unfinished examples.

At least ten adjudicated positive examples are required before a form is marked `supported: true`. Low-frequency forms remain provisional. Ten examples establish a form's presence in the benchmark, not its population accuracy.

Split rules:

- Keep an entire poem in one split. A poem must never appear in both development and locked evaluation.
- Deduplicate spelling variants and closely related lines across splits.
- Hold out contemporary examples and known failure families from development.
- Related mutations are clustered evidence, not independent trials. Report unique source lines and cluster-aware uncertainty.
- The pilot split is for tooling and protocol exercise only. It is not a development or evaluation split.

## 6. Annotation procedure

### 6.1 Before annotation

The steward supplies only:

- the exact text;
- the source record and revision;
- the declared target form, if the item is a target-specific positive or invalid item;
- the item category and any constructed/unfinished label;
- the uncertainty code list.

The steward does not supply engine output, engine suggestions, prior benchmark results or the other annotator's worksheet.

### 6.2 First pass

For each item, the annotator:

1. Verifies the text against the source revision.
2. Determines whether the line is complete, unfinished, constructed or out of scope.
3. Determines the metre, or records that no supported metre applies.
4. Records every admissible complete analysis, not only the first one found.
5. Records word-level readings and the contextual rules that license them.
6. Records alternatives that change the scansion.
7. Assigns uncertainty codes and explains unresolved questions.
8. Records start and end time for the item.
9. Signs and dates the decision.

If the annotator cannot reach a defensible analysis, the item is `unresolved` or `out-of-scope`; it is not forced into a metre.

### 6.3 Second pass and comparison

A second annotator repeats the process independently. Only after both worksheets are submitted may the steward run the engine and compare:

- source text and provenance;
- metre and target pattern;
- complete analyses;
- word readings and rules;
- uncertainty and classification.

The engine result is evidence to investigate, not an automatic tie-breaker.

### 6.4 Time measurement

Record elapsed minutes per item, including source verification, scansion, rule lookup and write-up. Exclude breaks. Report the median and range, not only a total. The internal pilot did not measure human minutes and must not be used to estimate reviewer capacity.

## 7. Uncertainty codes

| Code | Use when |
| --- | --- |
| `none` | No unresolved ambiguity remains. Must appear alone. |
| `word-boundary` | The reading depends on how adjacent words are joined or separated. |
| `izafat` | An izafat mark, or its absence, changes the reading. |
| `hamza` | A hamza-bearing form affects the syllable or weight. |
| `shadda` | A shadda affects the consonant length or weight. |
| `nasalization` | A noon ghunna or nasalized vowel affects the reading. |
| `aspiration` | An aspirated consonant affects the onset or weight. |
| `consonant-cluster` | A cluster is metrically ambiguous or requires a lexical reading. |
| `terminal-pause` | The line ending is read with a pause or terminal shortening. |
| `caesura` | The mid-line boundary permits a documented caesura variant. |
| `meter-variant` | A named variant such as initial-short, caesura-short or terminal-short is used. |
| `meter-ambiguity` | More than one supported metre or analysis is admissible. |
| `source-orthography` | The source spelling differs from the usual or normalized form. |
| `punctuation` | Source punctuation affects tokenization or line boundaries. |
| `unsupported-vocabulary` | A word lacks attested pronunciation evidence. |
| `script-variant` | Unicode, script or character-form variation affects the text. |
| `other` | A specific uncertainty not covered above; explain in the note. |

An `unresolved` item needs at least one specific code other than `none`. A `disputed` item needs a rationale in adjudication, not only an uncertainty code.

## 8. Adjudication

Disagreements may concern text, provenance, metre, target pattern, word reading, licensed rule, classification or uncertainty. The adjudicator:

1. Reviews both worksheets without seeing engine output first.
2. Checks the pinned source revision.
3. Consults the cited references and, where necessary, a further qualified reviewer.
4. Selects an admissible analysis, requests a correction, or marks the item `disputed`.
5. Records the selected analysis, rationale, date and any residual uncertainty.

Rules:

- Unresolved disagreements are not forced into a gold answer.
- A disputed item remains visible but is excluded from the main accuracy numerator and denominator; report it separately.
- Majority vote alone is not adjudication. Evidence and source authority decide.
- New evidence reopens the item; the prior decision is retained in the change history.
- An adjudicator may not adjudicate an item they annotated.

## 9. Metrics and reporting

A runner must report, at minimum:

- correct, incorrect and unresolved counts;
- coverage by metre family, poet, source and feature;
- false positives for `invalid-against-target` items;
- false positives for `invalid-against-all-supported-meters` items;
- supported-form versus out-of-scope results;
- per-family and per-metre results;
- unique source lines and cluster-aware uncertainty;
- the exact benchmark, engine, lexicon, meter-table and protocol versions.

A positive item is correct only when the engine selects an analysis that the benchmark records as admissible, including word-level readings and rules. Selecting a different admissible analysis is correct if that analysis is in the adjudicated set. Selecting a merely complete verse string is not correct.

An invalid-against-target item is a false positive if the engine accepts the target analysis. An invalid-against-all item is a false positive if the engine accepts any supported metre.

A zero-error pilot does not prove a low population error rate. For a predeclared one-sided 95% exact binomial gate, zero false acceptances among 299 independent invalid cases gives an upper bound below 1%; use at least 300 operationally. A two-sided 95% interval needs at least 368 zero-error cases. At 0/100 the upper bounds are approximately 2.95% one-sided and 3.62% two-sided. If errors occur, calculate the actual bound; 1/100 is not a passing result. Related mutations are not automatically independent trials.

Reports must state limitations, including missing reviewers, unresolved items, cluster dependence and any known expected failures. Expected failures remain annotated; they are not removed to improve a score and are not acceptance.

## 10. Pilot exit criteria

The internal pilot is complete for schema mechanics when:

- the schema parses and the pilot file passes the semantic validator;
- the validator regression suite passes;
- every item has a stable ID, exact text, pinned source revision, rights record, target, analysis, readings, uncertainty and adjudication state;
- source text and engine pins are recorded;
- observed ambiguities and protocol changes are documented;
- no item claims independent review or frozen gold.

The protocol is not stable for corpus production until:

- at least two qualified independent annotators and an adjudicator are available;
- the ten items are annotated blind and adjudicated;
- human minutes per item are measured and reviewer capacity is scheduled from that measurement;
- open questions in §12 are decided;
- invalid variants, rubai and at least one non-Ghalib poet are exercised in a revised pilot;
- the schema and protocol versions are updated with a migration note.

## 11. Versioning and change control

- `schemaVersion` identifies the JSON structure. Structural changes require a new schema version and a migration note.
- Benchmark files use semantic versions. Frozen files are immutable; corrections create a new version rather than editing the old one.
- Protocol versions are independent of benchmark versions. Reports must cite both.
- Engine pins record the application commit, dirty-tree flag, runtime lexicon hash, upstream lexicon source hash, meter-table hash and a canonical digest of the scansion source files.
- A report is valid only for the exact pins it lists. A changed working tree invalidates an otherwise matching commit claim.
- Never silently replace a disputed reading, source text, target pattern or reviewer decision. Record the change and its rationale.
- Expected-failure annotations may only be removed when the underlying defect is genuinely fixed and reverified. Do not relabel a failure as acceptance.

The source-digest algorithm is SHA-256 over the bytewise path-sorted entries `path + NUL + sha256 + LF`, concatenated. The digest and every per-file hash are checked by `scripts/validate-benchmark.mjs` when a root directory is supplied.

## 12. Open questions and pilot observations

These are observed from the ten-item internal pilot, not hypothetical concerns:

1. **Source orthography versus normalized analysis.** The Wikisource line `یہ نہ تھی ہماری قسمت کہ وصال یار ہوتا` omits the izafat mark on `وصال`. The source-exact form scans at distance 0, so the pilot preserves it and records `source-orthography`. Annotators need an explicit rule for when an absent mark is decisive versus merely orthographic.
2. **Punctuation.** `دل ہی تو ہے نہ سنگ و خشت، درد سے بھر نہ آئے کیوں؟` keeps a comma and question mark. Token spans skip punctuation. The future runner must tokenize without mutating the stored `text`.
3. **Syllable export.** The scan API gives a word-level pattern such as `=-=` but not independently segmented syllable text and shape. The pilot records patterns and alternatives. Corpus annotation should not invent segmentation that the engine cannot substantiate; either extend the export or add a separate reviewed syllable field.
4. **Meter variants.** `caesura-short`, `initial-short` and `terminal-short` are documented variants. The pilot records them in `meterNotes`. Adjudicators must confirm that a variant is admissible for the poem, not merely generated by the engine.
5. **Alternative readings.** The engine exposes licensed word alternatives. The pilot records them, but they are not an exhaustive annotation and must not substitute for independent reading collection.
6. **Support threshold.** All pilot forms are `supported: false` because no form has ten adjudicated gold examples. Do not infer support from the pilot.
7. **Invalid items.** The pilot contains no invalid-against-target or invalid-against-all items, so those validator paths are tested by synthetic mutations rather than real adjudication.
8. **Rubai.** No rubai item is present. The protocol's rubric still needs a real rubai pilot.
9. **Effort.** Human minutes per item are unmeasured. The pilot cannot support reviewer scheduling.
10. **Independence.** No independent reviewer or adjudicator has participated. The pilot cannot support accuracy or gold claims.

## 13. Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-10-29 | Initial schema and protocol draft, exercised by the ten-item internal pilot. Independent review pending. |
