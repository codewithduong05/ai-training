import fs from 'fs';
import path from 'path';
import { Ticket, VALID_STATUSES, VALID_PRIORITIES } from '../domain/ticket';

export const DEFAULT_DATA_PATH = process.env.TICKETS_DATA_FILE || path.join(process.cwd(), 'tickets.json');

function collectRecordErrors(value: unknown, index: number): string[] {
  const errors: string[] = [];
  const at = `tickets[${index}]`;

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${at} must be an object`);
    return errors;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id !== 'string' || record.id.trim() === '') {
    errors.push(`${at}.id must be a non-empty string`);
  }
  if (typeof record.title !== 'string' || record.title.trim() === '') {
    errors.push(`${at}.title must be a non-empty string`);
  }
  if (typeof record.description !== 'string') {
    errors.push(`${at}.description must be a string`);
  }
  if (typeof record.status !== 'string' || !VALID_STATUSES.includes(record.status as Ticket['status'])) {
    errors.push(`${at}.status "${String(record.status)}" must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (typeof record.priority !== 'string' || !VALID_PRIORITIES.includes(record.priority as Ticket['priority'])) {
    errors.push(`${at}.priority "${String(record.priority)}" must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  if (!Array.isArray(record.tags)) {
    errors.push(`${at}.tags must be an array of strings`);
  } else if (record.tags.some(tag => typeof tag !== 'string')) {
    errors.push(`${at}.tags must contain only strings`);
  }

  return errors;
}

function assertValidTickets(data: unknown, filePath: string): Ticket[] {
  if (!Array.isArray(data)) {
    throw new Error(
      `Invalid ticket data in tickets file (${filePath}): root value must be an array of tickets`
    );
  }

  const errors = data.flatMap((record, index) => collectRecordErrors(record, index));
  if (errors.length > 0) {
    throw new Error(`Invalid ticket data in tickets file (${filePath}): ${errors.join('; ')}`);
  }

  return data as Ticket[];
}

export function readTickets(filePath: string = DEFAULT_DATA_PATH): Ticket[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return assertValidTickets(data, filePath);
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      throw new Error(`Corrupted JSON data in tickets file (${filePath}): ${err.message}`);
    }
    throw err;
  }
}

export function writeTickets(tickets: Ticket[], filePath: string = DEFAULT_DATA_PATH): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2), 'utf-8');
}
