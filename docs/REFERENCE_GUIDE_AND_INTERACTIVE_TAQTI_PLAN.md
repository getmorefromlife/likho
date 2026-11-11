# Likho reference guide and interactive Taqti course

Date: 30 October 2026  
Status: product and curriculum plan; two initial prototypes are implemented in `ProsodyTab.tsx` (`FirstTaqtiLesson.tsx` for Lesson 1 and `MeterReferenceView.tsx` / `meterReferenceAtlas.ts` for the 50-meter Reference Atlas with one `source-checked` exemplar `ramal-musamman-mahzoof` and 49 `catalog-only` entries). Full 40-lesson authoring and independent content validation remain future work.  
Working title: **رہنمائے شعر و عروض** — Reference Guide and Learning Studio

## 1. Agreed direction and ambition

The project owner wants a first-class reference area and an interactive tutorial series teaching تقطیع from foundations that come before short and long syllables. The reference must cover **all 50 named meter forms**, not a selection of 15. The earlier mention of 15 was corrected to 50.

The ambition is an unusually thoughtful, comprehensive learning experience: a learner can hear or inspect an utterance, divide it into syllables, assign weights, group feet, understand the meter, explain a disagreement and return to composing. Quality should be demonstrated through clear teaching, attributable content, accessibility and measured learning outcomes. “No one has ever done this” is an aspiration, not an established novelty claim. No competitive or first-in-world claim is approved by this plan.

This document records the reference-guide discussion and expands it into a proposed curriculum, interaction design, content model, implementation sequence and acceptance criteria. It does not implement a course, authorize publication or imply that lesson examples have already been reviewed. Lesson counts and labels below are working proposals.

## 2. Existing foundation and boundaries

Reuse the current studio rather than create an unrelated learning product:

- `src/data/prosodyMeters.ts` supplies the shared catalog of 50 forms, foot patterns and source identifiers. Twelve entries are rubai forms. Catalog entries must be reconciled by stable ID before authoring; fifty forms must not be presented as fifty distinct بحور.
- `src/data/classicalMeters.ts` adapts that catalog for current UI use; avoid introducing a third independently maintained table.
- `src/components/companion/ProsodyTab.tsx` already provides search, meter selection and a line-analysis preview.
- The shared pronunciation/scansion engine, source details, unresolved-reading behavior and exact/partial repair distinction remain the analysis contract.
- The writing canvas, rhyme tools, personal-reading review and draft backups supply destinations for practice and contextual links.

Existing definitions are implementation evidence, not sufficient authority for every teaching explanation. The ten-line engine-assisted Ghalib pilot is not a gold answer set. A teaching exercise must not become “correct” simply because the current engine accepts it.

Related documents: [development status](../DEVELOPMENT_STATUS.md), [prosody contract](../PROSODY_REPAIR.md), [poet review](POET_REVIEW_STATUS.md), and [broader product plan](COMPETITIVE_PRODUCT_PLAN.md). Earlier roadmap findings may be superseded by the newer development status.

## 3. Learning outcomes

A successful learner can:

1. Distinguish written letters, pronounced sounds, syllables, syllable weight and rhythmic grouping.
2. Preserve a defensible reading before assigning metrical symbols.
3. Divide familiar and unfamiliar words into pronounced syllables and explain short/long assignments.
4. Scan a complete line, including contextual joins, without forcing it into a remembered template.
5. Group a pattern into ارکان and identify a supported meter form, or explain why the answer is uncertain.
6. Distinguish accepted alternatives, a target mismatch, missing evidence and a genuinely disputed case.
7. Evaluate a suggested repair for both meter and literary suitability.
8. Scan an unseen line with progressively less assistance and transfer that knowledge to their own writing.

The course teaches reasoning, not merely successful use of the scan button. A person may browse any reference article without completing lessons.

## 4. Information architecture

One reference destination with six connected areas:

| Area | Purpose |
| --- | --- |
| Start here | Explain prerequisites; offer a short placement check and a direct beginner start |
| Learn step by step | Guided course, optional practice and resumable progress |
| Meter atlas | All 50 forms, grouped by family, with searchable detail pages |
| Rules and glossary | Linked explanations of pronunciation, notation, contextual rules and terminology |
| Practice lab | Word, phrase and line exercises; a separate sandbox for personal text |
| Rhyme and poetic forms | Qafiya/radif, ghazal, nazm and rubai references connected to composing |

Proposed deep-link structure: `/reference`, `/reference/learn/:lessonId`, `/reference/meters/:meterId`, `/reference/rules/:ruleId`, `/reference/glossary/:termId`, `/reference/practice`. Adapt to the app's routing when implemented; these are logical routes, not existing pages.

Search should accept Urdu and English names, reviewed transliteration aliases, foot names and the app's pattern notation. Preserve displayed source text while normalizing search keys. Include breadcrumbs, related lessons, prerequisites, bookmarks and a visible return-to-poem action. Keep draft context and scroll position when returning.

## 5. Proposed curriculum: 12 modules, 40 core lessons

Lesson order is dependency-based. Introduce technical terms beside simple Urdu explanations; refine terminology with the owner and a qualified reviewer before release. Stage names are provisional.

| Module | Lessons | What is taught | Main interaction / evidence of understanding |
| --- | --- | --- | --- |
| 0. Before symbols | 3 | What تقطیع does; listening versus spelling; letters versus sounds versus syllables | Compare written and spoken units, mark perceived syllable boundaries, explain why letter count is insufficient |
| 1. Building a syllable | 4 | Vowels/consonants in speech, syllable nuclei, boundaries, relevant Urdu orthographic clues | Split reviewed words into sound tiles; reconstruct a word without dropping or inventing sounds |
| 2. Short and long | 4 | Short versus long syllables; open/closed structures; short/long vowel distinction; notation | Classify syllables, then give a structural reason; compare carefully reviewed minimal contrasts |
| 3. Word-level scansion | 4 | Multi-syllable words, absent vowel marks, alternate readings, shadda/aspiration/nasalization | Segment and weight a word; select a defensible reading or explicitly mark unresolved |
| 4. Connected speech | 4 | Izafat, conjunction o, allowed joins, hamza and boundaries; source-specific conditions | Compare isolated and connected readings; identify precisely where a permitted change occurs |
| 5. From weights to feet | 3 | ارکان, repeated patterns, foot boundaries versus word boundaries | Group syllable tiles into feet, including a word crossing a foot boundary |
| 6. First complete lines | 4 | Preserve text, choose reading, segment, weight, group and compare | Follow a fully worked example, complete a partially worked one, then scan an unseen line |
| 7. Navigating meters | 3 | Family versus form, stable IDs/names, comparing related forms | Compare nearby forms and justify the distinguishing segment; open the relevant atlas entry |
| 8. Variations and difficult endings | 3 | Scoped licenses, terminal/overlong behavior, caesura conditions and rubai introduction | Judge whether a change is permitted in this precise form; accept alternatives where appropriate |
| 9. Diagnosis and repair | 3 | Target mismatch, unknown reading, ambiguous fit; exact versus partial repair | Locate the first disagreement, propose or reject an edit, rescan and explain meaning concerns |
| 10. Rhyme and composition | 2 | Weight versus rhyme; qafiya/radif; use a candidate in context | Compare candidates and rescan an edited line; explain why matching weight alone is insufficient |
| 11. Independent capstone | 3 | Unseen line, complete couplet, personal composition | Submit a manual analysis before reveal, explain alternatives, then apply learning in the studio |

Total: 40 core lessons. Plan roughly 5–10 minutes per lesson as an authoring target, then revise from observed learner times. Optional extended practice and all 50 atlas entries are additional; do not turn 50 forms into a mandatory memorization sequence. Select the first teaching forms for structural clarity and reviewed examples, not unsupported popularity claims.

### Important teaching distinctions

- Use “syllable” precisely. A short vowel and a short syllable are related but different concepts; a closed syllable with a short vowel may carry long weight.
- Metrical weight is not identical to elapsed audio duration, stress, loudness or musical beat. Deliberately stretching a recording must not change the answer key.
- Written word boundaries, syllable boundaries and foot boundaries need not coincide.
- Teach how to preserve pronounced material before discussing conditions that permit change. Avoid the habit of deleting letters merely to make a meter fit.
- Do not generalize a license beyond its documented language, context and form. Introduce overlong residues and difficult endings only after basic syllable structure.
- A chosen meter is a comparison target, not permission to invent pronunciation.
- Multiple defensible analyses are sometimes correct. Uncertainty is a legitimate outcome.

## 6. Reusable lesson design

Every lesson follows a consistent sequence:

1. **Goal:** one observable skill in simple language, plus prerequisites.
2. **Notice:** a brief contrast or question before formal terminology.
3. **Worked example:** progressively reveal reading, syllable boundaries, weights and explanation.
4. **Guided attempt:** learner completes missing steps; feedback addresses the specific misconception.
5. **Independent attempt:** a new example without automatic scansion shown first.
6. **Explain:** choose or write the reason, rather than only guessing a symbol.
7. **Transfer:** use another word/line or open a disposable studio practice example.
8. **Recap:** a compact rule card, exceptions, source link and optional next practice.

Offer three assistance levels: demonstrated, guided and independent. Learners can request hints without losing their work. Reveal uses a staged ladder: focus on a location → recall the relevant principle → show a local step → reveal a full explanation. Record assisted and unassisted attempts separately if progress is recorded. No punitive streaks or compulsory timers.

## 7. Signature interactions

These are proposed distinguishing experiences, not implemented features or uniqueness claims.

### A. Linked sound-to-meter workspace

A line appears in synchronized layers: original text → selected pronunciation → syllables → weight tiles → feet → meter. Selecting a unit highlights its corresponding ranges and source/rule explanation in the other layers. Reveals proceed one layer at a time. Learners can inspect the reason for each transition.

### B. Syllable workbench

Learners insert/remove boundaries and label weights using clicks or keyboard controls. Dragging is optional. Original Unicode text remains untouched; boundaries are annotations. Accept reviewed alternative segmentations. On error, distinguish wrong reading, wrong boundary and wrong weight instead of showing a generic red cross.

### C. Controlled comparison

Compare two readings or one deliberate change side by side. Ask what changes and why. Constructed teaching examples and deliberately invalid mutations are clearly labelled; reviewers confirm that negative examples do not accidentally admit another valid analysis.

### D. Prediction before reveal

Ask learners to finish the next syllable or foot, commit an answer, then inspect the explanation. Do not expose the engine result or target meter early in independent identification exercises.

### E. Error clinic

Examples illustrate common misconceptions: counting letters, confusing vowel length with syllable weight, treating every boundary as a pause, forcing a join, or accepting a metrical repair that damages meaning. Feedback links directly to a corrective micro-lesson.

### F. Meter atlas explorer

Compare two forms with aligned patterns and clearly described differences. An optional filter by pattern/foot helps exploration without implying every combinatorial pattern is a valid meter. Each form links to introductory and advanced practice.

### G. Bridge to composing

“Use this meter” selects the existing studio meter via stable ID and an explicit action. “Try this example” opens a separate practice draft; never replace the active poem silently. Editor results link to the relevant meter/rule lesson, and learners can return to the same draft.

### H. Optional synchronized recordings

Use reviewed human recordings, at natural pace, with segmented replay and text highlighting. Audio is optional, never autoplayed, and every task has a visual/text equivalent. Record reading variant, speaker consent/license and segment alignment. Synthetic speech may be a labelled prototype, not the authority used to certify pronunciation. Recording quality and alignment need their own review. A waveform or tap-along is a listening aid, not an automatic weight detector.

## 8. Standard for every one of the 50 meter entries

Each entry needs:

- Stable existing meter ID, Urdu and English names, reviewed search aliases, family, exact form and applicable terminology.
- Canonical foot sequence, current `-` / `=` pattern, accessible verbal labels and a persistent symbol legend.
- Full source citation resolving catalog shorthand to edition/section/page or stable URL; record discrepancies rather than silently smoothing them over.
- At least one attributed, rights-cleared, fully explained positive example before calling the entry teaching-ready. Preserve original text separately from normalized analysis text.
- Pronunciation, syllable divisions, weights, feet and the reason for contextual rules, with permitted alternatives.
- Applicable licenses, terminal and caesura conditions, limitations and easily confused neighboring forms.
- A reviewed counterexample with a local explanation; clarify target mismatch versus invalidity across all supported meters.
- A guided exercise, an unseen practice item and links to prerequisite lessons.
- “Use this meter,” “Practise this form,” “Compare forms” and contextual editor links.
- Visible source/content review state, revision history and a way to report an issue locally/export a report. Sending a report requires an explicit user action.

All 50 entries should be discoverable from the first atlas release. Entries without reviewed teaching content show “catalog entry — lesson in preparation” and retain useful patterns/source references. Do not fabricate examples to fill a grid. Acceptance: 50 unique IDs, no orphaned engine forms and no unsupported new form introduced by page authoring.

The reference is broader than meters: include pronunciation rules, a linked Urdu/English glossary, rhyme/radif, poetic forms, literary devices and explanations of Likho's uncertainty and repair labels. Track each area separately so meter completion does not imply completion of the entire reference.

## 9. Content and exercise data model

Separate source content, editorial decisions and runtime results.

| Record | Required fields |
| --- | --- |
| Lesson | ID/version, locale, objective, prerequisites, ordered blocks, exercises, glossary/rule/meter links, accessibility alternatives, review state |
| Example | Exact original text, analysis text and explicit mapping, source/edition/location, attribution/rights, reading variants, syllable spans, weights, foot boundaries, applicable rules, uncertainty, review history |
| Exercise | ID/version, skill tags, prompt, input mode, accepted analyses, rejected analyses with reasons, hint ladder, explanations, assistance policy, source/example IDs |
| Meter article | Stable engine meter ID, family, explanations, example IDs, permitted conditions, citations, comparison/practice links, review state |
| Audio | File/version, reading-variant ID, speaker consent/license, transcript, aligned segment ranges, review status |
| Progress | Local schema version, lesson/exercise version, completed steps, attempts and assistance level, bookmarks; no private poem text by default |
| Review decision | Reviewer role, date, exact content version, scope, decision, evidence and unresolved issues |

Example states: draft → source-checked → poet-reviewed → subject-reviewed → teaching-ready. Roles may overlap but must be labelled accurately; owner review is not independent external adjudication. “Teaching-ready” requires explicit linguistic/content and teaching checks. A source citation or successful engine run alone cannot set it.

Annotation spans must use a documented Unicode indexing convention and survive Urdu combining marks. Validate mappings to the exact displayed text. Separate answer-key versions from engine versions. Versioned curriculum changes must not silently reset or reinterpret past progress.

## 10. Assessment and practice policy

- Placement check is optional; beginners may start directly and experienced users may jump to a topic.
- Assess skills separately: reading choice, segmentation, weighting, grouping, meter selection and explanation. A wrong early reading should not produce five unexplained downstream failures.
- Use reviewed answer sets with multiple acceptable paths. Diagnose an engine/key disagreement as a content issue, not automatically learner error.
- Suggested completion rule: complete a guided task and correctly solve two different unassisted transfer examples. This is a configurable initial policy to validate in a pilot, not a calibrated mastery threshold.
- Provide delayed review of previously learned skills, with a simple transparent schedule initially. Do not advertise adaptive intelligence before validating it.
- Keep assessment examples distinct from demonstrations; use different source lines and avoid repeated variants of the same line masquerading as transfer.
- Personal-poem practice is exploratory. Unknown or disputed readings remain unresolved and do not reduce a learner score.
- Capstones report demonstrated skills and areas to revisit, not scholarly certification.

## 11. Accessibility, language and preservation

Urdu-first RTL layouts with optional English explanations; preserve logical reading order in mixed-direction notation. Provide comfortable Nastaliq text and adjustable size/line spacing. Pattern rows may use a distinct readable font with explicit direction. Never use color as the only indicator of short/long or correct/incorrect.

Every drag, boundary edit, comparison and reveal needs keyboard and click/tap alternatives. Use labelled controls, visible focus, screen-reader descriptions of weights and feet, reduced-motion support and optional sound. Avoid timing-dependent grading. Long patterns need a usable narrow-screen layout, even if full mobile studio work remains deferred. Test actual assistive-technology behavior before calling the experience accessible.

Save progress locally with truthful error states, versioned export/import and explicit reset. Course progress failures must not touch poetry storage. Loading a lesson must never seed or overwrite a poem. If offline lessons are promised, verify app-shell restart, cached content completeness, optional recording availability and update behavior; a locally bundled dictionary is insufficient evidence.

## 12. Technical approach

Proposed modules: `reference` for navigation/articles, `learning` for lesson rendering/exercise state/progress, shared meter/rule adapters and versioned content under `src/data/learning` or a separately validated content directory. Final paths depend on implementation review.

- Reuse existing meter IDs and analysis services. Expose intermediate analysis layers through a typed adapter rather than duplicating scansion rules in components.
- Keep reviewed expected answers independent of live engine output; show discrepancies to maintainers in verification reports.
- Start with structured local content and a small set of reusable interaction types. A CMS, accounts, cloud synchronization and an AI tutor are not prerequisites.
- Lazy-load course chapters, audio and large reference content. Do not load all recordings when entering the studio.
- Explicitly separate practice workspace state, learning progress and real draft state.
- Support deep links and browser back/forward; preserve unsaved work across transitions.
- Validate references, prerequisites/cycles, answer structures, span mappings, source completeness and all 50 meter IDs during content checks.
- Reuse the existing export/recovery philosophy; no silent private-text collection or external submission.

## 13. Production workflow and content review

For each lesson: objective and misconception outline → source selection → exact example transcription → human analysis and alternatives → interaction storyboard → prototype → owner/poet review → subject review where available → beginner usability check → correction → release decision.

Keep a content inventory with one row per lesson, meter entry, rule and audio asset. Track owner, source readiness, rights, answer-key review, prototype, accessibility review and release status. Human review assignments and external recordings require actual availability; this plan invents no reviewers or completed sign-offs. External outreach remains deferred unless separately requested.

First source task: resolve the catalog's Handbook references precisely and audit which existing documents already preserve provenance. Research and rights checks are work to perform during authoring, not completed by this planning document. No content from competitors should be copied to satisfy the ambition.

## 14. Phased delivery and exit gates

| Phase | Deliverables | Exit gate |
| --- | --- | --- |
| A. Editorial blueprint | Curriculum map, terminology decisions, 50-ID inventory, example/review templates, initial source inventory | Dependencies and content gaps visible; no unsupported claims or invented approvals |
| B. Vertical prototype | Three connected lessons: sound/spelling distinction, syllable boundaries, first short/long classification; one complete meter article; return-to-editor flow | Learner can complete without drag/audio; real drafts remain unchanged; reviewed alternative answers accepted |
| C. Beginner pilot | Modules 0–3 (15 lessons), reviewed example pool, local progress and recovery | Novices can attempt unseen words; misconceptions and assistance usage recorded with consent; blocking issues corrected |
| D. Full-line course and atlas | Modules 4–8; all 50 discoverable entries, reviewed entry batches, comparisons and practice | Lessons cover their prerequisites; entries labelled by actual readiness; no engine/catalog drift |
| E. Compose and diagnose | Modules 9–11, error clinic, contextual studio links and capstones | Learner completes an unseen line/couplet and explains an edit; exact/partial/uncertain remain distinct |
| F. Release quality | Content revision, accessibility, broader browser checks, performance/offline verification, optional reviewed recordings | Published scope matches tested behavior and reviewed content; remaining gaps visible |

Do not commit to a calendar before timing the prototype's authoring, review, recording and learner testing. Expand in reviewed batches. The owner has deferred linguistic review and mobile work previously; this plan documents their place without claiming that review has resumed. Early interface prototypes may use conspicuously labelled draft content.

## 15. Quality measures

Evaluate learning and trust, not just lesson completion:

- Unassisted performance on unseen examples before/after a module, with sample counts and limitations.
- Ability to explain a boundary or weight decision and transfer it to a different word/line.
- Repeat misconceptions, requested hints, abandonment points and time-on-task; avoid unsupported mastery percentages.
- Acceptance of all reviewed valid alternatives and rejection/explanation of reviewed invalid paths.
- Complete source/rights/review fields for released teaching examples; coverage by module and meter form.
- No silent draft mutation or false progress-save success in tested failure paths.
- Keyboard completion, screen-reader comprehension, reduced-motion and audio-free completion of the prototype.
- Startup and interaction performance on named devices; measure before setting budgets.

Suggested formative pilot: recruit a small consenting mix of beginners and experienced poets when authorized. Observe how they reason, rather than coach them into finishing. A small pilot guides revisions and does not establish population-wide learning efficacy. Broader learning-effectiveness and competitive studies are separate future work.

## 16. Focused verification plan

When implementation starts, add meaningful checks for content validation, accepted alternative analyses, feedback classification, hint/reveal transitions, versioned progress, failed writes and safe editor handoff. Browser acceptance should follow one complete beginner path and one independent capstone; include keyboard-only operation and returning to an unchanged existing poem. Regression-check the existing prosody and draft-safety contracts after shared-service changes.

Content review must inspect actual rendered Urdu, annotations, symbols and audio alignment. Passing software tests cannot certify the teaching answer key. Cross-browser and narrow-screen checks belong to release verification; they are not established by existing desktop tests.

## 17. Explicitly deferred or out of scope for the first version

- Claims of unprecedented novelty, universal prosodic coverage or superiority over existing services.
- Public accuracy/learning claims without suitable evaluation.
- AI-generated answers used as the grading authority, automatic speech-based pronunciation scoring and unreviewed synthetic audio as instruction authority.
- Accounts, leaderboards, paid certification, teacher classrooms and cloud progress synchronization.
- Mandatory memorization of all 50 forms, competitive timers or gamification that punishes uncertainty.
- Automatic publication, recruitment/outreach, commit, push or deployment.

## 18. Recommended next action

Begin Phase A and then build the three-lesson vertical prototype. The first milestone is a learner who can explain the difference between spelling, pronunciation, syllable boundaries and weight, then complete a new short/long task without seeing the answer first. Pair that experience with one excellent meter article before scaling the content to all 50 forms.

Open decisions to resolve during Phase A: final Urdu labels, optional English depth, first prototype examples, availability of content reviewers and human recordings, and the initial teaching-form sequence. None blocks documenting the full plan; reviewed examples are required before graded teaching content ships.
