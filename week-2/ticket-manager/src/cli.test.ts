import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('CLI Integration & Failure Path Tests', () => {
  let tempDir: string;
  let dataFile: string;
  let cliPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-fail-test-'));
    dataFile = path.join(tempDir, 'tickets.json');
    cliPath = path.resolve(__dirname, 'cli.ts');
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const runCli = (args: string[]) => {
    const result = spawnSync('npx', ['ts-node', cliPath, ...args], {
      env: { ...process.env, TICKETS_DATA_FILE: dataFile },
      encoding: 'utf-8',
    });
    return result;
  };

  test('should create a ticket and list it', () => {
    const createRes = runCli(['create', '--title', 'CLI Test Ticket', '--priority', 'high', '--tags', 'cli,test']);
    expect(createRes.status).toBe(0);
    expect(createRes.stdout).toContain('Ticket created successfully');

    const listRes = runCli(['list']);
    expect(listRes.status).toBe(0);
    expect(listRes.stdout).toContain('CLI Test Ticket');
  });

  test('should show ticket details for valid ID and fail for missing ID', () => {
    const createRes = runCli(['create', '--title', 'Show Me']);
    expect(createRes.status).toBe(0);

    // Get created ticket ID from data file
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const ticketId = data[0].id;

    const showRes = runCli(['show', ticketId]);
    expect(showRes.status).toBe(0);
    expect(showRes.stdout).toContain('Show Me');

    const missingRes = runCli(['show', 'non-existent-id']);
    expect(missingRes.status).not.toBe(0);
    expect(missingRes.stderr).toContain('not found');
  });

  test('should update ticket status successfully and fail on invalid status', () => {
    runCli(['create', '--title', 'Update Me']);
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const ticketId = data[0].id;

    const updateRes = runCli(['update', ticketId, '--status', 'resolved']);
    expect(updateRes.status).toBe(0);
    expect(updateRes.stdout).toContain('resolved');

    const invalidUpdateRes = runCli(['update', ticketId, '--status', 'invalid_status']);
    expect(invalidUpdateRes.status).not.toBe(0);
    expect(invalidUpdateRes.stderr).toContain('Validation failed');
  });

  test('should handle corrupted JSON data safely with non-zero exit', () => {
    fs.writeFileSync(dataFile, 'corrupted json content');

    const res = runCli(['list']);
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('Corrupted JSON data');

    // Verify file content was preserved
    const content = fs.readFileSync(dataFile, 'utf-8');
    expect(content).toBe('corrupted json content');
  });

  test('should reject structurally invalid tickets without overwriting the file', () => {
    const raw = '[{"id":"a1"},null]';
    fs.writeFileSync(dataFile, raw, 'utf-8');

    const listRes = runCli(['list']);
    expect(listRes.status).not.toBe(0);
    expect(listRes.stderr).toContain('Invalid ticket data');
    expect(fs.readFileSync(dataFile, 'utf-8')).toBe(raw);

    const createRes = runCli(['create', '--title', 'Should Not Persist']);
    expect(createRes.status).not.toBe(0);
    expect(fs.readFileSync(dataFile, 'utf-8')).toBe(raw);
  });

  test('zero-byte data file exits non-zero, prints no stack trace, file unchanged', () => {
    fs.writeFileSync(dataFile, '', 'utf-8');

    const res = runCli(['list']);
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('Corrupted JSON data');
    expect(res.stderr).not.toMatch(/\n\s+at /);
    expect(fs.readFileSync(dataFile, 'utf-8')).toBe('');
  });

  test('filesystem failure (data path is a directory) exits non-zero without stack trace', () => {
    const dirAsData = path.join(tempDir, 'as-directory');
    fs.mkdirSync(dirAsData);

    const res = spawnSync('npx', ['ts-node', cliPath, 'list'], {
      env: { ...process.env, TICKETS_DATA_FILE: dirAsData },
      encoding: 'utf-8',
    });

    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('Failed to read tickets file');
    expect(res.stderr).not.toMatch(/\n\s+at /);
  });
});
