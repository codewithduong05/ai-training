import { validateTicket, Ticket, TicketStatus, TicketPriority } from './ticket';

describe('Ticket Domain & Validation', () => {
  test('should validate a valid ticket creation input', () => {
    const input = {
      title: 'Fix login bug',
      description: 'Users cannot log in with Google OAuth',
      status: 'open' as TicketStatus,
      priority: 'high' as TicketPriority,
      tags: ['auth', 'bug'],
    };

    const result = validateTicket(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should fail validation when title is missing or empty', () => {
    const input = {
      title: '',
      description: 'Some desc',
    };

    const result = validateTicket(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Title is required');
  });

  test('should fail validation when status is invalid', () => {
    const input = {
      title: 'Valid title',
      status: 'unknown_status',
    };

    const result = validateTicket(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('status'))).toBe(true);
  });

  test('should fail validation when priority is invalid', () => {
    const input = {
      title: 'Valid title',
      priority: 'super_urgent',
    };

    const result = validateTicket(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('priority'))).toBe(true);
  });
});
