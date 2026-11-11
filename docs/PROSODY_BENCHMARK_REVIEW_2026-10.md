# Likho Prosody Benchmark Review Instructions — October 2026

**Purpose:** Independent annotation of ten source-exact Ghalib lines to test the annotation schema and review protocol. This is an **internal pilot** with known selection bias; it cannot support accuracy, recall or precision claims.

**Important non-claims:**
- No item is a gold answer. Every `goldStatus` is `pilot-unadjudicated`.
- No form is benchmark-supported. Every `target.supported` is `false`.
- The items were selected *because* the engine accepted them (distance 0). That selection bias is known and must be reported with any result; it cannot support a claim that Likho handles the form generally.
- Independent human annotation is required before any production benchmark claims can be made. The protocol requires at least two qualified annotators and one adjudicator; none have yet participated in this pilot.

## 1. Your role and independence conditions

You are one of **two annotators** working independently on the same ten items. Neither annotator may see the other's worksheet until both have submitted. You are also an **independent adjudicator** will review both worksheets later, but that step comes after your submission.

To be independent you must satisfy all of the following:

- You are qualified to analyse Urdu prosody (you have training or recognized expertise in Urdu metre and `ilm al-arooz`).
- You have **not** seen the engine's metre assignment, target pattern, scansion, word readings or acceptance classification for any item before you start.
- You have **not** seen the other annotator's worksheet or any prior benchmark result for these items.
- You have no undisclosed financial or authorship interest in the outcome.
- You are not the engine author or the person who prepared the original pilot.

If any of those conditions do not hold, you are not independent for this item. Mark your reviewer slot accordingly.

## 2. What you will receive

| Artifact | Contents | Forbidden |
| --- | --- | --- |
| Your packet JSON (`reviewer-a.json` or `reviewer-b.json`) | 10 items with exact source lines, pinned source metadata, and a blank `response` block. Do **not** open the benchmark file, the freeze, or the other reviewer's packet. | Engine metre, target pattern, distance, actual pattern, readings, uncertainty codes, admissibleAnalysisIds, goldStatus, supported flag. |
| Your printable copy (`reviewer-a.md` or `reviewer-b.md`) | Same items rendered for manual notes. Same forbiddens apply. | Same as above. |
| Review protocol (`docs/PROSODY_BENCHMARK_PROTOCOL.md`) | Full annotation/review process, uncertainty codes, adjudication rules, metrics, versioning and change control. | Do not treat this as a substitute for independent judgement; it is a process guide. |
| Review instructions (this file) | The present document. | Do not use it to infer engine results or prior annotations. |

**Do not** under any circumstances look at:

- `data/benchmarks/prosody/pilot-2026-10/benchmark.json` — it contains engine assignments, distances, actual patterns and acceptance classifications.
- `data/benchmarks/prosody/pilot-2026-10/freeze.json` — it seals the benchmark and must not be edited during review.
- The other reviewer's packet or worksheet.
- Any prior benchmark result, engine output, or cached scansion for these lines.

If you accidentally see engine output, stop and report it to the project owner before continuing.

## 3. Annotation procedure

For each of the ten items, do the following in order:

### 3.1 Source verification

1. Read the item text that is given to you.
2. Verify the text against the pinned source revision. The packet's `source.url` and `source.revisionId` point to a specific Urdu Wikisource page revision. Fetch that page (action=raw) and confirm the line appears exactly as given. Record any discrepancy in your `notes` field, but proceed with the text as presented if you cannot resolve it.
3. The source text is preserved exactly, including punctuation and omitted diacritics. Do not silently normalize or "correct" the line.

### 3.2 Determine the metre

1. Using only the source text and your own knowledge of Urdu prosody, determine the metre (if any) you can defend.
2. Record the metre `id` and `nameUrdu` / `nameEnglish` in the `response.metre` block. If you cannot determine a supported metre, record `id: null` and explain why in `notes`.
3. Do **not** consult the engine's metre assignment or target pattern at any point.

### 3.3 Record word readings

1. For each word in the line, determine the pronunciation and scansion pattern you can defend from your own knowledge and from attested lexical sources.
2. Record up to **one primary reading** per word in the `response.wordReadings` array. Each reading must have:
   - `token`: the exact word token as it appears in the source text (preserving case and spelling).
   - `pattern`: the scansion pattern for that word, using only `-` (short) and `=` (long).
   - `rule`: the licensed rule or rules that justify this reading (e.g. `izafat-yeh`, `monosyllable-flexibility`, `nasalization`, `caesura`, `initial-short`, `terminal-short`). If a word has no attested reading, record `rule: ['unsupported-vocabulary']` and explain in `notes`.
   - `note`: any ambiguity or uncertainty about this reading.
3. You may record **alternative readings** if you believe another pattern is also defensible, but the primary reading is what will be compared in adjudication. For alternatives, use the same field structure (`token`, `pattern`, `rule`, `note`).
4. The total of all `wordReadings` across all ten items should be consistent with the metre you have chosen. If the concatenated patterns do not build the metre's target pattern, note that in `notes`.

### 3.4 Record your verdict

For each item, record exactly one of the following in `response.verdict`:

- `admissible` — the line scans cleanly for the metre you have selected, all word readings are attested, and no unresolved ambiguity remains that would block a defence.
- `invalid-against-target` — the line does not scan for the declared target metre, and you can identify the metrical defect.
- `invalid-against-all-supported-meters` — the line does not scan for any supported metre.
- `unresolved` — you cannot reach a defensible analysis, and uncertainty codes are recorded (at least one code other than `none`).
- `out-of-scope` — the line is not a natural Urdu verse, is constructed, or falls outside the advertised forms.

If you record `unresolved` or `out-of-scope`, you **must** record at least one uncertainty code from the permitted list (see §5) and a note explaining what is unresolved.

### 3.5 Record uncertainty codes and notes

For each item, record `response.uncertaintyCodes` as an array of one or more codes from the following permitted list. If no uncertainty applies, use `['none']` (the code `none` must appear alone — never combined with another code).

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

Record `response.uncertaintyNote` as a short free-text explanation of **what** is uncertain and **why**, referencing the code(s) you have chosen.

### 3.6 Record elapsed minutes

Record `response.minutes` as a **whole number** of minutes spent on that item, including source verification, metre determination, word-reading collection, verdict selection and write-up. Exclude breaks (time away from the task). If you took more than 60 minutes, record the exact number; do not round down.

### 3.7 Sign and date

Record `response.decidedAt` as an ISO date (`YYYY-MM-DD`) — today's date. Record `response.reviewerSignature` as your name or chosen signifier. If you are working under a team code, record that instead of a personal name, but do not leave it blank.

## 4. Submission

When you have completed all ten items:

1. **Check your packet** — ensure no field you were told to leave blank is blank where it should not be, and that every `response.wordReadings` entry has `token`, `pattern` and `rule`.
2. **Save your work** — the JSON file must remain at its original path; do not rename or move it.
3. **Email the packet** to the project owner at the address they have provided, or upload it to the shared directory they specify. The subject line must include your reviewer slot (`reviewer-a` or `reviewer-b`) and the text `Likho Prosody Benchmark Packet`.
4. **Do not** send the other reviewer's packet, any engine output, or any discussion of your decisions until **both** packets have been submitted.

## 5. After both packets are submitted

Once the project owner has confirmed receipt of both reviewer packets:

1. The adjudication phase begins. An independent adjudicator (not either annotator) will review both worksheets, check the pinned source revisions, and resolve any disagreements.
2. The adjudicator will record a final `status` (`agreed`/`resolved`/`disputed`), a `selectedAnalysisId`, a `rationale`, and a `decidedAt` date.
3. You will be notified of the adjudication outcome but will not have access to the other annotator's detailed worksheets until the full report is published.

## 6. Known selection bias (must be reported)

These ten items were **not** a random sample. They were selected *because* the engine already accepted them (all at `distance: 0`). That bias is known and must be mentioned in any report that cites these results. It does **not** invalidate the annotation process, but it does mean:

- No accuracy, recall or precision claim can be derived from these ten items alone.
- The next evaluation batch must be selected independently of engine results.
- If you observe that every item `textSha256` matches the source exactly and every metre is one the engine already accepts, that is expected given how the pilot was assembled.

## 7. Questions or difficulties

If any of the following occur, stop and contact the project owner before continuing:

- You see engine output, prior benchmark results, or the other annotator's worksheet before submitting your own.
- A word or metre decision cannot be defended with attested rules; record it as `unresolved` with the appropriate uncertainty code and a clear note.
- The source text cannot be verified against the pinned Wikisource revision; record the discrepancy in `notes` and proceed with the text as given, flagging the issue.
- You experience a time investment far outside the expected range (10–30 minutes per item is typical for this material); record the actual minutes and note the deviation.

## 8. Contact and deliverables

After you have submitted your packet, the project owner will:

- Confirm receipt.
- Engage the second annotator (if not already done) and the independent adjudicator.
- When both packets and the adjudication are complete, produce a revision note for the schema/protocol based on observed ambiguities and any new edge cases.
- Publish a report (with all identifying information redacted) that describes the observed inter-annotator agreement, adjudication outcomes, unresolved questions, and the next steps for corpus expansion.

You will not be asked to validate, score or grade any item. Your role is to **record** your defence of each line as fairly and independently as possible, under the conditions described here.

---

**Document history:**

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-10-29 | First release for the internal-pilot review exercise. |