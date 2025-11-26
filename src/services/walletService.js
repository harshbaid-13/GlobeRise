import api from './api';

export const walletService = {
  // Get all wallet balances
  async getBalances() {
    const response = await api.get('/wallets');
    return response.data.data;
  },

  // Transfer funds between wallets
  async transfer(fromWallet, toWallet, amount) {
    const response = await api.post('/wallets/transfer', {
      fromWallet,
      toWallet,
      amount
    });
    return response.data;
  },

  // Request withdrawal (This seems redundant if withdrawalService handles it, but keeping for compatibility if used)
  // Actually, let's delegate to withdrawalService or keep it if it was used.
  // The original code had it, but it called /withdrawals/request.
  // We should probably keep it to avoid breaking existing calls, but it's better to use withdrawalService.
  async requestWithdrawal(amount) {
    const response = await api.post('/withdrawals/request', { amount });
    return response.data;
  }
};
