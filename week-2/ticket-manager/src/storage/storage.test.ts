import fs from 'fs';
import path from 'path';
import os from 'os';
import { readTickets, writeTickets } from './storage';
import { TicketService } from '../services/ticketService';
import { Ticket } from '../domain/ticket';

describe('Storage record validation', () => {
  let tempDir: string;
  let dataFile: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-validate-'));
    dataFile = path.join(tempDir, 'tickets.json');
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const writeRaw = (content: string) => fs.writeFileSync(dataFile, content, 'utf-8');
  const readRaw = () => fs.readFileSync(dataFile, 'utf-8');

  test('rejects non-array root value', () => {
    const raw = '{"tickets": []}';
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/array/i);
    expect(readRaw()).toBe(raw);
  });

  test('rejects array containing null', () => {
    const raw = '[null]';
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/ticket/i);
    expect(readRaw()).toBe(raw);
  });

  test('rejects array containing empty object', () => {
    const raw = '[{}]';
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/ticket/i);
    expect(readRaw()).toBe(raw);
  });

  test('rejects record with invalid status enum value', () => {
    const raw = JSON.stringify([
      {
        id: 'a1',
        title: 'T',
        description: '',
        status: 'not_a_status',
        priority: 'medium',
        tags: [],
      },
    ]);
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/status/i);
    expect(readRaw()).toBe(raw);
  });

  test('rejects record with invalid priority enum value', () => {
    const raw = JSON.stringify([
      {
        id: 'a1',
        title: 'T',
        description: '',
        status: 'open',
        priority: 'super',
        tags: [],
      },
    ]);
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/priority/i);
    expect(readRaw()).toBe(raw);
  });

  test('rejects record with tags containing non-string values', () => {
    const raw = JSON.stringify([
      {
        id: 'a1',
        title: 'T',
        description: '',
        status: 'open',
        priority: 'low',
        tags: ['ok', 42],
      },
    ]);
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/tags/i);
    expect(readRaw()).toBe(raw);
  });

  test('rejects record with missing/wrong typed required fields', () => {
    const raw = JSON.stringify([
      { id: 123, title: 'T', description: '', status: 'open', priority: 'low', tags: [] },
      { id: 'a1', title: 'T', description: 7, status: 'open', priority: 'low', tags: [] },
    ]);
    writeRaw(raw);

    expect(() => readTickets(dataFile)).toThrow(/ticket/i);
    expect(readRaw()).toBe(raw);
  });

  test('accepts a valid ticket array', () => {
    const valid = [
      {
        id: 'a1',
        title: 'Valid',
        description: 'desc',
        status: 'open',
        priority: 'medium',
        tags: ['x'],
      },
    ];
    writeRaw(JSON.stringify(valid));

    expect(readTickets(dataFile)).toEqual(valid);
  });

  test('createTicket does not overwrite a file with invalid records', () => {
    const raw = '[{"id":"a1"}]';
    writeRaw(raw);
    const service = new TicketService(dataFile);

    expect(() => service.createTicket({ title: 'New' })).toThrow(/ticket/i);
    expect(readRaw()).toBe(raw);
  });

  test('writeTickets persists a valid collection that can be read back', () => {
    const valid = [
      {
        id: 'a1',
        title: 'Valid',
        description: 'desc',
        status: 'closed',
        priority: 'urgent',
        tags: ['x'],
      },
    ];
    writeTickets(valid as Ticket[], dataFile);
    expect(readTickets(dataFile)).toEqual(valid);
  });
});
