import api from './api';

export const ruleService = {
  // Get active rules (public)
  async getActiveRules(category) {
    const params = category ? `?category=${category}` : '';
    const response = await api.get(`/rules${params}`);
    return response.data.data;
  },

  // Get rule by ID
  async getRuleById(id) {
    const response = await api.get(`/rules/${id}`);
    return response.data.data;
  },

  // Admin: Get all rules
  async getAllRules(category) {
    const params = category ? `?category=${category}` : '';
    const response = await api.get(`/rules/admin/all${params}`);
    return response.data.data;
  },

  // Admin: Create rule
  async createRule(data) {
    const response = await api.post('/rules', data);
    return response.data.data;
  },

  // Admin: Update rule
  async updateRule(id, data) {
    const response = await api.put(`/rules/${id}`, data);
    return response.data.data;
  },

  // Admin: Delete rule
  async deleteRule(id) {
    const response = await api.delete(`/rules/${id}`);
    return response.data;
  },
};

