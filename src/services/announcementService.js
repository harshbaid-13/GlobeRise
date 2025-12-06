import api from './api';

export const announcementService = {
  getActiveAnnouncements: async () => {
    const response = await api.get('/announcements/active');
    return response.data.data;
  },

  getAllAnnouncements: async (page = 1, limit = 20) => {
    const response = await api.get(`/announcements?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  createAnnouncement: async (data) => {
    const response = await api.post('/announcements', data);
    return response.data.data;
  },

  updateAnnouncement: async (id, data) => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await api.patch(`/announcements/${id}/toggle`);
    return response.data.data;
  },
};

