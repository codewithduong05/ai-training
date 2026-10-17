import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(__dirname, '../tickets.json');

export const readTickets = () => {
  if (!fs.existsSync(DATA_PATH)) return [];
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data);
};

export const writeTickets = (tickets: any[]) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(tickets, null, 2));
};
