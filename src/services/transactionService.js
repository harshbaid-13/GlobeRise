import api from './api';

export const transactionService = {
  // Get transaction history with filters
  async getTransactions(params = {}) {
    const { type, wallet, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams();
    
    if (type) queryParams.append('type', type);
    if (wallet) queryParams.append('wallet', wallet);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await api.get(`/transactions/my?${queryParams.toString()}`);
    return response.data.data;
  },

  // Get earnings breakdown
  async getEarnings() {
    const response = await api.get('/transactions/earnings');
    return response.data.data;
  }
};
