# Likho: competitive product and engineering plan

Prepared 29 October 2026. Status: proposed roadmap, not an implementation or launch claim.

## 1. The objective

Make Likho the preferred workspace for an Urdu poet to compose, understand a metrical problem, evaluate an appropriate correction, find a usable rhyme, and preserve their work. Compete first on this complete writing task. Success means independently measured accuracy, useful suggestions, reliable storage, and a workflow poets choose repeatedly.

Our proposed promise: **Write Urdu poetry with clear reasons behind every scansion and correction, while keeping control of your words.**

Broad literary discovery is a later expansion. Rekhta's archive, cultural reach and reference ecosystem cannot be replaced by adding a few editor features. Winning the composition workflow is a concrete entry point into that larger market.

This document authorizes no implementation by itself. It establishes the sequence, deliverables, acceptance gates and decisions for subsequent work. Mobile layout remains deferred under the existing instruction.

## 2. Competitive evidence and limits

Public pages reviewed on 29 October 2026. These establish advertised/documented features, not measured accuracy, speed, availability or user preference. No competitor tool was submitted benchmark cases in this planning pass.

| Product | Publicly documented capability | Strategic implication |
| --- | --- | --- |
| Aruuz | Poetry scansion, closest-meter correction guidance, individual-word scansion, learning resources and dictionary correction discussions | Scansion, highlighting and word inspection are baseline expectations. |
| Aruuz API documentation | Batch scansion, multiple matching meters, and correction responses | An API and multi-meter output would not alone distinguish Likho. Documented endpoints have not been tested for present availability. |
| Rekhta Taqti | Word/syllable analysis and meter checking; Urdu and Devanagari input; a stated relationship to its poetry collection and dictionary | We need strong pronunciation evidence and a long-term script-access strategy. Its collection size is not an independently measured accuracy figure. |
| Rekhta Qaafiya | Sound-based categories, grouping by weight, meanings and usage examples; Urdu, Roman and Devanagari views | Simple suffix search and weight grouping are insufficient competitive advantages. |
| Rekhta For Poets | A connected set of poet-facing resources | Integrated workflow matters, but competitors already connect resources. Our advantage must be demonstrated in actual composing tasks. |

Sources:

- [Aruuz home](https://www.aruuz.com/)
- [Aruuz API documentation](https://www.aruuz.com/resources/article/25cdFqvoA08Gu7DN2bLs)
- [Aruuz dictionary correction discussion](https://aruuz.com/discussion?id=vSZWtVktzSJvzedJ756Z)
- [Rekhta Taqti](https://www.rekhta.org/taqti)
- [Rekhta Qaafiya and usage guide](https://www.rekhta.org/qaafiya)
- [Rekhta For Poets](https://www.rekhta.org/explorer/rekhta-for-poets)

Correct the current development-status introduction before using it for public positioning: describing Aruuz as a static submission box and Rekhta as read-only is misleading. Neither “better than” claim is established by our current tests.

Competition should use original product design, attributable/licensed data, independent evaluation and truthful claims. Our existing dependency on Aruuz-derived lexical data must remain prominently credited. Do not present that inherited data as an independently built dictionary or scrape restricted collections to inflate coverage.

## 3. Our actual starting point

### Established locally in the preceding acceptance work

- 40,434 source-attributed dictionary keys and 43,556 readings; 1,007 quarantined records.
- A shared deterministic reading lattice, source/rule explanations and 50 named meter forms.
- Rescanned suggestions with exact-versus-partial labels; unresolved and unreviewed readings block automatic repair.
- Personal pronunciation review, validation, backup import and export.
- 66 service checks and one desktop Chromium Playwright scenario with eight steps covering the A–H workflow.
- The browser scenario covers draft/approval/deletion persistence, canvas updates, applying a partial repair, backup restoration and malformed-import rejection.
- TypeScript/Vite build passes. This is local evidence, not a production deployment or market-leading accuracy result.

### Gaps and risks seen in source or existing records

1. **Potential draft replacement:** `StorageService.getDrafts()` rewrites the sample draft when its edited content no longer contains a particular original line. This is a source-inspection finding; reproduce it in an isolated browser before claiming an observed incident or a precise time to loss. Reads occur during hook renders and inside saves, so the risk is not limited to reload. Sample identity must never authorize replacement of a user’s edits. The current lexicon E2E re-fills the fixture after reload and therefore does not establish draft persistence.
2. **Rhyme correctness:** `qafiyaEngine.ts` primarily matches spelling suffixes, includes broad co-rhyme heuristics, and selects the first available weight. It is not yet a complete pronunciation-aware classical rhyme validator.
3. **Evidence depth:** five classical positive benchmark lines are a small accuracy sample. Fifty supported form definitions do not prove complete phonological coverage.
4. **Repair usefulness:** strict metrical improvement does not guarantee preserved meaning, register, syntax or idiom.
5. **Durability:** browser quota errors, failed commits, migrations and corrupted real browser storage need targeted coverage. Proposal save/delete messages should be audited against the actual persistence result.
6. **Performance:** lexicon transfer remains eager, about 676 kB gzipped in the last recorded build. Startup and sustained typing latency are not yet measured.
7. **Offline promise:** an offline lexicon is not proof that the app shell starts without a network connection. Verify caching/installability separately.
8. **Release quality:** one desktop Chromium workflow does not establish Firefox/WebKit, accessibility or production behavior.

## 4. What winning will mean

All numbers below are **proposed gates**, not current results. Freeze definitions and evaluation sets before optimizing to them. Publish denominators, exclusions and uncertainty alongside every result.

| Dimension | Measurement | Proposed gate |
| --- | --- | --- |
| Valid-verse handling | Correct acceptance with an adjudicated valid reading and target meter, on supported-scope held-out lines | At least 98%; also report by meter family and ambiguity class |
| Invalid-verse handling | False acceptance among expert-confirmed invalid cases | Pilot: zero observed false acceptances in the first 100; full gate: one-sided 95% exact binomial upper bound at most 1%, requiring at least 299 independent cases if zero errors; unresolved cases reported separately |
| Meter identification | Top-1/top-3 against the full admissible meter set | Top-3 at least 98% for supported, resolvable cases; publish all-input coverage too |
| Pronunciation evidence | Accepted path has attributable word readings and rule references | 100% of paths labelled verified by the product |
| Exact repair integrity | Whole-line rescan in pinned target, no unresolved/unreviewed words, no silent text changes | 100% in automated acceptance checks |
| Repair usefulness | At least one top-3 suggestion judged useful and meaning-compatible by independent reviewers | At least 75% on a frozen 200-task repair set, with suggestion coverage reported |
| Strict rhyme precision | Expert-accepted strict matches among top 10 | At least 95% micro-precision across up to 1,000 reviewed returned slots (100 queries × top 10); publish per-query precision, result coverage and recall too |
| Typing responsiveness | Input-to-visible feedback p95 on a named reference device and fixed workload | At most 150 ms for a typical 12-word line; expensive repair search may be asynchronous |
| Durability | User edits survive tested reload, crash-recovery and migration cases | No known data-loss issue in the release gate suite |
| Task advantage | Counterbalanced composing study against competitors | Proposed median completion-time reduction of at least 25%, without worse quality; publish paired confidence intervals; a 12–20-person pilot is directional unless adequately powered |
| Repeat use | Consenting beta writers returning weekly | Initial target: 50% of activated pilot writers in at least 3 of 4 weeks; directional pilot evidence only |

“Verified” needs a documented scope. It must distinguish source-attested, personally approved, independently reviewed, disputed and unresolved readings. Do not convert a metrical distance into an accuracy probability or a judgment of poetic beauty.

For rare families with small samples, report counts and unresolved cases rather than a flattering aggregate percentage. If a gate fails, narrow the release scope explicitly or fix it; do not change the denominator after seeing results.

## 5. Work packages, in execution order

### P0 — Protect poems and establish release discipline

**Owner:** engineering. **Size:** approximately 3–5 engineering days, subject to findings.

Deliverables:

- Reproduce sample-first-line, sample-other-line and ordinary-draft persistence in fresh browser contexts, then remove destructive content-based repair. Seed the specimen only when the key is absent; a valid empty array remains empty. Keep sample restoration as an explicit user action. Remove automatic title spelling replacement in both the storage service and editor hook; no broad typo migration is justified.
- Preserve exact unreadable originals and surface recovery explicitly. If writing a recovery copy fails, block destructive writes to the original key. Validate draft and preference shape before backup restoration; never interpret parse failure as an empty portfolio. Preserve a recovery copy before any future migration.
- Audit draft autosave, manual save, proposal save and deletion. The navbar currently defaults to saved without receiving actual status, the hook ignores save results, and proposal messages ignore persistence outcomes. Use explicit idle/dirty/saving/saved/session-only/failed states with draft revision tracking so stale save completions cannot mark newer text saved. Failed deletion must distinguish session removal from durable removal. Warn before leaving with unsaved text where the browser supports it; retain export/copy recovery because unload warnings are not guaranteed.
- Add separate browser scenarios for ordinary-draft edits, sample-draft edits, reload, failed writes and backup restoration. A fallback specimen must never masquerade as a recovered user draft.
- Prepare CI to run the service suite, type/build and Chromium acceptance. The existing origin is `https://github.com/getmorefromlife/likho.git`; no `.github/` workflow exists in the inspected tree. Review the large untracked/modified working tree, select intended files and the CI workflow, and obtain authorization for committing/pushing before a hosted run. Local checks can proceed independently. Keep traces on failure and use isolated storage.
- Correct unsupported competitor claims in project positioning.

Acceptance: deliberately edit every line of the sample and its title, reload, and retain the edited content; verify a normal draft too. Simulated storage failures must leave recoverable text available and show a truthful status. All existing acceptance checks continue to pass.

Files: `src/services/storageService.ts`, `src/hooks/usePoemEditor.ts`, `src/components/navbar/TopNavBar.tsx`, `src/App.tsx`, `src/components/companion/PortfolioTab.tsx`, `src/components/companion/LexiconManagerModal.tsx`, `tests/e2e/`, CI configuration.

### P1 — Create an independent benchmark and rule registry

**Owners:** engineering plus at least two qualified Urdu prosody reviewers, with an adjudicator for disagreements. **Dependency:** P0.

Land and pilot the annotation schema/protocol before bulk annotation. Start with **100 independently annotated natural lines**, **100 reviewed invalid variants**, and **25 repair tasks**. Double annotation and adjudication are not assumed to fit two part-time reviewer weeks; measure minutes per item on the first ten and schedule from actual availability. Identify reviewer candidates in parallel with P0; contacting or hiring them requires separate authorization. Then expand toward 1,200 base items: 600 development, 400 locked evaluation and 200 challenge items. These are item counts, not a claim that all will be ready in the first release.

Corpus composition:

- Common meters, rubai, long/short words, ambiguous vowels, hamza/madda, shadda, aspiration, nasalization, izafat, conjunction, liaison and caesura boundaries.
- Classical and consenting contemporary writing from multiple poets, plus separately labelled constructed and unfinished examples.
- At least ten adjudicated positive examples per advertised form before treating that form as benchmark-supported. Low-frequency forms remain provisional until sufficient evidence exists.
- The initial 100 invalid variants are a zero-observed-error pilot, not proof of a ≤1% population error rate. For a predeclared one-sided 95% exact binomial gate, zero false acceptances among 299 independent invalid cases gives an upper bound below 1%; use at least 300 operationally. A two-sided 95% interval would need at least 368 zero-error cases. At 0/100 the upper bounds are approximately 2.95% one-sided and 3.62% two-sided. If errors occur, calculate the actual bound; 1/100 is not a passing result. Related mutations are clustered evidence, not automatically independent trials. Report cluster-aware uncertainty and unique source-line counts.

- Invalid examples need expert confirmation: a changed line may accidentally fit another meter. Distinguish invalid-against-target from invalid-against-all-supported-meters.
- Include Unicode-equivalent spellings, punctuation, invisible formatting, repeated words, unsupported scripts and unknown vocabulary.

Record: stable ID, exact text, source/edition/page or stable URL, rights/provenance status, poem ID, split, intended meter, all admissible analyses, word-level readings, syllable shapes/weights, licensed contextual rules, uncertainty, reviewer decisions and adjudication notes. Pin the rule-engine and lexicon versions used in reports.

Build a rule registry linking each supported rule to its reference, scope, counterexamples, implementation location and tests. “Full Al-Khalil” must become a scoped coverage matrix: Arabic foundations, Persian adaptations and Urdu practice are related but not interchangeable.

Keep whole poems in one split; deduplicate spelling variants and closely related examples across splits. Hold out contemporary examples and known failure families. Reviewers annotate without seeing system outputs first. Source-derived dictionary evidence is not independent evaluation evidence merely because the test file is new.

Acceptance: reviewers agree on an admissible analysis or mark the item disputed; unresolved disagreements do not get forced into a gold answer. The benchmark runner reports correct/incorrect/unresolved, coverage, false positives, supported-versus-out-of-scope and per-family results. No natural line may pass because the engine recognizes a complete verse string.

Suggested artifacts: `data/benchmarks/prosody/`, `docs/PROSODY_RULE_REGISTRY.md`, `scripts/evaluate-prosody.mjs`, a versioned evaluation report.

### P2 — Turn the lexicon into a reviewed evidence system

**Owners:** lexical reviewer and engineering. **Dependency:** P1 schema and initial failure report. Continue in parallel with later engineering once the schema is stable.

- Rank missing words using benchmark failures and voluntarily supplied writing samples; do not collect private poem text silently.
- Review the highest-impact 250 missing/disputed words and first 100 quarantine records. Stop treating “clear all 1,007” as the objective: some must remain rejected.
- Support multiple pronunciations, language/register, source edition, pronunciation divisions and word senses where available.
- Separate personal approval from independent editorial review. Keep the existing personal workflow; add a distinct editorial evidence process with reviewer identity, source and change history.
- Provide corrections, deprecation, rollback and a lexicon changelog. Never silently replace a known disputed reading.
- Ensure expanded flexible readings remain bounded; validate backup versions and migrations.

Acceptance: every editorially accepted reading has a source and reviewer record; source-attested and personally approved entries remain visibly distinguishable. Demonstrate improvements on held-out missing-word coverage without increasing false acceptance. Independent curated additions must not lose attribution to the upstream source or their own sources.

Files: `aroozLexiconService.ts`, pronunciation data and metadata, importer, review modal and evaluation fixtures.

### P3 — Close phonology and feedback gaps using benchmark evidence

**Owner:** engine engineering with reviewer sign-off. **Dependency:** P1 baseline; P2 supplies missing readings.

- Triage failures as lexical gap, parser error, contextual-rule error, meter-form error, Unicode issue or disputed scholarship before changing code.
- Add minimally scoped rules backed by examples and counterexamples. Avoid blanket flexibility that makes invalid lines pass.
- Expose admissible alternatives when automatic meter selection is ambiguous; allow the poet to pin a reading and a target without altering stored dictionary evidence.
- Add poem-level meter consistency: use evidence from multiple lines, explain disagreements, and allow intentional variation by form.
- Feedback should answer: where is the mismatch, which pronunciation was used, which rule permits it, and what specific action could help?
- Keep missing-pronunciation, unfinished-line, ambiguous-analysis, supported match and target mismatch visibly distinct.

Acceptance: improvements pass the frozen benchmark gates, not just newly written examples. Show actual syllables even when they do not match. A meter change cannot be hidden inside an edit suggestion.

Files: `urduPhonology.ts`, `prosodicReadings.ts`, `aroozEngine.ts`, `prosodyMeters.ts`, `ScansionCard.tsx`.

### P4 — Make repairs useful to poets

**Owners:** engineering and literary review. **Dependency:** stable P1/P3 evaluation contract.

- Evaluate current pronoun alternatives, synonyms and swaps before enlarging the candidate set.
- Add constraints: preserve selected words, radif, rhyme position, grammatical person, negation and named entities where reliably detectable. Show uncertainty for properties we cannot guarantee.
- Rank first by validity in the pinned meter, then by edit size and reviewed lexical/grammatical suitability. Display meaning-risk notes rather than an invented beauty score.
- Offer a few distinct full-line candidates with visible before/after text, exact/partial status, provenance, and undo.
- Compare two candidates without changing the draft; require an explicit apply action.
- Optional generative assistance may later propose language, but every candidate must pass the deterministic verifier and remain labelled as a suggestion. It is not required for the initial release.

Evaluation: grow to a frozen 200-task set containing exact fixes, partial-only opportunities and cases where no automatic suggestion is appropriate. Blind reviewers assess meaning, idiom and helpfulness. Track harmful suggestions, suggestion coverage, top-3 usefulness and rescanning validity separately. Never claim a high usefulness rate by excluding cases with no suggestions.

Acceptance: all advertised exact repairs satisfy the target and evidence contract. The UI preserves the correct partial label for the current آرٹ fixture. Protected text remains unchanged, and apply/undo preserves unrelated punctuation and spacing.

Files: `meterRepairEngine.ts`, `ScansionCard.tsx`, thesaurus data and benchmark tasks.

### P5 — Build pronunciation-aware rhyme and ghazal assistance

**Owners:** engineering with a specialist in qafiya. **Dependencies:** P1 rule registry and P2 pronunciation evidence.

- Specify classical rhyme constraints with reviewed examples: rawi, relevant preceding vowels/consonants, repeated endings and radif boundaries. Represent disputed conventions explicitly.
- Replace spelling suffix heuristics as the basis for strict-rhyme claims. Retain broad spelling search under a separate discovery label.
- Evaluate all attested readings rather than taking only the first weight.
- Provide strict rhyme, near/discovery matches and unresolved pronunciation as distinct result groups. Definitions and labels need our own documented criteria; do not assume competitor category names are a scholarly standard.
- Filter for the remaining metrical slot, insert the candidate into the actual line, and rescan its boundaries in context.
- Show sense, register, evidence and attributed usage examples where licensed. A shared weight is never proof of rhyme or meaning equivalence.
- Detect radif and matla patterns with confirmation, then flag inconsistent rhyme across the poem. Preserve intentional departures.

Metric contract: 100 queries × up to 10 returned words creates up to 1,000 relevance judgments per reviewer. Each judgment is a query–candidate pair under a declared pronunciation/convention. Micro-precision is accepted pairs divided by returned reviewed pairs; missing slots are not correct results. Publish macro per-query precision, zero-result rate, fraction of queries with ten results, and recall against an independently assembled adjudicated relevant pool (pool-limited recall, not total-dictionary recall). Include uncertainty grouped by query. A single safe answer cannot establish broad coverage.

Acceptance: 100 reviewed queries with strict precision/recall and adversarial same-spelling/different-sound cases. Final candidate suitability uses the complete line, not isolated word weight. Matla/radif confirmation works on multiword radif and punctuation variations.

Files: `qafiyaEngine.ts`, `slotRhymeBuilder.ts`, `RhymeTreasuryTab.tsx`, `VisualSlotRhymeBuilder.tsx`, `QafiyaTray.tsx`.

### P6 — Deliver a fast, recoverable, genuinely offline studio

**Owner:** application engineering. **Baseline measurements may begin during P1.**

- Profile cold load, lexicon hydration, normal typing, long poems, ambiguity-heavy lines and repair search on a named mid-range reference device.
- Move expensive analysis to a worker if measurement justifies it; use request IDs and lexicon revisions so stale results cannot overwrite newer input.
- Keep typing responsive while dictionaries load; label pending analysis honestly.
- Test lazy lexicon loading or indexed assets using measured before/after transfer, parse and time-to-usable-editor figures. Chunk separation alone is not a performance result.
- Add app-shell caching and version-safe updates if we promise offline startup. Verify warm offline launch, editing, analysis, save, reload and backup.
- Keep draft snapshots and export/import recovery usable independently of the scansion engine.
- Expand desktop coverage to WebKit/Firefox, keyboard-only navigation, dialog focus/return, zoom, contrast and Urdu label legibility. Mobile remains deferred until explicitly resumed.

Acceptance: meet the responsiveness target on the fixed workload, no stale result races, no lost text in tested failure cases, and demonstrated offline behavior under a disabled network. Capture resource and timing evidence. Storage-denied tests must not claim permanent saving.

### P7 — Teach through the poet's own line

**Owners:** product design and instructional review. **Dependency:** dependable P3 explanations.

- Clicking a defect opens a short contextual explanation, source, example and optional exercise beside the line.
- Let beginners compare two valid pronunciations and observe why one fits; allow expert mode to keep explanations compact.
- Add meter listening only after verifying the short/long sequence, word-boundary mapping and Urdu pronunciation with reviewers. Distinguish rhythmic demonstration from natural recitation.
- Use the poet's own mistakes as optional local practice history; keep text private by default.

Acceptance: in a moderated pilot, learners can explain and fix the selected issue on a second unseen line. Measure comprehension and successful independent correction, not just lesson clicks.

### P8 — Validate adoption and release a differentiated beta

**Owners:** product lead, engineering and invited poets/teachers. **Dependency:** P0 and the first quality gates, not completion of every future feature.

- Recruit 12–20 consenting writers across beginners, practising poets and teachers. Recruitment/outreach requires a separate authorized action; none is performed by this plan.
- Run counterbalanced tasks with Likho, Aruuz and Rekhta: diagnose a line, locate a usable rhyme, make an appropriate correction and resume a saved draft where supported. Separate shared-capability tests from Likho-specific workflow tests; missing competitor features are recorded as such, not fabricated failures.
- Use public-domain, original or consented material in competitor submissions. Record tool/date/input/output, limits, failures and evaluator decisions. No automated access bypass or high-volume probing.
- Assess final poem quality blind where possible. Separate tool errors from evaluator disagreement.
- Offer a small set of excellent supported workflows with honest scope notes. Publish a reproducible evaluation summary, examples and corrections history.
- Build acquisition around original lessons and practical pages: understanding a mismatch, choosing a rhyme that fits the line, and preserving draft versions. Export carries optional creator credit, never mandatory advertising in a poem.
- Consider teacher workspaces or paid advanced services only after interviews establish willingness to pay. Pricing, revenue and competitive conversion targets are hypotheses; the current zero-subscription positioning is not changed by this plan.

Acceptance: poets demonstrate the key tasks without intervention; serious defects are resolved or explicitly scoped out; competitive claims are supported by paired results with sample size and limitations. Measure return use without uploading poem text by default.

## 6. Initial delivery schedule

Planning envelope: one primary engineer with regular access to two reviewers. Estimates are conditional, overlap where practical and must be revised after the first 100 annotations. A lack of qualified review blocks scholarly claims, even if engineering is finished.

| Window | Priority delivery | Exit decision |
| --- | --- | --- |
| Days 1–5 | P0 draft protection, truthful persistence and regression gates | No known edit-overwrite issue; storage statuses are honest |
| Weeks 2–3 | P1 schema, rule registry and timed ten-item annotation pilot; expand the first 100/100/25 batch as reviewer capacity permits | Protocol is stable; baseline completeness and reviewer capacity are reported |
| Weeks 3–5 | P2 first lexical review batch and P3 highest-impact correctness fixes | Measured coverage/accuracy improvement without false-positive regression |
| Weeks 5–7 | P4 protected edits, repair evaluation and contextual feedback | Useful, safe-to-apply candidates on the pilot set |
| Weeks 7–10 | P5 rhyme specification and first pronunciation-aware slice; allow 3–4 weeks and do not block P4 | Strict rhyme evaluation and full-line insertion checks pass |
| Weeks 9–10 | P6 durability, responsiveness and offline verification | Release gates pass on the named desktop setup |
| Weeks 11–12 | P8 writer pilot and competitive task evaluation; limited P7 lessons | Decide beta scope from observed results |
| After the first beta | Expand toward the full 1,200-item corpus, 200 repair tasks, rare forms and broader script support | Each claim expands only as its evidence expands |

This is a sequence for a focused beta, not a promise to finish all work packages or establish superiority in twelve weeks. Corpus adjudication and pilot recruitment can be the longest dependencies. Limit active engineering work to one main package plus the continuing review queue.

## 7. The next ten concrete tickets

| ID | Ticket | Completion evidence |
| --- | --- | --- |
| LKH-001 | Reproduce sample draft overwrite on reload | Isolated failing browser regression and captured original/edited values |
| LKH-002 | Preserve sample edits and provide explicit sample restoration | Passing sample/normal-draft reload tests; no silent content replacement |
| LKH-003 | Audit persistence feedback and recovery | Browser failed-write tests; distinguish committed versus session-only state |
| LKH-004 | Run current gates in CI | Service, build and Chromium results with artifacts |
| LKH-005 | Define benchmark schema, splits and review protocol | Reviewed schema and ten hand-annotated seed examples |
| LKH-006 | Create the first 100-line independent baseline | Versioned data, adjudication and all-input metrics |
| LKH-007 | Link implemented rules to sources and counterexamples | Coverage matrix with supported/provisional/unsupported status |
| LKH-008 | Review first 50 high-impact missing/disputed words | Evidence records and before/after held-out evaluation |
| LKH-009 | Evaluate 25 repair tasks and introduce protected text | Blind usefulness notes plus deterministic constraints tests |
| LKH-010 | Specify strict rhyme and test 20 seed queries | Reviewer-approved rules; false-positive examples for current heuristics |

Do not start by adding more meter templates or synonyms. First understand why the current system fails on independently reviewed cases.

## 8. Benchmarking competitors fairly

Maintain a separate comparison ledger; do not make competitor output the gold standard. Normalize meter names only where a documented equivalence exists. Keep multiple valid readings and out-of-scope cases visible. Our lexical source overlaps Aruuz, so agreement with Aruuz is especially weak evidence of independent correctness.

Compare separately:

1. Scansion accuracy and abstention on common supported material.
2. Explanatory usefulness and ability to identify the cause of an error.
3. Repair utility and preservation of intended meaning.
4. Rhyme precision, coverage and suitability in a whole line.
5. Time and steps to complete the writing task.
6. Recovery, offline behavior and control over drafts.

Where a service fails to load or rate-limits a request, report availability separately from linguistic accuracy. Do not infer absence of a feature from a page fetch failure. Re-check public feature descriptions before publishing comparisons.

## 9. Sustainable advantages to build

- A reviewed rule-and-pronunciation evidence graph linked to actual corrections and counterexamples.
- A benchmark with independent adjudication, transparent exclusions and reproducible reports.
- Contextual rhyme and repairs that respect the same complete line, target meter and protected text.
- A dependable local writing workspace with recoverable drafts and honest storage states.
- Compact explanations that teach writers and earn teachers' trust.
- Consenting writer feedback that prioritizes observed problems instead of speculative features.

These are proposed advantages. They become defensible only through evidence, maintenance and repeated user preference. A larger imported word count, a beautiful card export or a longer list of meters is not enough by itself.

## 10. Explicitly deferred

Mobile layout, a giant literature archive, social feeds, public poem hosting, mandatory accounts, cloud sync, broad Arabic/Persian claims, unreviewed rare licenses, native apps, and major calligraphy expansion. Roman/Devanagari input is a strategic later candidate: preserve spelling alternatives and uncertainty rather than silently guessing pronunciation. Revisit after the Urdu workflow wins a measured task comparison.

## 11. Working agreement for each package

At kickoff: select one ticket, record the failure or user task, define the acceptance set and identify the reviewer dependency. At completion: report what changed, service/browser evidence, benchmark impact, limitations and the next ticket. Update status documents only after observing the relevant checks. Preserve previous evidence and do not overwrite locked evaluation fixtures to make a change appear successful.

**Recommended immediate action:** LKH-001 and LKH-002, then the initial benchmark schema and 100-line review batch. Draft safety protects user trust; independent evaluation tells us which correctness work will actually make Likho more competitive.


## 12. Review amendments and next acceptance specification

The 29 October source review sharpened the P0 failure cases, statistical gates and scheduling dependencies. The precise browser reproduction remains work to execute, not evidence established by reading code. Use [DRAFT_SAFETY_ACCEPTANCE.md](./DRAFT_SAFETY_ACCEPTANCE.md) for LKH-001/002/003. No implementation, commit, push, recruitment or hosted CI action was performed while making these amendments.
