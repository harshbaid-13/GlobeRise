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

export const authService = {
  async login(email, password) {
    await delay(800);
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `token_${Date.now()}_${user.id}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { user, token };
  },

  async register(userData) {
    await delay(1000);
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      throw new Error('Username already taken');
    }
    
    const newUser = {
      id: String(users.length + 1),
      ...userData,
      role: 'client',
      emailVerified: false,
      mobileVerified: false,
      kycStatus: 'unverified',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { user: newUser, message: 'Registration successful. Please verify your email.' };
  },

  async logout() {
    await delay(300);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async getCurrentUser() {
    await delay(200);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  async forgotPassword(email) {
    await delay(1000);
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Email not found');
    }
    
    // In real app, send reset link via email
    // For demo, return a mock token
    const resetToken = `reset_${Date.now()}_${user.id}`;
    return { message: 'Reset link sent to your email', token: resetToken };
  },

  async resetPassword(token, newPassword) {
    await delay(1000);
    const users = getUsers();
    const userId = token.split('_')[2];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Invalid reset token');
    }
    
    user.password = newPassword;
    saveUsers(users);
    
    return { message: 'Password reset successful' };
  },

  async verifyEmail(token) {
    await delay(800);
    const users = getUsers();
    const userId = token.split('_')[1];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Invalid verification token');
    }
    
    user.emailVerified = true;
    saveUsers(users);
    
    // Update localStorage user if it's the current user
    const currentUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (currentUser && JSON.parse(currentUser).id === user.id) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    
    return { message: 'Email verified successfully' };
  },

  async resendEmail(email) {
    await delay(1000);
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Email not found');
    }
    
    if (user.emailVerified) {
      throw new Error('Email already verified');
    }
    
    return { message: 'Verification email sent' };
  },

  async verify2FA(code) {
    await delay(800);
    // Mock 2FA verification - accept any 6-digit code
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      throw new Error('Invalid 2FA code');
    }
    
    return { message: '2FA verified successfully' };
  },
};

