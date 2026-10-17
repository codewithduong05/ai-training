# Ticket Manager CLI (Week 2)

A lightweight TypeScript/Commander.js CLI tool for managing local tickets with JSON persistence, built using Test-Driven Development (TDD).

## Prerequisites

- Node.js (v18+ recommended)
- npm

## Installation & Setup

1. Navigate to the package directory:
   ```bash
   cd week-2/ticket-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

- **Data Storage Path:** By default, tickets are persisted to `tickets.json` in the root of the package. You can customize this by setting the `TICKETS_DATA_FILE` environment variable:
  ```bash
  export TICKETS_DATA_FILE=/path/to/custom-tickets.json
  ```

## Usage & Commands

### 1. Create a Ticket
```bash
npx ts-node src/cli.ts create --title "Fix login bug" --description "OAuth login fails on redirect" --priority high --tags auth,bug
```
Options:
- `-t, --title <title>` (required)
- `-d, --description <description>` (optional)
- `-s, --status <status>` (`open`, `in_progress`, `resolved`, `closed` - default: `open`)
- `-p, --priority <priority>` (`low`, `medium`, `high`, `urgent` - default: `medium`)
- `--tags <tags>` (comma-separated tags)

### 2. List & Filter Tickets
```bash
npx ts-node src/cli.ts list
```
Filter options:
- `-s, --status <status>`
- `-p, --priority <priority>`
- `--tags <tags>` (comma-separated tags)

### 3. Show Ticket Details
```bash
npx ts-node src/cli.ts show <id>
```

### 4. Update Ticket Status
```bash
npx ts-node src/cli.ts update <id> --status resolved
```
Options:
- `-s, --status <status>` (`open`, `in_progress`, `resolved`, `closed`)

## Running Tests

```bash
npm test
```

## Error & Failure Behavior

All failures print a single clear `Error: ...` line to `stderr` (no stack traces) and exit with code `1`.

- **Missing Data File:** Treated as an empty ticket collection (`[]`). Parent directories and file are created automatically on the first write.
- **Corrupted / Empty JSON File:** Throws an explicit error (`Corrupted JSON data in tickets file ...`) and refuses to silently overwrite or erase existing data.
- **Structurally Invalid Ticket Records:** Throws `Invalid ticket data ...` naming the offending index/field (e.g. bad `status`/`priority` enum, non-string tags). The file is never overwritten.
- **Invalid Input / Unknown ID:** `create` with an invalid `--status`/`--priority` value fails with `Validation failed: ...` before anything is written. `show`/`update` with an unknown ID report `not found`. `update` only changes `status` and rejects invalid statuses; the data file is left unchanged on any failure.
- **Invalid List Filters:** `list --status <bad>` or `list --priority <bad>` fail with `Invalid status/priority filter ... Must be one of: ...` instead of silently matching nothing. Valid filters (`--status`, `--priority`, `--tags`) combine with AND semantics.
- **Filesystem Errors:** Read/write failures (unwritable path, data path pointing at a directory, permission problems) are reported as `Failed to read/write tickets file (<path>): ...`.
