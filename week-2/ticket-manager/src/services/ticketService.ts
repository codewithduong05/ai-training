import crypto from 'crypto';
import { Ticket, TicketStatus, TicketPriority, validateTicket } from '../domain/ticket';
import { readTickets, writeTickets, DEFAULT_DATA_PATH } from '../storage/storage';

export class TicketService {
  private dataFile: string;

  constructor(dataFile: string = DEFAULT_DATA_PATH) {
    this.dataFile = dataFile;
  }

  public createTicket(input: {
    title: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    tags?: string[];
  }): Ticket {
    const validation = validateTicket(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const tickets = readTickets(this.dataFile);

    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description ?? '',
      status: input.status ?? 'open',
      priority: input.priority ?? 'medium',
      tags: input.tags ?? [],
    };

    tickets.push(newTicket);
    writeTickets(tickets, this.dataFile);

    return newTicket;
  }

  public listTickets(filters?: {
    status?: string;
    priority?: string;
    tags?: string;
  }): Ticket[] {
    let tickets = readTickets(this.dataFile);

    if (!filters) {
      return tickets;
    }

    if (filters.status) {
      tickets = tickets.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }

    if (filters.tags) {
      const searchTags = filters.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      tickets = tickets.filter(t => searchTags.some(st => t.tags.includes(st)));
    }

    return tickets;
  }

  public getTicket(id: string): Ticket | undefined {
    const tickets = readTickets(this.dataFile);
    return tickets.find(t => t.id === id);
  }

  public updateTicketStatus(id: string, status: TicketStatus): Ticket {
    const tickets = readTickets(this.dataFile);
    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
      throw new Error(`Ticket with ID ${id} not found`);
    }

    const validation = validateTicket({ ...ticket, status });
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    ticket.status = status;
    writeTickets(tickets, this.dataFile);

    return ticket;
  }
}
