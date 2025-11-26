import api from './api';

export const referralService = {
  // Get referral tree and team stats
  async getReferralTree() {
    const response = await api.get('/referrals/tree');
    return response.data.data;
  }
};
