# Likho — next steps and current priorities

Updated: 30 October 2026. This is project direction, not blanket authorization to implement every item. Follow the current user task first and read `../AGENTS.md`.

## Current reference and tutorial direction

The owner requested a reference area covering **all 50 named meter forms**, plus an interactive تقطیع course beginning before short/long syllables. The complete plan is [Reference Guide and Interactive Taqti Course](REFERENCE_GUIDE_AND_INTERACTIVE_TAQTI_PLAN.md): 12 proposed modules, 40 lessons, meter-entry standards, interactions, review requirements and phased delivery.

A basic first-lesson prototype now exists at `src/components/reference/FirstTaqtiLesson.tsx`, and a 50-meter Reference Atlas view now exists at `src/components/reference/MeterReferenceView.tsx` (backed by `src/data/meterReferenceAtlas.ts` and opened from `src/components/companion/ProsodyTab.tsx`). It includes one complete source-checked exemplar article (`ramal-musamman-mahzoof` with 6-layer decomposition, a constructed negative counterexample, neighbor comparisons, and an answer-hidden practice exercise) and honest `catalog-only` review-stage labels for the remaining 49 forms. Progress is not saved; owner/poet review of the remaining 49 articles and full 40-lesson course remains open. Do not describe the complete 40-lesson course or all 50 articles as fully authored.

When the owner requests further learning work, expand source-checked meter reference articles and lessons module-by-module (`Module 1` through `Module 12`). Source and answer-key review must precede release of graded teaching material. Do not begin the next phase solely because it appears here.

## Broader goals

These preserve the earlier next-steps discussion; they are priorities to coordinate with the owner's latest direction, not a compulsory execution order.

1. **Finish the desktop composing experience:** `CustomStudioWorkspace.tsx` (`من پسند` / Writing Only view) now provides a zero-selected default (`منتخب سہولیات: 0 / 12`), 12 independent feature checkboxes, 6 screen division geometries (`single`, `two_cols`, `three_cols`, `two_rows`, `t_split`, `quad_grid`), 9 per-pane modules, a persistent poet's scratchpad (`تخلیقی بیاض`), and independent per-pane scrolling. Continue using complete poems to find friction in writing, selection, drafts, rhyme discovery and export.
2. **Poet-led pronunciation and rhythm review:** record intended readings and specific disagreements, then make evidence-backed corrections. Previously deferred; the owner must resume review. Owner review is distinct from independent validation.
3. **Rhyme correctness & vocabulary scale:** `qafiyaEngine.ts` and `RhymeTreasuryTab.tsx` now index **58,604 unique normalized Urdu words** (`40,433` weighted Aruuz words + `18,171` unweighted words from the `Qaafiyah Expert 1.1` master `Urdu_Dict.txt` and exported rhyme lists, bundled into a separate lazy `qaafiyah-vocab` chunk without fabricating weights), alongside pronunciation-aware rhyme matching (`strict`, `near`, and `uncertain` tiers), letter-count filtering (`تمام دکھائیں`, `زیادہ سے زیادہ`, `صرف`, `کم از کم`), one-click `.txt` export, false-homograph filtering (`نور/غور`, `تیر/خیر`, `قمر/فکر`), and multi-word `ردیف` separation across couplets (72 prosody checks passing). Unvocalized lexicon entries stay strictly in the labelled `uncertain` orthographic tier, and poet-led review of edge-case classical `قوافی` remains open.
4. **Repair usefulness:** `meterRepairEngine.ts`, `ScansionCard.tsx` and `PoetryCanvas.tsx` now enforce grammatical transposition guards (protecting *اضافت*, postpositions, conjunctions and copulas), preserve established *ردیف* and *قافیہ* slots on rhyming couplet lines, expand attested `ان/اں` poetic contractions, and rank proposals by naturalness (69 prosody checks passing). Full semantic/idiomatic evaluation still requires poet judgment and future poet-led review sessions.
5. **Evaluation depth:** independently selected examples, more poets, invalid lines, rubai and repair tasks. The engine-selected ten-line Ghalib pilot remains unadjudicated and cannot establish overall accuracy.
6. **Performance and offline behavior:** Initial critical-path bundle size and eager dictionary preloading are now resolved (`dist/index.html` no longer preloads `prosody-lexicon`; main shell `index.js` is `25.87 kB` gzipped; `urduLexicon.ts` uses lazy `Proxy` lookup; `ScansionCard` is memoized per line). Offline Service Worker / app-shell restart verification and formal profiling under throttled network/CPU remain open before promising complete offline operation.
7. **Release quality:** accessibility, additional browser engines, exports and recovery. Mobile work remains deferred unless requested.
8. **Versioned release:** review intended changes, establish release checks, then commit/push/deploy only when explicitly authorized. Local build success is not production verification.
9. **Parallel Track — Independent Sovereign Urdu Lexicon (100% Proprietary Data Cutover):** Follow [Independent Sovereign Urdu Lexicon Plan](INDEPENDENT_SOVEREIGN_LEXICON_PLAN.md) to build Likho's own 65,000+ word clean-room prosodic & rhyme dictionary from 19th-century public-domain dictionaries (Platts 1884 / Steingass 1892), deterministic Urdu morphological inflection expansion, and reverse meter deduction on public-domain classical *Diwans*—while keeping the current dictionaries active until cutover.

## Sources of truth and handoff

- [Development status](../DEVELOPMENT_STATUS.md): recorded implementation and verification; use newer sections where earlier counts differ.
- [Full learning/reference plan](REFERENCE_GUIDE_AND_INTERACTIVE_TAQTI_PLAN.md): curriculum and atlas specification.
- [Independent sovereign lexicon plan](INDEPENDENT_SOVEREIGN_LEXICON_PLAN.md): clean-room dictionary compilation strategy.
- [Poet review status](POET_REVIEW_STATUS.md): review boundaries and deferred work.
- [Prosody contract](../PROSODY_REPAIR.md): analysis, provenance and repair behavior.
- [Broader product plan](COMPETITIVE_PRODUCT_PLAN.md): longer-term proposals; some initial findings are superseded by later fixes.

Inspect actual source and current checks before consequential claims. Update this roadmap when the owner changes direction or a listed milestone is completed; keep proposed, implemented, reviewed, tested and deployed states distinct.
