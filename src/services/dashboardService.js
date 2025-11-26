import api from './api';

export const dashboardService = {
  // Get dashboard statistics
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  // Get earnings chart data
  async getEarningsChart() {
    const response = await api.get('/dashboard/chart');
    return response.data.data;
  }
};
