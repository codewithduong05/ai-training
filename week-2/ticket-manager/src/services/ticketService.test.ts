import fs from 'fs';
import path from 'path';
import os from 'os';
import { TicketService } from './ticketService';
import { TicketStatus, TicketPriority } from '../domain/ticket';

describe('TicketService & Storage Integration', () => {
  let tempDir: string;
  let dataFile: string;
  let service: TicketService;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ticket-test-'));
    dataFile = path.join(tempDir, 'tickets.json');
    service = new TicketService(dataFile);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should return empty list when data file is missing', () => {
    const tickets = service.listTickets();
    expect(tickets).toEqual([]);
  });

  test('should create a ticket with defaults and persist it', () => {
    const ticket = service.createTicket({
      title: 'Test Ticket',
      description: 'Test description',
      priority: 'high',
      tags: ['bug', 'urgent'],
    });

    expect(ticket.id).toBeDefined();
    expect(ticket.title).toBe('Test Ticket');
    expect(ticket.status).toBe('open');
    expect(ticket.priority).toBe('high');
    expect(ticket.tags).toEqual(['bug', 'urgent']);

    // Reload service with same data file
    const service2 = new TicketService(dataFile);
    const tickets = service2.listTickets();
    expect(tickets).toHaveLength(1);
    expect(tickets[0]?.id).toBe(ticket.id);
  });

  test('should list tickets filtered by status, priority, and tags', () => {
    service.createTicket({ title: 'T1', status: 'open', priority: 'low', tags: ['frontend'] });
    service.createTicket({ title: 'T2', status: 'closed', priority: 'high', tags: ['backend'] });
    service.createTicket({ title: 'T3', status: 'open', priority: 'high', tags: ['frontend', 'bug'] });

    const openTickets = service.listTickets({ status: 'open' });
    expect(openTickets).toHaveLength(2);

    const highPriority = service.listTickets({ priority: 'high' });
    expect(highPriority).toHaveLength(2);

    const frontendTickets = service.listTickets({ tags: 'frontend' });
    expect(frontendTickets).toHaveLength(2);
  });

  test('should retrieve ticket by ID', () => {
    const t1 = service.createTicket({ title: 'Find me' });
    const found = service.getTicket(t1.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe('Find me');

    const notFound = service.getTicket('non-existent-id');
    expect(notFound).toBeUndefined();
  });

  test('should update ticket status successfully', () => {
    const t1 = service.createTicket({ title: 'To update', status: 'open' });
    const updated = service.updateTicketStatus(t1.id, 'in_progress');

    expect(updated.status).toBe('in_progress');
    expect(updated.title).toBe('To update');

    const reloaded = service.getTicket(t1.id);
    expect(reloaded?.status).toBe('in_progress');
  });

  test('should throw error on corrupted JSON data file without overwriting', () => {
    fs.writeFileSync(dataFile, '{ invalid json data');

    expect(() => service.listTickets()).toThrow(/corrupted/i);

    // Verify file was not overwritten with []
    const content = fs.readFileSync(dataFile, 'utf-8');
    expect(content).toContain('invalid json');
  });

  test('should reject invalid status filter with clear message', () => {
    expect(() => service.listTickets({ status: 'bogus' })).toThrow(/status.*open.*in_progress/i);
  });

  test('should reject invalid priority filter with clear message', () => {
    expect(() => service.listTickets({ priority: 'bogus' })).toThrow(/priority.*low.*urgent/i);
  });

  test('should accept valid combined filters', () => {
    service.createTicket({ title: 'A', status: 'open', priority: 'high', tags: ['fe'] });
    service.createTicket({ title: 'B', status: 'closed', priority: 'low', tags: ['be'] });

    const result = service.listTickets({ status: 'open', priority: 'high', tags: 'fe' });
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('A');
  });
});
