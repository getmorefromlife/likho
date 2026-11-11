# Prosody benchmark pilot, October 2026

**Artifact:** `data/benchmarks/prosody/pilot-2026-10/benchmark.json`
**Benchmark id:** `lkh-prosody-pilot-2026-10`, version `0.1.0`
**Status:** `internal-pilot`
**Schema:** `data/benchmarks/prosody/schema/benchmark.schema.json`, version `1.0.0`
**Protocol:** `docs/PROSODY_BENCHMARK_PROTOCOL.md`, version `0.1.0`
**Date:** 2026-10-29

This report records what was observed while exercising the schema and annotation protocol on ten items. It is not an accuracy report and not a gold corpus.

## 1. What this pilot is and is not

This is an **engine-assisted internal pilot**. One internal process selected the lines, read engine output, and prepared the annotations. No independent annotator, qualified prosody reviewer or adjudicator participated. Every item is `goldStatus: pilot-unadjudicated`, every review decision is marked as an internal consistency check, and every form is `supported: false`.

Therefore this pilot can establish that:

- the schema accepts and rejects the structures it was designed for;
- the semantic validator and its regression suite run;
- source revisions and engine pins can be recorded and re-checked against disk;
- ten real Ghalib lines can be represented with metre, target pattern and word readings.

It cannot establish that:

- Likho's scansion is accurate;
- any form is benchmark-supported;
- annotation is stable under independent reviewers;
- the protocol is ready for a 1,200-item corpus;
- any reviewer capacity or cost figure.

No item is a gold answer. No score should be computed from this file.

## 2. Selection method

Candidate lines were drawn from public-domain Ghalib ghazals on Urdu Wikisource. For this pilot, lines were retained only when the engine reported:

- a complete scansion;
- `distance === 0` against the selected documented meter or a documented meter variant;
- no unresolved words.

This is a deliberately clean, positive-only sample. It is a tooling sample, not a representative sample of Ghalib, of Urdu poetry, or of the engine's failure modes. Because clean lines were selected using engine output, the sample is biased toward what the engine already accepts. It cannot support a recall or precision estimate.

Source text is preserved exactly as transcribed, including punctuation and omitted diacritics. No normalization was silently applied. Text was checked for NFC normalization before inclusion.

## 3. Items

| ID | Text | Meter | Target pattern | Notes | Uncertainties | Readings (alts) | Wikisource oldid |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LKH-PRO-0001 | نقش فریادی ہے کس کی شوخیِ تحریر کا | `ramal-musamman-mahzoof` | `=-===-===-===-=` | — | izafat | 8 (6) | 10301 |
| LKH-PRO-0002 | کاغذی ہے پیرہن ہر پیکرِ تصویر کا | `ramal-musamman-mahzoof` | `=-===-===-===-=` | — | izafat | 7 (4) | 10301 |
| LKH-PRO-0003 | جذبۂ بے اختیارِ شوق دیکھا چاہیے | `ramal-musamman-mahzoof` | `=-===-===-===-=` | — | izafat, hamza | 6 (4) | 10301 |
| LKH-PRO-0004 | سینۂ شمشیر سے باہر ہے دم شمشیر کا | `ramal-musamman-mahzoof` | `=-===-===-===-=` | — | izafat, hamza | 8 (4) | 10301 |
| LKH-PRO-0005 | ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے | `hazaj-musamman-salim` | `-===-===-===-===` | — | nasalization | 9 (2) | 10421 |
| LKH-PRO-0006 | بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے | `hazaj-musamman-salim` | `-===-===-===-===` | — | none | 9 (4) | 10421 |
| LKH-PRO-0007 | دل ہی تو ہے نہ سنگ و خشت، درد سے بھر نہ آئے کیوں؟ | `rajaz-musamman-matwi-makhboon` | `=--=-=-=-=--=-=-=` | `caesura-short` | word-boundary, caesura | 14 (6) | 10491 |
| LKH-PRO-0008 | یہ نہ تھی ہماری قسمت کہ وصال یار ہوتا | `ramal-musamman-mashkool` | `--=-=-==--=-=-==` | — | word-boundary, source-orthography | 9 (4) | 8985 |
| LKH-PRO-0009 | دلِ ناداں تجھے ہوا کیا ہے؟ | `khafeef-musaddas-variant` | `--==-=-===` | `initial-short` | izafat, nasalization, meter-variant | 6 (5) | 10487 |
| LKH-PRO-0010 | ہم کو معلوم ہے جنت کی حقیقت لیکن | `ramal-musamman-makhboon-maqtoo` | `=-==--==--====` | — | none | 8 (4) | 10403 |

All ten analyses are `admissible` with `distance: 0`; the actual pattern equals the target pattern in every item. Six distinct meters are represented across four families (ramal, hazaj, rajaz, khafeef). All ten items come from one poet.

The pilot contains no:

- rubai or other non-ghazal forms;
- `invalid-against-target` or `invalid-against-all-supported-meters` items;
- repair tasks;
- submitted-but-rejected or unresolved real lines;
- contemporary writing or consented material;
- non-Ghalib poets;
- deliberately constructed or unfinished lines.

Those protocol paths are exercised only by synthetic mutations in `tests/benchmark.test.mjs`, not by real adjudication.

## 4. Engine and source pins

Recorded in `benchmark.engine` and re-checked from disk by `scripts/validate-benchmark.mjs`:

| Pin | Value |
| --- | --- |
| App commit | `5ae5519` |
| Working tree dirty | `true` |
| Lexicon source | `sayedzeeshan/Aruuz` |
| Lexicon revision | `058fcd6010fb0ef030f79b10466c43aa20b0d4b9` |
| Lexicon runtime file SHA-256 | `937765161e60f1efb8fb9c0bfe56568825c0dd19f61d399b30e9746d5fd9188a` |
| Lexicon upstream source SHA-256 | `fce73b822453c412ed79a3071486341ffb38e61d9a1d4bb689ede245d9f2d9f8` |
| Lexicon license | GPL-2.0 |
| Lexicon words | 40,434 |
| Meter-table SHA-256 | `7772929bb120fb8894cad48ada07cc3eec3e9d68852e0d7199ba3b9e3cb1f9f0` |
| Scansion source digest | `d5d8d7635719651159bd66ba828c46914cb4eae3710e07098f349e5096993f5c` |

The digest covers `src/data/prosodyMeters.ts`, `src/services/aroozEngine.ts`, `src/services/meterRepairEngine.ts`, `src/services/prosodicReadings.ts` and `src/services/urduPhonology.ts`, hashed as path-sorted `path + NUL + sha256 + LF` entries. Because the working tree is dirty, these pins identify this exact tree, not a released commit. The validator fails if any pinned hash no longer matches disk.

Source revisions are pinned per item (six distinct revisions across the ten items). Each item records the exact `oldid`, a retrieval date of 2026-10-29, an author death year of 1869, publication year 1841, public-domain rights status, rights basis and licence.

## 5. Observed validation

Run on 2026-10-29 against the working tree described above:

| Command | Observed result |
| --- | --- |
| `npm run validate:benchmark` | `Benchmark valid` — 10 items, 10 analyses, 84 readings, 6 source revisions, classifications `{"admissible":10}`, 0 warnings |
| `npm run test:benchmark` | **40/40 passed** |
| `npm run test:prosody` | 66 checks passed |
| `npm run test:storage` | 14 checks passed |
| `npm run build` | TypeScript and Vite production build passed |
| `npm run test:e2e` | 19/19 passed |

These runs confirm that the pilot parses, that pins match disk and that the validator rejects the mutations covered by the regression suite. They do not confirm the readings.

## 6. Observed protocol ambiguities

The pilot surfaced the following issues. Each is carried into §12 of the protocol as an open question.

1. **Source orthography versus normalized analysis.** The Wikisource line `یہ نہ تھی ہماری قسمت کہ وصال یار ہوتا` omits the izafat mark on `وصال`. The source-exact form scans at distance 0, so the item preserves the source and records `source-orthography`. The protocol does not yet say when an absent mark is decisive versus merely orthographic. Annotators would need a rule before this becomes a gold item.
2. **Punctuation and tokenization.** `دل ہی تو ہے نہ سنگ و خشت، درد سے بھر نہ آئے کیوں؟` keeps a comma and question mark. Reading spans skip punctuation. The stored `text` must not be mutated by the runner; a future runner needs to tokenize around punctuation without rewriting the source.
3. **Syllable export.** The engine exposes an aggregate pattern per word (for example `=-=`), not independently segmented syllable text and shape. The pilot therefore records `readingPattern` and licensed alternatives rather than inventing syllable boundaries. Whether corpus items should carry a reviewed syllable field, or whether the engine should export one, is unresolved.
4. **Meter variants.** `caesura-short` (item 7) and `initial-short` (item 9) are documented variants generated by the meter table. The pilot records them in `meterNotes`, but an adjudicator must still confirm that the variant is admissible for the poem, not merely generated. The validator can check that a pattern is a documented variant; it cannot check poetic admissibility.
5. **Alternative readings.** The engine supplies licensed alternatives (43 across the pilot). They are recorded but are not an exhaustive annotation and cannot substitute for independent reading collection.
6. **Duplicates and near-duplicates.** Item 7 contains the conjunction `و`; item 8 preserves an unmarked izafat. Both are legitimate source-exact forms, but the protocol's dedup rule needs a precise definition of "closely related line" before split assignment.
7. **Form coverage.** Four families and six meters are present, but only as positives. The protocol's negative, rubai, repair and contemporary paths remain untested by real items.

## 7. Exit-criteria status

Protocol §10 lists two states. Against the first (schema mechanics), the pilot satisfies every listed condition: the file validates, the regression suite passes, every item has the required fields, pins are recorded, ambiguities are documented, and no item claims independent review or gold.

Against the second (protocol stable for corpus production), the pilot satisfies **none** of the human-dependent conditions:

- no independent annotators or adjudicator;
- no blind annotation or adjudication of these ten items;
- no measured minutes per item;
- open questions in protocol §12 undecided;
- no invalid, rubai or non-Ghalib items;
- no versioned revision from a prior protocol version.

The protocol is therefore **not stable for corpus production**. Starting the first 100-line corpus now would scale a process whose independence, timing and edge-case rules have not been tested.

## 8. Limitations

- One internal, engine-assisted process prepared every item with engine output visible.
- No qualified prosody reviewer has signed any reading or meter assignment.
- The sample is positive-only and was filtered by engine acceptance, so it cannot support accuracy, recall or precision claims.
- All items are from one poet and one source family; form and poet coverage are narrow.
- Human effort is unmeasured. Do not infer minutes per item, reviewer throughput or cost from this pilot.
- The validators check structure, pins and internal consistency, not prosodic correctness.
- `workingTreeDirty: true` means the pins describe an uncommitted tree. This report is valid only for that tree.
- Nothing has been committed or pushed, and no hosted CI run has occurred.

## 9. Next steps

1. Identify at least two qualified independent annotators and one adjudicator. Contacting or engaging them requires separate authorization.
2. Re-annotate these ten items blind, measure elapsed minutes per item, and adjudicate disagreements.
3. Decide the open questions in protocol §12, especially source orthography versus normalization, syllable export, and variant admissibility.
4. Extend the revised pilot with invalid variants, a rubai, a repair task and at least one non-Ghalib poet.
5. Only then begin the first 100-line natural corpus and 100 invalid variants, with a versioned schema/protocol migration note.

Do not describe this pilot as independent review, as a gold corpus, as evidence of accuracy, or as validation by scholars.
