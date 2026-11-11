# Likho — instructions for coding agents

Applies to every task in this repository. Read this file before editing. Follow it alongside higher-priority platform instructions and the user's current explicit directions. If a requested change conflicts with these rules, explain the conflict and resolve it with the user; do not silently ignore a requirement. Do not promise that a file can enforce compliance by every external agent.

## 1. Establish the current state

- Read `docs/NEXT_STEPS.md` for current priorities and the lesson-one prototype status. Read the full linked reference/tutorial plan before learning-area work. Roadmaps provide context, not authorization to expand the user's task.
- Read `DEVELOPMENT_STATUS.md` and the relevant source before changing behavior. Consult `PROSODY_REPAIR.md` for analysis/repair changes and `docs/REFERENCE_GUIDE_AND_INTERACTIVE_TAQTI_PLAN.md` for learning/reference work.
- Inspect the working tree. Preserve existing user changes and unfinished work; do not reset, discard, overwrite or clean them without explicit authorization.
- Treat source and observed checks as current evidence. Older plans can describe already-fixed issues. Distinguish implemented, proposed, tested and deployed behavior.
- Keep changes focused. Do not add dependencies, architecture, cloud services or broad refactors without a concrete task need. Do not delegate to other agents unless the user or applicable instructions request it.

## 2. Protect the poet's work

- Never silently replace poem text, title, punctuation, spacing, selected readings or draft identity. Loading a view, lesson or example must not overwrite an existing poem.
- Preserve pure storage reads, revision-aware save states and truthful failure feedback. Never claim “saved” when durability failed.
- Preserve corrupt originals and recovery/export access. Do not reinterpret damaged storage as an empty portfolio or reseed examples over user work.
- Validate backup/import payloads before mutation; preserve recovery and rollback behavior. Keep personal pronunciation provenance and approval state intact.
- Keep course progress and practice state separate from real drafts. Do not collect or transmit private writing without explicit authorization.
- Text-changing suggestions require an explicit apply action; preserve existing undo and recovery behavior.

## 3. Maintain Urdu interface quality

- Preserve Urdu-first RTL layout and correct mixed-direction rendering of names, numbers and metrical symbols.
- Reuse current theme variables, fonts, components and interaction conventions. Support the existing themes; avoid isolated hard-coded color schemes.
- Keep Nastaliq line height and padding sufficient for marks and descenders. Check wrapping, clipping, long words and narrow panes.
- Preserve phonetic typing, caret/selection behavior, shortcuts, native copy/paste and ordinary click behavior when adding selection or dragging.
- Use clear, reviewed Urdu labels where possible; do not expose internal implementation terminology in ordinary product flows.
- Every new interaction must support keyboard operation, visible focus and clear labels. Do not rely on dragging, color, motion or audio alone. Respect reduced motion.
- Preserve the current desktop experience. Mobile expansion is deferred unless requested; avoid introducing new narrow-screen breakage. Do not claim untested browser/device support.

## 4. Preserve prosodic integrity

- Reuse the shared meter catalog and analysis path. The 50 catalog entries are named forms, not automatically 50 distinct بحور. Use stable meter IDs; do not maintain competing pattern tables.
- Do not invent weights from spelling length, force pronunciation to fit a target, bypass analysis for recognized verses or broaden licenses without evidence and counterexamples.
- Keep unknown/disputed readings visibly unresolved. Preserve the distinction between source-attested, personally approved and independently reviewed evidence.
- Unresolved or unreviewed readings must not enable automatic repair. Rescan the whole proposed line in the pinned target before offering a metrical improvement.
- Preserve exact-versus-partial repair labels. Meter fit does not prove meaning, grammar, rhyme or literary quality.
- Do not present spelling-based rhyme heuristics as complete classical rhyme validation.
- Retain upstream attribution, licensing, source IDs and editable-source delivery obligations. Do not silently replace disputed lexical evidence.

## 5. Reference and tutorial standards

- Follow the documented curriculum; clearly label prototypes and incomplete entries. Do not imply that the basic lesson-one demo implements the full course.
- Teach spelling, pronunciation, syllables, weights and feet as distinct layers. Metrical weight is not simply elapsed sound duration or stress.
- Preserve exact example text, sources, rights, accepted alternatives and review status. Label constructed examples and negative mutations.
- A passing engine result is not an independently validated answer key. Accept reviewed alternative analyses; do not mark a learner wrong merely because the engine differs.
- Keep reveal/hint feedback explanatory. Independent exercises should not expose answers first. All tasks need an audio-free and drag-free path.
- All 50 forms belong in the planned atlas; incomplete teaching content must be labelled honestly rather than fabricated.
- Owner/poet review is valuable and must be labelled accurately. Never invent reviewers, approvals, adjudication, review times or certification.

## 6. Verify proportionately before handoff

- Run `npm run build` for code changes. For documentation-only work, check changed-file formatting and links; a full build is unnecessary.
- For phonology, meter or repair changes, run `npm run test:prosody`; for benchmark/schema/source-pin changes, run `npm run test:benchmark` and `npm run validate:benchmark`.
- For storage changes, run `npm run test:storage` and relevant browser draft-safety scenarios (`npm run test:draft-safety`). Keep failure/recovery paths covered.
- For meaningful editor, selection, persistence or interaction changes, run relevant Playwright cases from `npm run test:e2e`. Inspect rendered UI when layout/typography changes; build success alone does not verify appearance.
- Add regression tests for substantive bugs and risky behavior, not tests that simply mirror trivial implementation. Broaden checks when shared behavior changes.
- Check the diff for accidental edits, generated artifacts, whitespace and sensitive data. Do not hide warnings by raising thresholds or weaken tests to obtain a pass.
- Report commands actually run, results and material gaps. Never reuse historical counts as fresh results. If a check cannot run, state why and what remains unverified.

## 7. Keep continuity and authorization clear

- For substantial work, update `DEVELOPMENT_STATUS.md` and the relevant feature document with what changed, verification and remaining limitations. For a small demo/fix, a concise handoff is enough unless documentation would otherwise become misleading.
- Leave a self-contained handoff: outcome, files changed, how to try it, checks run and remaining work. Identify unrelated pre-existing failures separately.
- Do not claim production deployment, universal accuracy, complete offline operation, competitor superiority or unprecedented novelty without appropriate evidence.
- Preserve the owner's deferred review/mobile decisions until current instructions change them. Planning a review does not mean it happened.
- Commits, pushes, deployments, publication, external outreach, hiring and sharing private material require explicit authorization in the current task or existing conversation. Do not infer authorization from a roadmap.
- Never include secrets, personal signing material, browser-profile data or private poem text in logs, fixtures or commits.

## Completion checklist

Before handing back work, confirm: requested scope is complete; existing work is preserved; poems and provenance are safe; Urdu layout and accessibility are considered; relevant checks pass or gaps are disclosed; documentation and claims match the actual state. If something remains incomplete, say so plainly.
