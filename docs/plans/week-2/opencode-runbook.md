# Week 2 OpenCode Runbook — One Task, One Review Gate

This file turns the Week 2 docs into a controlled agent workflow. **Do not paste the whole runbook as one coding request.** Run one phase, inspect the output/diff, and then issue the next phase yourself.

## Before starting

1. Open the repository in OpenCode at the repository root.
2. Ensure there are no unrelated changes you might confuse with agent edits: `git status --short`.
3. The plan source files are:
   - `slides.md`
   - `.cursor/rules/overview.mdc`
   - `docs/plans/week-2/overview.md`
   - `docs/plans/week-2/architecture.md`
   - `docs/plans/week-2/tasks.md`
   - Week 3 overview/architecture/tasks for compatibility context
   - root `package.json` (the root app is Slidev)
4. The first request must be Phase 0 only. Do not permit code generation before contract review.

## Shared instruction to include in every implementation prompt

```text
Follow the repository rules in .cursor/rules/overview.mdc and the current task in docs/plans/week-2/tasks.md. Treat docs/plans/week-2/overview.md as the acceptance source of truth. Read the relevant architecture and Week 3 references before editing.

Work ONLY on the current task. Do not run later tasks, add out-of-scope features, alter slides, or repurpose the root Slidev package. Follow TDD: write a focused test, run it and observe failure, implement the smallest change, rerun to pass, then refactor and rerun. Never claim a command passed or a Red step occurred unless you actually ran it and saw the result.

Before finishing, show changed files, explain each change, list exact commands and actual results, state assumptions/gaps, and give me a manual review checklist. Stop at the review gate and wait for my explicit approval before moving to the next task. Do not commit or push.
```

---

## PHASE 0 — Requirements audit; no code changes

**Prompt to paste into OpenCode:**

```text
Read and reconcile these files: slides.md, .cursor/rules/overview.mdc, docs/plans/week-2/overview.md, docs/plans/week-2/architecture.md, docs/plans/week-2/tasks.md, docs/plans/week-3/overview.md, docs/plans/week-3/architecture.md, docs/plans/week-3/tasks.md, root package.json, and the current repository tree.

Do not create/edit/delete any files and do not install dependencies.

Return:
1. A requirements checklist copied/paraphrased from Week 2 acceptance criteria.
2. Any conflicts or missing details in source docs.
3. Whether a CLI implementation already exists and the safest implementation path without disturbing Slidev.
4. A proposed contract for status values, priority values, create/list/update flags, default values, ID generation, data-file location, missing-file behavior, corrupted-file behavior, and CLI exit codes. Mark these as proposals when not defined by source docs.
5. A task-by-task implementation plan mapped exactly to TASK-01 through TASK-07, with tests before implementation.
6. The likely environment risks for TypeScript + Commander + Jest and how you will verify them.

Do not start coding. End with decisions that require my approval and wait.
```

**Human review gate:** Check the suggested status/priority values, defaults, flag syntax and file behavior. Reply with the approved values or corrections. If the agent found an existing CLI, choose reuse rather than duplicate scaffolding.

---

## PHASE 1 — TASK-01: scaffold only

Run only after Phase 0 is approved.

```text
[Include the Shared Instruction above.]

Execute TASK-01 only. Create or adapt the smallest CLI package using the approved location and decisions. Prefer TypeScript, Commander.js and Jest for Week 3 continuity, but verify compatibility with this repository's actual Node/tool versions. Keep CLI dependencies/configuration isolated from the root Slidev package. Add only the minimum entry point/help behavior and a smoke test needed to prove the package setup works.

Run the package's test and build/type-check commands. Do not implement tickets yet. Stop at the review gate.
```

**Review yourself:** root `package.json` and lockfile were not repurposed; project-local scripts work; `--help` or equivalent works; no ticket features were added prematurely.

---

## PHASE 2 — TASK-02: Ticket model + validation (TDD)

```text
[Include the Shared Instruction above.]

Execute TASK-02 only using the approved contract. Start with one focused unit test for a valid ticket and one invalid input. Run the test and show the observed failure before adding production code. Then implement the smallest Ticket model/validation that satisfies the approved rules. Add boundary tests for each required field and approved status/priority values. Do not implement JSON storage or CLI commands yet. Run all unit tests and stop at the review gate.
```

**Review yourself:** the test fails for the intended reason before implementation; assertions check behavior, not private implementation details; allowed values match the approved contract; business rules are not duplicated unnecessarily.

---

## PHASE 3 — TASK-03: JSON storage + service

```text
[Include the Shared Instruction above.]

Execute TASK-03 only. Write tests first for the approved storage and service behavior. Use an isolated temporary file/directory for tests. Implement JSON read/write plus service use cases for create, list/filter, show-by-ID, and status update only as agreed in the architecture. A missing data file and a corrupted/invalid JSON file must follow the approved, documented behavior; never silently erase or overwrite corrupted data. Keep CLI command parsing out of this task. Run tests and stop at the review gate.
```

**Review yourself:** test files do not touch real user data; JSON survives a fresh service/storage instance; filter behavior is deterministic; corrupted JSON does not get converted into an empty list silently.

---

## PHASE 4 — TASK-04: create/list/filter commands

```text
[Include the Shared Instruction above.]

Execute TASK-04 only. Add CLI integration tests before implementing `tickets create` and `tickets list`. Use the approved flags/defaults exactly. Verify that a created ticket can be read by a later command and that status, priority, and tag filters work. Keep handlers thin and delegate ticket logic to the service. Test through the real CLI command/entry point using isolated storage; do not rely only on direct function tests. Stop at the review gate.
```

**Review yourself:** arguments/help are intuitive; filters have clear match semantics; CLI behavior matches tests; no unrelated commands were added.

---

## PHASE 5 — TASK-05: show/update commands

```text
[Include the Shared Instruction above.]

Execute TASK-05 only. Add tests first for `tickets show <id>` with an existing and missing ID, plus `tickets update <id> --status <status>` with valid status, invalid status, and missing ID. Implement the smallest behavior required by the approved CLI contract. Update status only; do not add arbitrary ticket edits. Verify an update persists after the command exits. Run all tests and stop at the review gate.
```

**Review yourself:** unknown IDs produce a helpful message and non-zero exit; invalid statuses are rejected; persisted values actually change; title/description/priority/tags are not accidentally rewritten.

---

## PHASE 6 — TASK-06: required error paths + refactor

```text
[Include the Shared Instruction above.]

Execute TASK-06 only. Audit current tests against every error case in Week 2 overview and architecture: invalid input, unknown ticket ID, missing JSON file, corrupted/structurally invalid JSON, and relevant read/write failures where practical. Add missing tests before changing code. Fix only demonstrated defects. Do a small refactor only after behavior is green, then rerun the complete suite. Do not add features. Stop at the review gate.
```

**Review yourself:** all error paths have tests; error messages are understandable; the process returns correct exit codes; tests isolate file state; no catch-all swallows an error.

---

## PHASE 7 — TASK-07: docs + final acceptance audit

```text
[Include the Shared Instruction above.]

Execute TASK-07 only. Update the CLI package README with prerequisites, install/setup, configuration, all four commands and filter examples, test/build commands, and error behavior. Fill docs/plans/week-2/tdd-evidence-template.md only with commands/results that were actually observed during this session or earlier recorded evidence; do not fabricate a Red failure or test result.

Then create an acceptance audit mapping each checkbox in docs/plans/week-2/overview.md to the relevant implementation file/test/document and mark PASS, FAIL, or BLOCKED with evidence. Run the full test suite, build/type-check, and git diff --check. Do not commit or push. Stop after reporting final gaps.
```

**Review yourself:** follow README commands in a clean terminal where possible; verify every acceptance item has evidence; make sure claims match actual command output.

---

## After every phase: review commands

From the repository root:

```bash
git status --short
git diff --check
git diff -- docs/plans/week-2 apps/ticket-manager
```

Run the package test/build commands reported by OpenCode; do not guess their names if the generated `package.json` differs. If the app folder has not been staged/tracked yet, `git diff` may not show new files; use `git status --short` and inspect the files directly.

## Final go/no-go checklist

- [ ] All four required commands work.
- [ ] Status/priority/tag filters work as approved.
- [ ] Unit tests cover ticket logic and validation.
- [ ] Integration tests cover JSON persistence and actual CLI behavior.
- [ ] Invalid input, not-found ticket, missing JSON, and corrupted JSON paths are tested.
- [ ] Missing JSON and corrupted JSON have different, documented behavior.
- [ ] Setup, configuration and usage are documented.
- [ ] At least one real Red → Green → Refactor sequence is evidenced.
- [ ] Every acceptance criterion maps to real code/test/docs.
- [ ] No root Slidev regression or unrelated modifications.
- [ ] No Week 3 KB implementation was added early.
