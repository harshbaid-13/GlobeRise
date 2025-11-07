import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockWithdrawals } from '../data/mockWithdrawals';

// Initialize withdrawals in localStorage if not exists
if (!localStorage.getItem('withdrawals')) {
  localStorage.setItem('withdrawals', JSON.stringify(mockWithdrawals));
}

const getWithdrawals = () => {
  const withdrawals = localStorage.getItem('withdrawals');
  return withdrawals ? JSON.parse(withdrawals) : [];
};

const saveWithdrawals = (withdrawals) => {
  localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
};

export const withdrawalService = {
  async getAllWithdrawals() {
    await delay(500);
    return getWithdrawals();
  },

  async getWithdrawalsByStatus(status) {
    await delay(500);
    const withdrawals = getWithdrawals();
    return withdrawals.filter(w => w.status === status);
  },

  async getPendingWithdrawals() {
    return this.getWithdrawalsByStatus('pending');
  },

  async getApprovedWithdrawals() {
    return this.getWithdrawalsByStatus('approved');
  },

  async getRejectedWithdrawals() {
    return this.getWithdrawalsByStatus('rejected');
  },

  async getWithdrawalById(id) {
    await delay(300);
    const withdrawals = getWithdrawals();
    return withdrawals.find(w => w.id === id);
  },

  async updateWithdrawalStatus(id, status, reason = null) {
    await delay(800);
    const withdrawals = getWithdrawals();
    const index = withdrawals.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error('Withdrawal not found');
    }
    
    withdrawals[index].status = status;
    if (status === 'approved' || status === 'rejected') {
      withdrawals[index].processedAt = new Date().toISOString();
      if (reason) {
        withdrawals[index].reason = reason;
      }
    }
    
    saveWithdrawals(withdrawals);
    return withdrawals[index];
  },

  async approveWithdrawal(id) {
    return this.updateWithdrawalStatus(id, 'approved');
  },

  async rejectWithdrawal(id, reason) {
    return this.updateWithdrawalStatus(id, 'rejected', reason);
  },

  async createWithdrawal(withdrawalData) {
    await delay(800);
    const withdrawals = getWithdrawals();
    const newWithdrawal = {
      id: `wd_${Date.now()}`,
      ...withdrawalData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      processedAt: null,
    };
    
    withdrawals.push(newWithdrawal);
    saveWithdrawals(withdrawals);
    return newWithdrawal;
  },
};

