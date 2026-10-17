import fs from 'fs';
import path from 'path';
import { Ticket } from '../domain/ticket';

export const DEFAULT_DATA_PATH = process.env.TICKETS_DATA_FILE || path.join(process.cwd(), 'tickets.json');

export function readTickets(filePath: string = DEFAULT_DATA_PATH): Ticket[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      throw new Error('Ticket data is not an array');
    }
    return data;
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
