# Likho pronunciation and deterministic repair

Updated October 30, 2026. Mobile layout work is deferred at the user's request.

## Implemented contract

The canvas, repair engine, and companion now share one pronunciation and meter path. No spelling-length weights or whole-verse template shortcuts participate in scansion. Each selected word reading retains its pronunciation, source record IDs, and the contextual rules actually used.

`urduPhonology.ts` parses preserved vowel marks into consonants and short/long vowels. It handles shadda, sukun, aspiration, explicit nasalization, hamza, madda, dagger alif and terminal tanwin. It distinguishes CV, CVC, CVV, CVCC and CVVC. It rejects unresolved medial consonants and complex codas; it does not invent missing vowels in arbitrary unknown words. Source-supplied pronunciation divisions provide evidence for otherwise unmarked dictionary chunks.

`prosodicReadings.ts` adds documented reading alternatives: grammatical monosyllables, eligible final vowels, explicit izafat forms on consonants/vowels/yeh, specifically attested izafat shadda, conjunction o, optional alif liaison, Arabic article compositions, explicit nasal spelling, and a restricted verb-ending rule requiring both a recorded stem and its infinitive. Punctuation blocks liaison. Short particles cannot disappear under a liaison label. Distinct readings of کیا remain distinguishable. A selected long vowel does not falsely receive a "shortened" explanation.

`prosodyMeters.ts` contains 50 named forms: the handbook's 37 regular entries, twelve rubai forms, and its explicitly permitted four-foot Mutadarak form. Zihafat are named patterns, never arbitrary substitutions. Documented first-syllable flexibility and extra short positions are separate variants. The extra final short is disallowed in Hazaj Musamman Salim. A caesura short must coincide with a word boundary; the dynamic program preserves that constraint while searching all alternative readings. Actual surplus syllables remain visible in the output.

`scanAgainstMeter` uses exact dynamic programming over the finite reading lattice; there is no 16-branch cutoff. `scanMeter` considers only the named meter's permitted variants. Automatic meter identification is a hypothesis with stable tie breaking; an exact shorter prefix remains in progress. Explicit target selection diagnoses unfinished tails.

Repairs consider written pronoun and nasal (`ان / اں`) alternatives, single-word thesaurus synonyms, and grammatically guarded adjacent word swaps (preserving explicit *اضافت* chains, postpositions, clause openers, and line-final copulas). When *ردیف* or *قافیہ* context is present on a rhyming line, repairs protect trailing *ردیف* tokens and reject *قافیہ*-slot replacements that would break the rhyme. Proposals are ranked by resulting metrical distance and category naturalness (`poetic_license` before `synonym` before `transposition`). Every proposal changes text, rescans the entire line against the same named meter, strictly reduces distance, and contains no unresolved or unreviewed user-supplied readings. Complete matches and partial improvements have different labels. The full edited line is visible before applying. Application preserves unrelated whitespace/punctuation and pins the target meter. Meaning and idiom remain the poet's decision. Zero suggestions is a valid result.

## Pronunciation data and audit

The previous 18,982-entry generated weight collection is no longer the scansion source. Its old `qaafiyahDataset.json` is unused historical input, not validated pronunciation evidence.

The active source is a pinned lexical-table extraction from [Sayed Zeeshan Asghar's Aruuz](https://github.com/sayedzeeshan/Aruuz), revision `058fcd6010fb0ef030f79b10466c43aa20b0d4b9`. The source SQL SHA-256 is checked before import. No SQL is executed. Only mastertable, plurals, variations and exceptions are read; non-lexical tables are never packaged.

- **40,434 dictionary keys, 43,556 retained reading records.** These are attributable source entries, not a claim that every record has been independently reviewed by a scholar.
- **1,007 quarantined source records**, with word, source ID and rejection reason, are retained in `src/data/prosody/aruuz-quarantine.json`. Some words remain supported by a different accepted record.
- Impossible exception records cannot override a usable source entry. For example, the upstream `جو → ==` record is rejected. A metrical-unit bound is only a rejection check; it never generates a pronunciation.
- Multiword source entries are excluded from this single-word index. Contextual joins are constructed by the rule engine rather than silently splitting phrase entries.
- Source metadata and rejection counts live in `src/data/prosody/aruuz-dictionary.meta.json`. The reproducible importer is `scripts/import-aruuz-lexicon.mjs`. Run `node scripts/import-aruuz-lexicon.mjs /path/to/AruuzDB.sql` with the pinned source file; the checksum guard rejects a different revision, then `npm run generate:lexicon` creates compatibility assets.

`npm run generate:lexicon` builds compatibility assets only from this attributed dictionary. Plain TXT/CSV/ODT word lists are saved as unweighted vocabulary. They never manufacture weights or overwrite source readings. Weighted imports are syntax-checked atomically, retain `user-entry` provenance, and cannot qualify automatic repairs. Old guessed custom-cache keys are not promoted into the new store. Source data loads synchronously; personal entries hydrate from IndexedDB and invalidate the reading cache. Schema-v2 backups preserve the source reference and personal entries separately. Persistence is reported only after the IndexedDB transaction commits; when storage is unavailable, the UI explicitly identifies session-only imports.

The adapted Aruuz data is supplied under GPL-2.0 with attribution, license text and editable corresponding data/conversion source in `public/licenses/likho-prosody-source.tar.gz`. Keep these materials with distributions. Handwritten engine logic was not copied from upstream.

## Sources for rules and fixtures

- Pritchett and Khaliq, [general principles](https://franpritchett.com/00ghalib/meterbk/01_genrules.html), [flexibility](https://franpritchett.com/00ghalib/meterbk/02_flexibility.html), [constructions](https://franpritchett.com/00ghalib/meterbk/03_special.html), and [named meter forms](https://franpritchett.com/00ghalib/meterbk/06_meters.html).
- Muhammad Waris, [syllables](https://www.aruuz.com/resources/article/VLwR2i2C0Ov9n6LjC2Le) and [worked Ghalib example and spelling alternatives](https://www.aruuz.com/resources/article/3tokeg7d7nj20pceemus).
- Pritchett's [Ghalib 1.1](https://franpritchett.com/00ghalib/001/1_01.html) and [1.2](https://franpritchett.com/00ghalib/001/1_02.html) supply independent transliteration checks. Tests analyze words, not line-to-meter lookup entries.

## Verification

`npm run test:prosody` passes **72 checks**, covering selected phonetic contrasts, source provenance, quarantine search and reason inspection, proposal syntax validation, unreviewed proposal repair blockage, approved proposal repair enablement, atomic backup rejection, proposal hydration skipping malformed records through a mock IndexedDB read path (not the complete browser storage lifecycle), invalid data, Unicode, contextual readings, word-boundary caesuras, genuine syllable output, exact/partial repairs, imports, cache invalidation, backups, pronunciation-aware rhyme tiers, grammatical/radif repair guards, per-word intention possibilities (compound splits such as `آگئے → آ گئے` `فَاعِلُن`, reading pinning, and poetic variants), the `58,604`-word rhyme vocabulary (`40,433` weighted Aruuz words + `18,171` unweighted `Qaafiyah Expert` words kept strictly in the `uncertain` tier without manufacturing scansion weights) plus the 4-mode letter-count filter, and the 50-meter Reference Atlas prototype (`ramal-musamman-mahzoof` exemplar + 49 `catalog-only` forms). Five classical Ghalib lines serve as positive benchmarks, each with an added-word negative test. These checks establish tested behavior for the covered subset; they do not cover every classical rule.

Desktop review modal behavior, live approval/deletion updates, and browser backup round-trips passed the Playwright acceptance scenario described below.

The desktop browser verified the opening Ramal lines, expanded source/rule explanations, the real Ghalib `میرے → مرے` repair in Hazaj, actual editor mutation, an unknown-word block, and the displayed dictionary count. The original poem was restored. The browser reported no warnings/errors during those checks. `artifacts/phonology-ghalib-repair.png` records the apply result.

The TypeScript/Vite production build passes. Rollup `manualChunks` separates the prosody lexicon (`prosody-lexicon`), the rhyme vocabulary (`qaafiyah-vocab`), vendor dependencies (`vendor`), and icons (`vendor-icons`), while `React.lazy` and dynamic `import()` split `ScansionCard`, `LiteraryCompanion`, `qafiyaEngine`, `ExportModal`, and `CalligraphyCardModal` from the core editor shell (`index`: `105.60 kB` / `26.98 kB` gzipped; `qaafiyah-vocab`: `472.60 kB` / `104.20 kB` gzipped; `prosody-lexicon`: `4,042.12 kB` / `675.85 kB` gzipped). `dist/index.html` no longer preloads `prosody-lexicon` via `<link rel="modulepreload">`, and `src/data/urduLexicon.ts` resolves entries lazily via a `Proxy` instead of allocating 40,434 objects at module evaluation time. The lexicon chunk still loads asynchronously after shell mount to power live scansion. No deployment has been performed.

## Explicit limits

This is a working Urdu quantitative scansion and repair engine with cited rules and a substantial attributed lexicon. It is not an exhaustive implementation of every historical Arabic/Persian/Urdu school, dialect, or disputed license. Mir's unrestricted Hindi/Zamzama family, very rare taskin-e-ausat variants, and unknown/unsupported pronunciations remain unresolved rather than forced into a meter. A finite dictionary can lack even familiar words; missing entries need sourced readings or sufficiently explicit vocalization. Independent scholarly review and a broader adjudicated corpus can still reveal corrections. Those limits must stay visible; neither determinism nor a dictionary count proves universal authenticity.

### Proposal integrity verification (2026-10-29)

Proposal creation, backup import, and stored proposal hydration now share runtime validation for word keys, bounded patterns, review status, and metadata types. Invalid backup payloads cannot partially activate proposals. Valid backups retain personal approval status; approval is the user’s attestation, not independent scholarly certification. Regression checks and the production build pass. The review modal subsequently passed the desktop Chromium acceptance scenario below.

### Desktop browser acceptance (2026-10-29)

`npm run test:e2e` passes one Playwright scenario with eight reported steps covering A–H, using Chromium at 1440 × 1000 against the local Vite application. The final run completed in approximately 25 seconds. It verifies modal opening, source-ID and word search, the 12-record conflicting-vowel filter, rejection of invalid patterns on save, draft repair blocking, approval enabling the recorded `=-` reading, applying the `میرا → مرا` partial repair, live deletion revocation, and draft/approved/deleted state after reload. Real browser IndexedDB APIs are used without a storage mock. The scenario downloads the JSON backup, restores its approved proposal through the import UI, reloads to verify persistence, then checks that a malformed backup leaves exported state unchanged both before and after reload. No page JavaScript exceptions were recorded.

The supplied `آرٹ میرا دل مرا دل مرا دل` fixture yields a **partial improvement**, not an exact meter match. Its apply button correctly says `جزوی بہتری لاگو کریں`. Personal approval remains user attestation, not scholarly certification. This pass covers the tested desktop Chromium workflow; mobile, other browser engines, quota/storage failure behavior, and real-browser corrupted-storage hydration are not established by it. The separate Node hydration test still uses a mock read path.

Reproduce with `npm ci`, `npx playwright install chromium`, and `npm run test:e2e`. The configuration reuses a server on 127.0.0.1:5173 or starts Vite. Each run uses an isolated browser context. The HTML report is written to `playwright-report/index.html`; failure screenshots and traces go to `test-results/`. Recorded desktop screenshots are `artifacts/lexicon-approved-desktop.png` and `artifacts/lexicon-repair-applied-desktop.png`.
