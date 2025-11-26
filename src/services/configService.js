import api from './api';

export const configService = {
  // Get all rank configurations
  async getRanks() {
    const response = await api.get('/config/ranks');
    return response.data.data;
  },

  // Get global plan configuration (for future use)
  async getPlanConfig() {
    const response = await api.get('/config/plan');
    return response.data.data;
  }
};
