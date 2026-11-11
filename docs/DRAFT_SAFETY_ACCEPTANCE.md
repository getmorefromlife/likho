# Draft safety: LKH-001 / LKH-002 / LKH-003 acceptance specification

Proposed 29 October 2026. Executed against the working tree on 29 October 2026; see [Observed results](#observed-results-29-october-2026).

## Contract

A read must not modify poems, titles, authors or preferences. Stored valid content is authoritative. The sample is seeded only when the drafts key is absent, never when the key contains an empty list or unreadable data. Restoring a specimen is a separate explicit action and must not replace an existing edited draft.

Removing the content-based repair and broad title replacements is preferred over a typo migration: user text cannot safely be classified as a typo from a substring. Future genuine format migrations need a schema/version contract and recovery safeguards.

## Test isolation and evidence

Use a fresh Playwright context per independent case. Use original fixtures, including unique sentinel text that never appears in the specimen. Interact through the UI; inspect real browser localStorage for persistence assertions. Do not invoke the storage service from a test to bypass the save path.

Poll for the actual serialized revision after the 1.2-second debounce rather than treating an arbitrary delay as proof of saving. Bound the wait, record the serialized value on failure, then reload and assert the same text without re-filling the input. Force a subsequent normal render and read to expose destructive read-side effects. Keep snapshots of initial, edited and persisted content in test failure attachments. Never run against the user's browser profile.

Run reproductions against the current implementation before fixes; keep failure evidence for the affected cases. The normal-draft and non-first-line cases may already pass and serve as controls. Failure-injection cases may expose additional defects independently.

## Required cases

| Case | Setup/action | Required observation |
| --- | --- | --- |
| S1 Sample first line | Edit first line so the original marker is absent; edit title and poet too; wait for actual persistence, trigger another render, reload | New line/title/poet survive in storage and UI; no specimen rewrite |
| S2 Sample later line | Keep first line, edit a later line | Later-line edit survives autosave and reload |
| S3 Ordinary draft | Create a normal draft, change first/later lines and metadata | Correct draft ID/content survive autosave, selection and reload |
| S4 Empty portfolio | Delete all drafts, then reload | Empty persisted portfolio stays empty; opening a new untitled editor does not silently resurrect the specimen |
| S5 Exact spelling | Use a title containing `نازہ` in sample and ordinary drafts | Exact spelling survives read, save, open and reload |
| S6 Failed save | Seed an existing draft; inject a drafts-key `setItem` failure using `QuotaExceededError`, then separately a generic storage error; edit in UI | Text remains in memory, status never says saved for that revision, old stored value remains intact, copy/export escape hatch is usable |
| S7 Retry | After S6 restore writes and explicitly retry | Current revision commits and status changes to saved only after success |
| S8 Unreadable JSON | Seed the original drafts key with malformed JSON before app load | No sample is written over it; exact raw value remains recoverable; visible recovery state and export/download route exist |
| S9 Invalid shape | Seed valid JSON with wrong draft/member types and mixed valid/invalid records | Clear validation/recovery result; no silent overwrite, coercion or false recovered specimen |
| S10 Recovery write failure | With unreadable data, deny recovery-key writes too | Original remains untouched; unsafe ordinary writes are blocked; raw export/copy remains available where reads work |
| S11 Malformed backup | Import wrong version/type, invalid draft fields and invalid preferences | Reject before any mutation; compare all affected keys before/after and after reload |
| S12 Valid restore | Import a valid backup under an explicit merge/replace policy | Complete intended state is restored; preserve previous data for recovery before replacement; failure cannot silently leave an accepted partial result |
| S13 Leaving with dirty text | Make an edit before autosave; attempt navigation | Supported desktop browser gets an unsaved-change guard after user activation; saved state does not produce a spurious guard |
| S14 Save ordering | Edit A then B around the debounce/save completion boundary | A's completion cannot mark B saved; final stored content equals B |
| S15 Failed proposal writes | Deny real IndexedDB commits/abort transactions on save and deletion | Save says session-only where the in-memory reading is retained; deletion says removed for this session but not durably deleted; reload restores only what actually committed |

Failure injection must target the relevant storage operation, not break all browser APIs indiscriminately. IndexedDB tests should use real transactions with controlled abort/failure behavior. Existing mock hydration tests remain a separate layer.

## Proposed persistence state contract

- `idle`: no edited revision needing a write; not proof of a successful save.
- `dirty`: text differs from the last committed revision, including the debounce window.
- `saving`: a particular revision is being written.
- `saved`: that exact current revision committed successfully.
- `session-only`: current data remains in memory but durable storage failed or is unavailable.
- `failed`: requested operation failed; describe whether previous data or a session-only change remains.

The editor owns current and committed revision IDs. Navbar and portfolio consume the real state; they must not default to saved. Lexicon operations expose their own persistence outcomes rather than borrowing the poem's state. Retrying, switching drafts and undo must preserve these distinctions.

A failed durable deletion is especially important: the entry can be absent for the current session yet reappear after reload. Say so. A successful in-memory proposal does not justify “permanently saved.”

## Recovery and backup decisions before implementation

1. Specify draft/member validation and versioned backup shape before accepting external files. Preserve original Unicode and metadata; reject malformed required fields instead of guessing replacements.
2. Define merge versus replace behavior and collision handling. Show a concrete preview and make destructive replacement explicit.
3. Preserve the exact old payload before a destructive migration/restore. If recovery cannot be written, stop replacement and offer export.
4. localStorage has no multi-key transaction. Either stage and commit a versioned whole-workspace snapshot under one canonical key, or implement a tested journal/rollback strategy. Do not call several independent writes atomic.
5. Keep unreadable originals and failure messages accessible. A sample or empty editor may be offered as a new session, but must not be labelled recovered work or overwrite the damaged store.
6. Define the supported leave-warning behavior. `beforeunload` is best effort, not a crash-recovery or autosave guarantee.

## Implementation order and exit gates

1. Capture current failures and control passes (LKH-001).
2. Remove read-time mutation, enforce absent/empty/corrupt distinctions and preserve exact title text (LKH-002).
3. Implement recovery safeguards, validated backups and actual persistence states (LKH-003).
4. Strengthen the lexicon E2E test or add a separate persistence fixture so re-filling after reload cannot mask lost poem text. Keep its original lexicon-acceptance purpose distinct.
5. Run the 66-check service suite, build, existing lexicon acceptance and all new draft-safety cases. Report observed failures and untested browser/storage cases explicitly.

CI is a subsequent delivery step: origin already points to GitHub. Review the intended source snapshot, choose the workflow and obtain authorization before committing/pushing; do not sweep the entire untracked working tree into a commit. This specification does not authorize those actions.

## Observed results (29 October 2026)

Executed from the existing working tree. No commit, push or hosted-CI run was performed.

| Command | Observed result |
| --- | --- |
| `DRAFT_SAFETY_STRICT=1 npm run test:draft-safety` | **18/18 passed** (S1–S17, with S6 split into quota and generic write failures) |
| `npm run test:storage` | **14 checks passed** |
| `npm run test:prosody` | **66 checks passed** |
| `npm run build` | TypeScript and Vite production build passed |
| `npm run test:e2e` | **19/19 passed** (18 draft-safety cases plus the lexicon acceptance scenario) |

No expected-failure annotations remain in the draft-safety suite.

Implemented and exercised:

- Truthful poem save states (`idle`, `dirty`, `saving`, `saved`, `session-only`, `failed`), revision tracking, explicit retry, and a recovery banner for corrupt/unavailable storage with raw copy/download.
- Validated versioned backups with explicit replace policy, duplicate-ID rejection, preference validation, a recovery copy of the previous payload, and rollback/reporting when a later write fails.
- Best-effort `beforeunload` warning while an edited revision is uncommitted.
- Proposal save/delete messages that distinguish durable commits from session-only changes; the aborted-IndexedDB test covers both save and delete.
- Active-draft deletion cancels its pending autosave and moves the editor to another draft or a pristine blank editor.
- Active-draft identity is persisted and restored after reload; a missing/deleted identity falls back to the first draft or a blank editor.

Remaining limits and untested areas:

- Browser evidence is desktop Chromium only, using a fresh context per case and real `localStorage`/IndexedDB. Firefox, WebKit, mobile layout and the user's real browser profile are not covered.
- `beforeunload` is a best-effort warning, not a crash-recovery or save guarantee. The S13 assertion depends on desktop Chromium showing the dialog after the test interaction; other engines may suppress it.
- A failed durable proposal deletion is reported as session-only and may reappear after reload; this is described in the UI but is not a durable rollback mechanism.
- localStorage still has no multi-key transaction. Restore uses a recovery snapshot plus rollback, and reports a partial result if rollback also fails; it does not make several writes atomic.
- The recovery banner exposes the raw payload. It does not attempt an automatic repair or reinterpretation of unreadable data.
