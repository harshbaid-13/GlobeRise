import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockSupportTickets } from '../data/mockSupportTickets';

// Initialize support tickets in localStorage if not exists
if (!localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS)) {
  localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(mockSupportTickets));
}

const getTickets = () => {
  const tickets = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
  return tickets ? JSON.parse(tickets) : [];
};

const saveTickets = (tickets) => {
  localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));
};

export const supportService = {
  async getAllTickets() {
    await delay(500);
    return getTickets();
  },

  async getTicketsByStatus(status) {
    await delay(500);
    const tickets = getTickets();
    return tickets.filter(t => t.status === status);
  },

  async getPendingTickets() {
    return this.getTicketsByStatus('pending');
  },

  async getAnsweredTickets() {
    return this.getTicketsByStatus('answered');
  },

  async getClosedTickets() {
    return this.getTicketsByStatus('closed');
  },

  async getTicketById(id) {
    await delay(300);
    const tickets = getTickets();
    return tickets.find(t => t.id === id);
  },

  async updateTicketStatus(id, status) {
    await delay(800);
    const tickets = getTickets();
    const index = tickets.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    
    tickets[index].status = status;
    if (status === 'answered') {
      tickets[index].answeredAt = new Date().toISOString();
    }
    if (status === 'closed') {
      tickets[index].closedAt = new Date().toISOString();
    }
    
    saveTickets(tickets);
    return tickets[index];
  },

  async addResponse(ticketId, response) {
    await delay(800);
    const tickets = getTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    
    if (!tickets[index].responses) {
      tickets[index].responses = [];
    }
    
    tickets[index].responses.push({
      id: `resp_${Date.now()}`,
      ...response,
      createdAt: new Date().toISOString(),
    });
    
    tickets[index].status = 'answered';
    tickets[index].answeredAt = new Date().toISOString();
    
    saveTickets(tickets);
    return tickets[index];
  },

  async createTicket(ticketData) {
    await delay(800);
    const tickets = getTickets();
    const newTicket = {
      id: `ticket_${Date.now()}`,
      ...ticketData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      answeredAt: null,
      closedAt: null,
      responses: [],
    };
    
    tickets.push(newTicket);
    saveTickets(tickets);
    return newTicket;
  },
};

