import api from './api';

export const rankingService = {
  // Get rank configurations from backend
  async getRankConfigs() {
    const response = await api.get('/config/ranks');
    return response.data.data;
  },

  // Get user's rank progress
  async getRankProgress() {
    const response = await api.get('/referrals/rank-progress');
    return response.data.data;
  },

  // Get public leaderboard
  async getLeaderboard(type = 'earnings', limit = 10) {
    const response = await api.get(`/referrals/leaderboard?type=${type}&limit=${limit}`);
    return response.data.data;
  },
};
