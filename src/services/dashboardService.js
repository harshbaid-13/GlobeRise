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
  },

  // Get earnings report
  async getEarningsReport(days = 30) {
    const response = await api.get(`/dashboard/reports/earnings?days=${days}`);
    return response.data.data;
  },

  // Get investment report
  async getInvestmentReport(days = 30) {
    const response = await api.get(`/dashboard/reports/investments?days=${days}`);
    return response.data.data;
  }
};
