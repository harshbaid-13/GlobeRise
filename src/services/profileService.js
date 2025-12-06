import api from './api';

export const profileService = {
  // Get current user's profile
  async getMyProfile() {
    const response = await api.get('/profile/me');
    return response.data.data.profile;
  },

  // Update profile
  async updateProfile(data) {
    const response = await api.put('/profile/me', data);
    return response.data.data.profile;
  },

};

