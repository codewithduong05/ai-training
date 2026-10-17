export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const VALID_STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
export const VALID_PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

export function validateTicket(input: any): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Invalid ticket input object'] };
  }

  if (!input.title || typeof input.title !== 'string' || input.title.trim() === '') {
    errors.push('Title is required');
  }

  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (input.priority !== undefined && !VALID_PRIORITIES.includes(input.priority)) {
    errors.push(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  if (input.tags !== undefined && !Array.isArray(input.tags)) {
    errors.push('Tags must be an array of strings');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
