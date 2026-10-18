# Week 2 TDD Evidence Log

> Fill this file only with test commands and results that were actually observed. Do not claim a test failed or passed without a recorded run.
>
> Provenance rules applied in this revision (final review, 2026-10-19):
> - "Previously observed" = results reported in earlier sessions (REVIEW-FIX-01 / REVIEW-FIX-01B, as recorded in `docs/plans/week-2/timeline.md`). They were not re-run backwards in time and are not claimed to have been re-run now.
> - "Run during final review" = commands executed on 2026-10-19 against the current worktree. They prove the current state only; they do not retroactively prove any past Red state.
> - A missing-module/import failure is not accepted as evidence that a required business behavior was failing.

## Accepted behavior-level cycle — Storage record validation (REVIEW-FIX-01)

This is the cycle accepted as genuine Red → Green → Refactor evidence. The Red state is recorded at the behavior level because no verbatim jest excerpt of the failing run was captured at the time; nothing below claims a rerun of that Red state.

### Red — failing test first (previously observed)
- Behavior under test: `readTickets` must reject a tickets file whose records are invalid (non-array root, `null`/empty object records, invalid `status`/`priority` enum values, non-string tags, missing or wrong-typed required fields), and neither `readTickets` nor `TicketService.createTicket` may overwrite the invalid file.
- Test file/name: `src/storage/storage.test.ts` (`describe('Storage record validation')`)
- Command executed (previously): focused run of `src/storage/storage.test.ts` via `npm test`
- Observed failing result (previously reported, behavior level — verbatim jest excerpt was not recorded at the time): the focused storage tests failed because invalid ticket records were not rejected; `readTickets` only checked that the root value was an array and returned records without schema validation.

### Green — minimum implementation (previously observed)
- Production file(s) changed: `src/storage/storage.ts`
- Minimal behavior implemented: schema validation of every record (`collectRecordErrors` + `assertValidTickets`) invoked from `readTickets`, throwing `Invalid ticket data in tickets file (...)` with per-field messages; invalid files are left untouched.
- Command executed (previously): `npm test` after the change
- Observed passing result (previously reported in `timeline.md` at REVIEW-FIX-01, marked there as reported by OpenCode and not independently re-run by the reviewer at that time):
  ```
  Tests: 26 passed, 26 total   (5 test suites)
  TypeScript build: PASS, 0 compilation errors
  ```

### Refactor — improve structure without changing behavior (previously observed)
- Refactor performed: exported the enum value lists `VALID_STATUSES` and `VALID_PRIORITIES` from `src/domain/ticket.ts` (previously module-local `const`s) and reused them in `src/storage/storage.ts` instead of duplicated literals.
- Command executed after refactor (previously): focused storage suite via `npm test`
- Observed passing result (previously observed): the focused storage test suite remained green.
- Corroborating repository evidence (verified during final review, 2026-10-19 — a git inspection, not a test rerun): commit `9ee99a8` contains exactly this set of changes — `src/storage/storage.test.ts` added, schema validation added in `src/storage/storage.ts`, and `VALID_STATUSES`/`VALID_PRIORITIES` changed from local to exported in `src/domain/ticket.ts`.

## Previously recorded cycle 1 — Ticket domain validation (NOT accepted as behavior-level Red evidence)

Reviewer annotation (2026-10-19): the Red step below is a missing-module failure (`Cannot find module './ticket'`). It shows the module did not exist yet; it does not demonstrate that a required business behavior was failing. Retained for history only. The storage validation cycle above is the accepted evidence.

### Red — failing test first (previously recorded)
- Behavior under test: Ticket validation requiring a non-empty title and valid status/priority.
- Test file/name: `src/domain/ticket.test.ts`
- Command executed: `npm test`
- Observed failing result (short excerpt, as previously recorded):
  ```
  FAIL src/domain/ticket.test.ts
  Cannot find module './ticket' or its corresponding type declarations.
  ```
- Insufficiency: missing-module/import failure only; not a behavior-level failure.

### Green — minimum implementation (previously recorded)
- Production file(s) changed: `src/domain/ticket.ts`
- Minimal behavior implemented: `validateTicket` function checking title, status (`open`, `in_progress`, `resolved`, `closed`), priority (`low`, `medium`, `high`, `urgent`), and tags.
- Command executed: `npm test`
- Observed passing result (previously recorded):
  ```
  PASS src/domain/ticket.test.ts
  Tests: 5 passed, 5 total
  ```

### Refactor — improve structure without changing behavior (previously recorded)
- Refactor performed (or why none was needed): Cleaned up union types and validation error messages.
- Command executed after refactor: `npm test`
- Observed passing result: `PASS src/domain/ticket.test.ts`
- What I reviewed manually: Type safety and clear error messages.

## Previously recorded additional cycles (Red output not recorded verbatim)

Reviewer annotation (2026-10-19): the summaries below were recorded earlier without command excerpts or test counts for the Red runs. They are retained as unverified summaries, not as counted evidence.

### Cycle 2 — JSON Storage & Service (TASK-03)
- **Red:** `src/services/ticketService.test.ts` failed due to missing `TicketService` implementation and missing corrupted-file protection.
- **Green:** Implemented `TicketService` in `src/services/ticketService.ts` and `readTickets`/`writeTickets` in `src/storage/storage.ts`.
- **Result:** Tests passed successfully (`PASS src/services/ticketService.test.ts`).

### Cycle 3 — CLI Commands & Failure Paths (TASK-04 to TASK-06)
- **Red:** `src/cli.test.ts` failed when executing `create`, `list`, `show`, `update`, and corrupted JSON checks before Commander command routing was implemented.
- **Green:** Implemented Commander commands in `src/cli.ts` with proper error handling and non-zero exit codes.
- **Result:** All CLI integration and failure tests passed (`PASS src/cli.test.ts`).

## Test coverage summary

Current-state results below come from the run during final review (2026-10-19); see the verification section for exact output. Historical REVIEW-FIX-01 figure was 26/26 across 5 suites (previously reported); suite count dropped to 4 and test count rose to 39 after legacy duplicate files (`src/ticketService.test.ts`, `src/storage.ts`) were removed in commit `9dc31d6` and additional CLI/service tests were added.

| Area | Tests present | Command/result (run 2026-10-19) | Remaining gaps |
|---|---|---|---|
| Ticket model and validation | Yes (`src/domain/ticket.test.ts`) | `npm test` (PASS) | None |
| Ticket service | Yes (`src/services/ticketService.test.ts`) | `npm test` (PASS) | None |
| JSON storage record validation | Yes (`src/storage/storage.test.ts`, 13 tests) | `npx jest src/storage/storage.test.ts` (13 passed, 13 total) | None |
| CLI create/list/filter | Yes (`src/cli.test.ts`) | `npm test` (PASS) | None |
| CLI show/update | Yes (`src/cli.test.ts`) | `npm test` (PASS) | None |
| Missing/corrupted JSON | Yes (`src/cli.test.ts`, `ticketService.test.ts`) | `npm test` (PASS) | None |
| Invalid input/not found | Yes (`src/cli.test.ts`, `ticketService.test.ts`) | `npm test` (PASS) | None |

## AI-assisted validation evidence

- Which AI-generated suggestion was reviewed? TDD structure and Commander command layout.
- What did I independently inspect or challenge? Corrupted JSON handling (ensuring storage does not overwrite corrupt files with empty arrays).
- What test or reproduction validated the behavior? `should throw error on corrupted JSON data file without overwriting`.
- What did I change after review and why? Added explicit error handling in `storage.ts` to rethrow parse syntax errors with clear messages.
- Were any unsupported assumptions or hallucinations identified? None at that time. Later review (this document's revision) identified that the originally logged Cycle 1 Red was a missing-module failure and was not behavior-level evidence; corrected above.

## Final reviewer note

### Previously observed (reported, not re-run at report time)
- REVIEW-FIX-01 report (`timeline.md`): `npm test` — 26 passed / 26 total across 5 suites; TypeScript build PASS with 0 compilation errors. Recorded there as reported by OpenCode, not independently re-run by the reviewer.

### Run during final review (2026-10-19, current worktree)
- `npm test` (from `week-2/ticket-manager`): `Test Suites: 4 passed, 4 total; Tests: 39 passed, 39 total`
- `npx jest src/storage/storage.test.ts`: `Test Suites: 1 passed, 1 total; Tests: 13 passed, 13 total`
- `npm run build` (`tsc`): exit 0, no diagnostics
- `git diff --check` (repository root): no whitespace errors (only `docs/plans/week-2/timeline.md` is modified, preserved as user changes)

### Known limitations
- The historical Red run of the storage validation cycle was never captured verbatim; the Red step is recorded at the behavior level and corroborated by commit contents, not by a replayed failing run.
- Local JSON storage (single-user file storage without concurrency locking).
