# Week 2 Tasks — Ticket Manager CLI

## Working rules

1. `overview.md` is the acceptance source of truth; `architecture.md` describes the intended boundaries.
2. Execute one task at a time. The developer reviews the plan, diff, and test output before approving the next task.
3. Follow TDD for each behavior: write a focused failing test, run it to confirm failure, implement the minimum code, rerun to pass, then refactor and rerun.
4. Do not claim a Red step happened unless the command was actually run and its failing result was observed.
5. Do not modify unrelated slides, Week 1/3/4/5 plans, the root Slidev setup, or root lockfiles without explaining why and receiving approval.
6. Keep code straightforward; no database, UI, Docker, authentication, or KB API work.

## Global Sys Admin / DevOps check

Expected environment: a compatible Node.js runtime, the repository's package manager, and permission to install project-local development dependencies. No cloud account, production credential, admin permission, API key, or external service is required for Week 2. If package installation is blocked by proxy/network policy, or a machine-level runtime upgrade is needed, stop and report the exact blocker rather than changing global configuration.

---

## TASK-00 — Audit the spec and agree the implementation contract

**Outcome:** A short, reviewable plan that reconciles the Week 2 overview with repository rules and identifies unspecified behavior before code changes.

**Where to start:** Read `slides.md`, `.cursor/rules/overview.mdc`, `docs/plans/week-2/overview.md`, `docs/plans/week-2/architecture.md`, `docs/plans/week-3/overview.md`, `docs/plans/week-3/architecture.md`, `docs/plans/week-3/tasks.md`, root `package.json`, and inspect for an existing CLI implementation.

**What key points to learn:** Requirements vs assumptions; Ticket fields; command syntax; allowed status/priority values; unit vs integration coverage; safe storage behavior.

**What plan to follow:** Inspect only, make no code changes, list decisions not defined by the source docs, recommend the smallest defaults, and wait for developer approval.

**How to troubleshoot:** If a document is missing or conflicts with another, quote the exact paths and explain the conflict. Do not invent a requirement to hide the gap.

**Sys Admin / DevOps collaboration:** None expected. Ask for help only if the repository or package manager cannot be read due to filesystem/access restrictions.

**Acceptance:** Developer has explicitly approved or corrected the implementation decisions. No code changes were made during this task.

## TASK-01 — Scaffold an isolated, testable CLI package

**Outcome:** A minimal TypeScript/Commander/Jest package that can run a test and build without breaking the Slidev site.

**Where to start:** Reuse the location found in TASK-00 if an existing CLI already exists; otherwise use `apps/ticket-manager/`.

**What key points to learn:** TypeScript entry points, executable CLI entry, Commander command registration, test runner setup, package-manager isolation.

**What plan to follow:** Create only the package configuration, a minimal CLI entry/health or help behavior, a minimal test, and package-local README notes if needed. Run the new package's test and build scripts.

**How to troubleshoot:** If Jest + TypeScript + ESM configuration fails, inspect actual package/runtime versions, reproduce the smallest failure, and propose the least-complex compatible configuration. Do not replace Jest silently.

**Sys Admin / DevOps collaboration:** No production permissions. Project-local dependency installation may be needed. Stop if system-level changes or credentials are requested.

**Acceptance:** The CLI package test command passes; build/type-check passes; `--help` or equivalent gives a useful response; root Slidev files and commands remain unchanged.

## TASK-02 — Define Ticket domain and validation using TDD

**Outcome:** A Ticket model and focused tests for the approved validation rules.

**Where to start:** Approved contract from TASK-00 and the six required fields in `overview.md`.

**What key points to learn:** Domain invariants, boundary tests, good assertions, deterministic tests.

**What plan to follow:** Add one behavior test at a time, demonstrate Red, implement minimal validation, demonstrate Green, then refactor. Include valid and invalid values for required fields and the approved status/priority values.

**How to troubleshoot:** When a test fails, decide whether the test, the contract, or the implementation is wrong. Do not weaken assertions merely to make them pass.

**Sys Admin / DevOps collaboration:** None expected.

**Acceptance:** Ticket fields and validation match the approved contract; unit tests pass; no filesystem or CLI framework is required for domain tests.

## TASK-03 — Implement JSON storage and ticket service

**Outcome:** Ticket data can be created, loaded, listed, filtered, shown, and status-updated through a service backed by JSON storage.

**Where to start:** Approved storage semantics and the domain/service boundaries in `architecture.md`.

**What key points to learn:** Separation of business logic from persistence, safe file operations, test isolation, corrupted-data handling.

**What plan to follow:** Test storage/service behavior using a temporary data file; implement the smallest storage and service behavior needed; preserve data on parse/shape errors; avoid connecting to CLI before service behavior is testable.

**How to troubleshoot:** For flaky tests or leaked data, ensure every test uses a fresh temporary directory/file and cleans up. If atomic writes are added, justify why they are needed for this small local CLI.

**Sys Admin / DevOps collaboration:** None expected. No cloud resources or database should be provisioned.

**Acceptance:** Service and storage unit/integration tests pass; missing/corrupted-file behavior matches the approved contract; repeated runs persist data correctly.

## TASK-04 — Deliver create/list/filter CLI commands

**Outcome:** Users can create tickets and list all tickets or filter by approved status, priority, and tags.

**Where to start:** Approved command/flag contract from TASK-00 and working service from TASK-03.

**What key points to learn:** CLI input parsing, exit codes, useful error messages, integration tests of actual command behavior.

**What plan to follow:** Write CLI integration tests first; implement `create`; then `list`; add one filter at a time. Keep command handlers thin and delegate business logic to the service.

**How to troubleshoot:** If CLI tests are coupled to exact formatting, assert meaningful values and exit status rather than brittle full-output snapshots. Re-check Commander parsing before changing business logic.

**Sys Admin / DevOps collaboration:** None expected. Do not add global CLI installations without approval.

**Acceptance:** Create/list/filter commands work end-to-end with isolated JSON data and have integration test coverage.

## TASK-05 — Deliver show/update CLI commands

**Outcome:** Users can inspect an existing ticket by ID and update its status.

**Where to start:** Existing service and CLI integration patterns; do not duplicate domain rules in commands.

**What key points to learn:** ID-based lookup, state validation, not-found behavior, persistence after update.

**What plan to follow:** Write test for showing an existing ticket, then missing ID; write tests for a valid status update, invalid status, and missing ID; implement the minimum command behavior and run tests after each slice.

**How to troubleshoot:** If a command succeeds but data is not retained, trace the service → storage path before rewriting CLI code. Verify update changes status only, as required by Week 2.

**Sys Admin / DevOps collaboration:** None expected.

**Acceptance:** `show` and `update` work against persisted tickets; invalid status and unknown ID fail clearly; unit and integration tests pass.

## TASK-06 — Complete failure-path coverage and refactor

**Outcome:** The tool behaves predictably for the required error cases and code remains understandable.

**Where to start:** Week 2 acceptance criteria and current test coverage/report.

**What key points to learn:** Negative testing, error boundaries, regression testing, refactoring without changing behavior.

**What plan to follow:** Audit coverage for invalid inputs, missing ticket, missing JSON, corrupted/invalid JSON, storage failures where practical, and CLI exit codes. Add missing tests, make minimal fixes, refactor only with the full suite green, then rerun all checks.

**How to troubleshoot:** Classify each failure by layer (parser, domain, service, storage, output). Avoid catch-all handlers that silently discard errors or turn corrupted data into an empty store.

**Sys Admin / DevOps collaboration:** No external collaboration expected. If file permission behavior cannot be tested on the current OS, document the limitation and use a deterministic test seam where reasonable.

**Acceptance:** All required error cases have automated tests; corrupted data is not silently overwritten; full test suite passes after refactor.

## TASK-07 — Documentation and final acceptance review

**Outcome:** A reviewer can install, configure, run, and test the CLI, and can verify every Week 2 acceptance criterion.

**Where to start:** `overview.md` acceptance criteria, current CLI package README, `tdd-evidence-template.md`.

**What key points to learn:** Reproducible setup, truthful test evidence, explaining trade-offs and test types.

**What plan to follow:** Write setup/configuration/usage commands; record actual test commands and observed Red–Green–Refactor outputs; compare each acceptance criterion against code/tests/docs; report any unmet criterion honestly.

**How to troubleshoot:** If the environment prevents a check, record the exact command and blocker instead of claiming success. Do not add features in the final phase unless needed to meet an acceptance criterion.

**Sys Admin / DevOps collaboration:** No production access needed. Any need for privileged machine configuration is a blocker to report, not an automatic change.

**Acceptance:** All acceptance criteria in `overview.md` are checked or explicitly reported as blocked, documentation is reproducible, tests/build pass, and no unrelated changes remain.

---

## Required review gate after every task

Before moving to the next task, OpenCode must report:

1. **Changed files** and why each changed.
2. **Behavior implemented** mapped to the current task only.
3. **Tests/commands run** and actual pass/fail results.
4. **TDD evidence** for the behavior where applicable (include the observed failing output, not a claim).
5. **Known gaps/assumptions** and whether the next task depends on approval.
6. **Manual review checklist** for the developer.

The developer reviews `git diff` and test results and explicitly asks OpenCode to continue. A passing test suite is necessary but not sufficient; inspect the implementation and ensure the behavior matches the approved contract.
