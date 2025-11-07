import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockPins } from '../data/mockPins';

// Initialize pins in localStorage if not exists
if (!localStorage.getItem(STORAGE_KEYS.PINS)) {
  localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(mockPins));
}

const getPins = () => {
  const pins = localStorage.getItem(STORAGE_KEYS.PINS);
  return pins ? JSON.parse(pins) : [];
};

const savePins = (pins) => {
  localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
};

export const pinService = {
  async getAllPins() {
    await delay(500);
    return getPins();
  },

  async getPinsByType(type) {
    await delay(500);
    const pins = getPins();
    return pins.filter(p => p.type === type);
  },

  async getUserPins() {
    return this.getPinsByType('user');
  },

  async getAdminPins() {
    return this.getPinsByType('admin');
  },

  async getUsedPins() {
    await delay(500);
    const pins = getPins();
    return pins.filter(p => p.status === 'used');
  },

  async getUnusedPins() {
    await delay(500);
    const pins = getPins();
    return pins.filter(p => p.status === 'unused');
  },

  async getPinById(id) {
    await delay(300);
    const pins = getPins();
    return pins.find(p => p.id === id);
  },

  async createPin(pinData) {
    await delay(800);
    const pins = getPins();
    const newPin = {
      id: `pin_${Date.now()}`,
      ...pinData,
      status: 'unused',
      usedBy: null,
      usedAt: null,
      createdAt: new Date().toISOString(),
    };
    
    pins.push(newPin);
    savePins(pins);
    return newPin;
  },

  async deletePin(id) {
    await delay(800);
    const pins = getPins();
    const filtered = pins.filter(p => p.id !== id);
    savePins(filtered);
    return { message: 'Pin deleted successfully' };
  },
};

