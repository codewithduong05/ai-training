# Week 2 Architecture — TDD Practice: Ticket Manager CLI

## 1. Purpose

Build a small, maintainable CLI for managing tickets in local JSON storage. Week 2 demonstrates controlled AI-assisted development and the Red–Green–Refactor loop. Week 3 will extend this CLI with Knowledge Base commands, so Week 2 should keep command registration and ticket-domain logic understandable without building a generic framework.

**Source of truth:** `overview.md` defines the objectives and acceptance criteria. This architecture expands those requirements; it does not replace them.

## 2. Scope

### In scope

- `tickets create`
- `tickets list`, including filters for status, priority, and tags
- `tickets show <id>`
- `tickets update <id>` to update ticket status
- Ticket validation and domain logic
- Local JSON persistence
- Unit tests for ticket logic and validation
- Integration tests for JSON persistence and CLI behavior
- Error behavior for invalid input, missing tickets, missing JSON, and corrupted JSON
- Installation, configuration, and usage documentation
- Verifiable evidence of at least one complete Red–Green–Refactor cycle

### Out of scope

- Database, web UI, authentication, cloud deployment, Docker, AI-agent framework
- KB commands or HTTP API integration (Week 3 scope)
- General-purpose plugin or event architecture
- Ticket deletion, comments, assignment, attachments, or arbitrary field updates unless the official overview is amended

## 3. Proposed application boundary

Keep the CLI isolated from the existing Slidev application. The actual repository layout keeps the CLI at `week-2/ticket-manager/` (reuse it rather than creating a second copy; `apps/ticket-manager/` was only a preferred-if-absent suggestion). Do not alter root-level Slidev files (`slides-ai-training.md`) or unrelated plans to make the CLI work. The repository root has no `package.json` or lockfile to repurpose.

```text
Repository root
├── slides-ai-training.md            # Training slides (root has no package.json)
├── docs/plans/week-2/               # Plan documents (overview, architecture, tasks, ...)
└── week-2/
    └── ticket-manager/              # Existing CLI package — reuse, do not duplicate
        ├── package.json             # CLI-specific scripts and dependencies
        ├── tsconfig.json
        ├── jest.config.js
        ├── README.md                # Install, configuration, usage
        ├── tickets.json             # Default local data file (runtime)
        └── src/
            ├── cli.ts               # Commander setup and command registration
            ├── domain/              # Ticket model and validation
            ├── services/            # Ticket use cases
            └── storage/             # JSON persistence
```

This is a guide, not permission to create empty layers or one file per function unnecessarily. Keep the smallest structure that still makes command handling, business logic, and JSON storage distinct.

## 4. Runtime data flow

```text
User command
    │
    ▼
CLI / Commander
(parse arguments, render output, set exit code)
    │
    ▼
Ticket service
(validation, create/list/show/status update)
    │
    ▼
JSON ticket storage
(read/write ticket collection)
    │
    ▼
Local JSON file
```

### Layer responsibilities

- **CLI:** Parse arguments and options; call the relevant service; display useful success/error messages; return a non-zero exit code for failed commands. Do not embed ticket business rules here.
- **Domain/model:** Define the Ticket shape and validation rules without file-system or CLI dependencies.
- **Service:** Implement the required ticket use cases and coordinate validation and persistence.
- **Storage:** Read and write JSON. Keep file-system concerns out of the CLI and domain validation.
- **Tests:** Test domain/service behavior as unit tests, and verify storage plus actual CLI command behavior with integration tests.

Avoid unnecessary dependency-injection frameworks. A small constructor argument or storage seam for test isolation is enough.

## 5. Ticket contract and decisions to approve

The required fields from `overview.md` are:

```ts
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags: string[];
}
```

The official Week 2 overview does **not** define allowed status/priority values, default values, exact flag syntax, or all missing/corrupted-file semantics. Phase 0 in `opencode-runbook.md` must surface these decisions before code is written.

Suggested defaults for review only:

- Status: `open | in_progress | resolved | closed`
- Priority: `low | medium | high | urgent`
- Create flags: `--title`, `--description`, optional `--status`, `--priority`, and comma-separated `--tags`
- List flags: `--status`, `--priority`, and `--tags`
- Update: `tickets update <id> --status <status>` (status update only)
- ID: unique generated string; prefer Node's built-in UUID support if compatible with the project's supported Node version
- Runtime data path: configurable with `TICKETS_DATA_FILE`, otherwise a documented local default

Do not silently introduce extra fields, required business rules, or command capabilities. Confirm decisions with the user/mentor or explicitly record the approved default before implementation.

## 6. JSON persistence and failure behavior

The behavior must be documented and tested. Proposed behavior, pending Phase 0 review:

- A missing data file represents a fresh local store and reads as an empty ticket collection; create required parent directories/file on the first write.
- A corrupted or structurally invalid JSON file produces an actionable error. Do not silently replace it with an empty collection or overwrite it, because this could destroy ticket data.
- File-system and JSON errors should become clear CLI messages, not raw stack traces by default.
- Integration tests must use isolated temporary paths and must not read/write the user's real local data.

If the official task owner specifies different behavior, update this document and tests before coding.

## 7. CLI contract

Required top-level commands:

```text
tickets create [options]
tickets list [options]
tickets show <id>
tickets update <id> --status <status>
```

Exact option names, required fields, defaults, output format, and exit-code details are decisions for Phase 0 review. CLI help must document accepted flags. Keep output stable enough to test without relying on fragile full-output snapshots.

## 8. Testing architecture

| Test layer | What it proves | Expected examples |
|---|---|---|
| Unit | Ticket logic and validation work independently of CLI/files | Required title, valid status/priority, tag parsing/normalization if applicable, updating status |
| Integration: storage/service | Service persists and reloads data correctly | Create then reload, list filters, show missing ID, update then reload |
| Integration: CLI | Actual command argument parsing and behavior | Create, list with filters, show, update, invalid flags/input, non-zero exit for errors |
| Error/failure | Data problems are safe and understandable | Missing file, corrupted JSON, wrong JSON shape, unavailable/unwritable path where practical |

Do not label a test “TDD” just because it exists. For at least one meaningful behavior, record the failing test before implementation, the minimal implementation that makes it pass, then the refactor and rerun.

## 9. Technology

Week 3 architecture names TypeScript, Commander.js, and Jest, so prefer those for continuity. Use the repository's existing package-manager convention where practical. Keep CLI dependencies isolated from the root Slidev package. If the current Node/tooling versions make a listed option incompatible, explain the concrete evidence and propose the smallest compatible change before changing the stack.

## 10. Week 3 extension seam

Week 3 adds a KB client and `kb search/list/retrieve/add`. Week 2 should therefore:

- keep CLI registration understandable and extendable;
- keep ticket behavior outside command handlers;
- avoid coupling ticket services to Commander or JSON-specific details;
- not implement any KB interface/client now.

The CLI binary name and exact combined command shape for Week 3 should be reviewed against Week 3's API/command contract during Week 3; do not expand Week 2 scope to settle it by building KB features early.

## 11. Architecture acceptance checklist

- [ ] CLI, ticket logic, and JSON storage have distinct responsibilities.
- [ ] Required four commands are supported.
- [ ] Filters cover status, priority, and tags.
- [ ] Storage behavior for missing/corrupted JSON is explicit and tested.
- [ ] Unit and integration tests are separate by purpose.
- [ ] Local data and test data are isolated.
- [ ] Root Slidev configuration is not repurposed.
- [ ] No Week 3 KB implementation has leaked into Week 2.
