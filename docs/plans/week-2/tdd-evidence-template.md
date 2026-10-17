# Week 2 TDD Evidence Log

> Fill this file only with test commands and results that were actually observed. Do not claim a test failed or passed without a recorded run.

## Cycle 1 — Ticket validation or create behavior

### Red — failing test first
- Behavior under test: Ticket validation requiring a non-empty title and valid status/priority.
- Test file/name: `src/domain/ticket.test.ts`
- Command executed: `npm test`
- Observed failing result (short excerpt):
  ```
  FAIL src/domain/ticket.test.ts
  Cannot find module './ticket' or its corresponding type declarations.
  ```
- Why the failure proves the test is exercising the intended behavior: The test failed because the domain module and validation function had not yet been implemented.

### Green — minimum implementation
- Production file(s) changed: `src/domain/ticket.ts`
- Minimal behavior implemented: `validateTicket` function checking title, status (`open`, `in_progress`, `resolved`, `closed`), priority (`low`, `medium`, `high`, `urgent`), and tags.
- Command executed: `npm test`
- Observed passing result:
  ```
  PASS src/domain/ticket.test.ts
  Tests: 5 passed, 5 total
  ```

### Refactor — improve structure without changing behavior
- Refactor performed (or why none was needed): Cleaned up union types and validation error messages.
- Command executed after refactor: `npm test`
- Observed passing result: `PASS src/domain/ticket.test.ts`
- What I reviewed manually: Type safety and clear error messages.

## Additional cycles

### Cycle 2 — JSON Storage & Service (TASK-03)
- **Red:** `src/services/ticketService.test.ts` failed due to missing `TicketService` implementation and missing corrupted-file protection.
- **Green:** Implemented `TicketService` in `src/services/ticketService.ts` and `readTickets`/`writeTickets` in `src/storage/storage.ts`.
- **Result:** Tests passed successfully (`PASS src/services/ticketService.test.ts`).

### Cycle 3 — CLI Commands & Failure Paths (TASK-04 to TASK-06)
- **Red:** `src/cli.test.ts` failed when executing `create`, `list`, `show`, `update`, and corrupted JSON checks before Commander command routing was implemented.
- **Green:** Implemented Commander commands in `src/cli.ts` with proper error handling and non-zero exit codes.
- **Result:** All CLI integration and failure tests passed (`PASS src/cli.test.ts`).

## Test coverage summary

| Area | Tests present | Command/result | Remaining gaps |
|---|---|---|---|
| Ticket model and validation | Yes (`src/domain/ticket.test.ts`) | `npm test` (PASS) | None |
| Ticket service | Yes (`src/services/ticketService.test.ts`) | `npm test` (PASS) | None |
| JSON storage | Yes (`src/services/ticketService.test.ts`) | `npm test` (PASS) | None |
| CLI create/list/filter | Yes (`src/cli.test.ts`) | `npm test` (PASS) | None |
| CLI show/update | Yes (`src/cli.test.ts`) | `npm test` (PASS) | None |
| Missing/corrupted JSON | Yes (`src/cli.test.ts`, `ticketService.test.ts`) | `npm test` (PASS) | None |
| Invalid input/not found | Yes (`src/cli.test.ts`, `ticketService.test.ts`) | `npm test` (PASS) | None |

## AI-assisted validation evidence

- Which AI-generated suggestion was reviewed? TDD structure and Commander command layout.
- What did I independently inspect or challenge? Corrupted JSON handling (ensuring storage does not overwrite corrupt files with empty arrays).
- What test or reproduction validated the behavior? `should throw error on corrupted JSON data file without overwriting`.
- What did I change after review and why? Added explicit error handling in `storage.ts` to rethrow parse syntax errors with clear messages.
- Were any unsupported assumptions or hallucinations identified? None.

## Final reviewer note

- Commands actually run: `npm test`, `npm run build`
- Passing tests/build checks: All test suites (4 suites, 15 tests) passed; TypeScript compilation (`tsc`) passed with 0 errors.
- Failed/blocked checks: None.
- Known limitations: Local JSON storage (single-user file storage without concurrency locking).

