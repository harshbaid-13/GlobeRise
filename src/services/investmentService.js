import api from './api';

export const investmentService = {
  // Get investment history
  async getMyInvestments() {
    const response = await api.get('/investments/my');
    return response.data.data;
  },

  // Create new investment package (Deposit Wallet)
  async createPackage(amount) {
    const response = await api.post('/investments/package', { amount });
    return response.data;
  },

  // Create fixed deposit (staking)
  async createFixedDeposit(amount, durationMonths) {
    const response = await api.post('/investments/fixed', {
      amount,
      durationMonths
    });
    return response.data;
  }
};
 