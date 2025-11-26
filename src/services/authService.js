import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token, refreshToken, requiresTwoFactor, tempToken } = response.data.data;
    
    if (requiresTwoFactor) {
      return { requiresTwoFactor, tempToken };
    }

    // Normalize role
    if (user.role === 'USER') user.role = 'client';
    if (user.role === 'ADMIN') user.role = 'admin';
    user.role = user.role.toLowerCase();

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { user, token };
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    try {
      // Optional: Call logout endpoint if backend supports it
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      // Normalize role
      if (user.role === 'USER') user.role = 'client';
      if (user.role === 'ADMIN') user.role = 'admin';
      user.role = user.role.toLowerCase();

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch (error) {
      return null;
    }
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', { token, password: newPassword });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  async resendEmail(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async verify2FA(tempToken, code) {
    const response = await api.post('/2fa/verify-login', { tempToken, code });
    const { user, token } = response.data.data;
    
    // Normalize role
    if (user.role === 'USER') user.role = 'client';
    if (user.role === 'ADMIN') user.role = 'admin';
    user.role = user.role.toLowerCase();

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { user, token };
  },
};
