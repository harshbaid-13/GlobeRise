import api from './api';

export const supportService = {
  // Create a new ticket
  async createTicket(data) {
    const response = await api.post('/support/tickets', data);
    return response.data.data.ticket;
  },

  // Get user's tickets
  async getMyTickets(status) {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/support/tickets${params}`);
    return response.data.data.tickets;
  },

  // Get ticket by ID
  async getTicket(id) {
    const response = await api.get(`/support/tickets/${id}`);
    return response.data.data.ticket;
  },

  // Add response to ticket
  async addResponse(ticketId, message) {
    const response = await api.post(`/support/tickets/${ticketId}/response`, { message });
    return response.data.data.ticket;
  },

  // Cancel ticket (user can cancel their own OPEN tickets)
  async cancelTicket(ticketId) {
    const response = await api.delete(`/support/tickets/${ticketId}`);
    return response.data.data.ticket;
  },

  // Get FAQs
  async getFAQs(category) {
    const params = category ? `?category=${category}` : '';
    const response = await api.get(`/support/faqs${params}`);
    return response.data.data.faqs;
  },
};

