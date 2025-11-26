import api from './api';

export const withdrawalService = {
  // Get all withdrawals (Admin only, or user history via different endpoint if available)
  // For client, we might need a specific endpoint or filter the response if the backend supports it.
  // Based on routes, client can only request. Admin can view pending.
  // We'll assume for now client history might need a new endpoint or we use what's available.
  // Actually, looking at routes, there isn't a clear "get my withdrawals" for client.
  // We will implement requestWithdrawal which is the critical part.
  
  async requestWithdrawal(data) {
    const response = await api.post('/withdrawals/request', {
      amount: data.amount,
      // Backend controller only extracts amount. 
      // If we want to save method/details, backend needs update.
      // For now, we send what backend expects.
    });
    return response.data;
  },

  // Admin methods (if needed for admin panel, but this seems to be client service)
  async getPendingWithdrawals() {
    const response = await api.get('/withdrawals/pending');
    return response.data.data;
  },

  async createWithdrawal(withdrawalData) {
    return this.requestWithdrawal(withdrawalData);
  },
};

