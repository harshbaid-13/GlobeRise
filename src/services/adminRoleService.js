import { STORAGE_KEYS } from '../utils/constants';
import { delay } from '../utils/helpers';
import { DEFAULT_ADMIN_PERMISSIONS } from '../utils/permissions';

const getStoredAdmins = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_PERMISSIONS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveAdmins = (admins) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PERMISSIONS, JSON.stringify(admins));
};

export const adminRoleService = {
  async getAllAdmins() {
    await delay(300);
    return getStoredAdmins();
  },

  async createAdmin(adminData) {
    await delay(500);
    const admins = getStoredAdmins();
    const newAdmin = {
      id: String(admins.length + 1),
      email: adminData.email,
      roleName: adminData.roleName || 'Admin',
      permissions: adminData.permissions || DEFAULT_ADMIN_PERMISSIONS,
      createdAt: new Date().toISOString(),
    };
    admins.push(newAdmin);
    saveAdmins(admins);
    return newAdmin;
  },

  async updateAdmin(id, updates) {
    await delay(500);
    const admins = getStoredAdmins();
    const index = admins.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Admin not found');
    }
    admins[index] = { ...admins[index], ...updates };
    saveAdmins(admins);
    return admins[index];
  },
};


