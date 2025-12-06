import api from './api';

export const rateService = {
  getLiveRates: async () => {
    const response = await api.get('/rates/live');
    return response.data.data;
  },
};

