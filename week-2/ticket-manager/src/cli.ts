import { Command } from 'commander';
import { TicketService } from './services/ticketService';
import { TicketStatus, TicketPriority } from './domain/ticket';

const program = new Command();
const service = new TicketService();

program
  .name('tickets')
  .description('CLI Ticket Manager')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new ticket')
  .requiredOption('-t, --title <title>', 'Ticket title')
  .option('-d, --description <description>', 'Ticket description', '')
  .option('-s, --status <status>', 'Ticket status (open, in_progress, resolved, closed)')
  .option('-p, --priority <priority>', 'Ticket priority (low, medium, high, urgent)')
  .option('--tags <tags>', 'Comma-separated tags')
  .action((options) => {
    try {
      const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      const ticket = service.createTicket({
        title: options.title,
        description: options.description,
        status: options.status as TicketStatus,
        priority: options.priority as TicketPriority,
        tags,
      });
      console.log(`Ticket created successfully (ID: ${ticket.id})`);
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List and filter tickets')
  .option('-s, --status <status>', 'Filter by status')
  .option('-p, --priority <priority>', 'Filter by priority')
  .option('--tags <tags>', 'Filter by tags (comma-separated)')
  .action((options) => {
    try {
      const tickets = service.listTickets({
        status: options.status,
        priority: options.priority,
        tags: options.tags,
      });

      if (tickets.length === 0) {
        console.log('No tickets found.');
        return;
      }

      tickets.forEach(t => {
        console.log(`[${t.id}] ${t.title} (${t.status}, ${t.priority}) - Tags: [${t.tags.join(', ')}]`);
        if (t.description) {
          console.log(`  Desc: ${t.description}`);
        }
      });
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command('show <id>')
  .description('Show details of a specific ticket')
  .action((id) => {
    try {
      const ticket = service.getTicket(id);
      if (!ticket) {
        console.error(`Error: Ticket with ID ${id} not found`);
        process.exit(1);
      }
      console.log(`ID: ${ticket.id}`);
      console.log(`Title: ${ticket.title}`);
      console.log(`Description: ${ticket.description}`);
      console.log(`Status: ${ticket.status}`);
      console.log(`Priority: ${ticket.priority}`);
      console.log(`Tags: ${ticket.tags.join(', ')}`);
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command('update <id>')
  .description('Update ticket status')
  .requiredOption('-s, --status <status>', 'New ticket status (open, in_progress, resolved, closed)')
  .action((id, options) => {
    try {
      const updated = service.updateTicketStatus(id, options.status as TicketStatus);
      console.log(`Ticket ${updated.id} status updated to ${updated.status}`);
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

if (require.main === module) {
  program.parse(process.argv);
}

export { program };
