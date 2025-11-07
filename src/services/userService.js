import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockUsers } from '../data/mockUsers';

// Initialize users in localStorage if not exists
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
}

const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const userService = {
  async getAllUsers() {
    await delay(500);
    return getUsers();
  },

  async getUserById(id) {
    await delay(300);
    const users = getUsers();
    return users.find(u => u.id === id);
  },

  async getActiveUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => u.status === 'active');
  },

  async getBannedUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => u.status === 'banned');
  },

  async getEmailUnverifiedUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => !u.emailVerified);
  },

  async getMobileUnverifiedUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => !u.mobileVerified);
  },

  async getKYCUnverifiedUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => u.kycStatus === 'unverified');
  },

  async getKYCPendingUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => u.kycStatus === 'pending');
  },

  async getPaidUsers() {
    await delay(500);
    const users = getUsers();
    return users.filter(u => u.totalDeposited > 0);
  },

  async updateUser(id, updates) {
    await delay(800);
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    
    return users[index];
  },

  async banUser(id) {
    return this.updateUser(id, { status: 'banned' });
  },

  async unbanUser(id) {
    return this.updateUser(id, { status: 'active' });
  },

  async sendNotification(userIds, message) {
    await delay(1000);
    // In real app, this would send notifications
    return { message: `Notification sent to ${userIds.length} users` };
  },
};

