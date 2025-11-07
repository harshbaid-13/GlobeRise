import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockDeposits } from '../data/mockDeposits';

// Initialize deposits in localStorage if not exists
if (!localStorage.getItem(STORAGE_KEYS.DEPOSITS)) {
  localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(mockDeposits));
}

const getDeposits = () => {
  const deposits = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
  return deposits ? JSON.parse(deposits) : [];
};

const saveDeposits = (deposits) => {
  localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
};

export const depositService = {
  async getAllDeposits() {
    await delay(500);
    return getDeposits();
  },

  async getDepositsByStatus(status) {
    await delay(500);
    const deposits = getDeposits();
    return deposits.filter(d => d.status === status);
  },

  async getPendingDeposits() {
    return this.getDepositsByStatus('pending');
  },

  async getApprovedDeposits() {
    return this.getDepositsByStatus('approved');
  },

  async getSuccessfulDeposits() {
    return this.getDepositsByStatus('successful');
  },

  async getRejectedDeposits() {
    return this.getDepositsByStatus('rejected');
  },

  async getInitiatedDeposits() {
    return this.getDepositsByStatus('initiated');
  },

  async getDepositById(id) {
    await delay(300);
    const deposits = getDeposits();
    return deposits.find(d => d.id === id);
  },

  async updateDepositStatus(id, status) {
    await delay(800);
    const deposits = getDeposits();
    const index = deposits.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Deposit not found');
    }
    
    deposits[index].status = status;
    if (status === 'successful' || status === 'approved') {
      deposits[index].processedAt = new Date().toISOString();
    }
    
    saveDeposits(deposits);
    return deposits[index];
  },

  async approveDeposit(id) {
    return this.updateDepositStatus(id, 'approved');
  },

  async rejectDeposit(id) {
    return this.updateDepositStatus(id, 'rejected');
  },

  async createDeposit(depositData) {
    await delay(800);
    const deposits = getDeposits();
    const newDeposit = {
      id: `dep_${Date.now()}`,
      ...depositData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      processedAt: null,
    };
    
    deposits.push(newDeposit);
    saveDeposits(deposits);
    return newDeposit;
  },
};

