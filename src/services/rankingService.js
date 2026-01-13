import api from './api';
import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockRankings } from '../data/mockRankings';

// Initialize or update rankings in localStorage
const initializeRankings = () => {
  const existing = localStorage.getItem(STORAGE_KEYS.RANKINGS);
  
  // If no data exists, initialize with new rankings
  if (!existing) {
    localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(mockRankings));
    return;
  }
  
  // Check if old data structure exists (has 'bvLeft', 'bvRight', or old rank names)
  try {
    const parsed = JSON.parse(existing);
    const hasOldStructure = parsed.some(r => 
      r.bvLeft !== undefined || 
      r.bvRight !== undefined || 
      ['Silver', 'Silver Pro', 'Gold', 'Gold Pro', 'Platinum'].includes(r.name)
    );
    
    // If old structure detected, replace with new rankings
    if (hasOldStructure || parsed.length < 10) {
      localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(mockRankings));
    }
  } catch (e) {
    // If parsing fails, initialize with new rankings
    localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(mockRankings));
  }
};

// Initialize on module load
initializeRankings();

const getRankings = () => {
  const rankings = localStorage.getItem(STORAGE_KEYS.RANKINGS);
  return rankings ? JSON.parse(rankings) : [];
};

const saveRankings = (rankings) => {
  localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(rankings));
};

export const rankingService = {
  // Get rank configurations from backend
  async getRankConfigs() {
    const response = await api.get('/config/ranks');
    return response.data.data;
  },

  // Get user's rank progress
  async getRankProgress() {
    const response = await api.get('/referrals/rank-progress');
    return response.data.data;
  },

  // Get public leaderboard
  async getLeaderboard(type = 'earnings', limit = 10) {
    const response = await api.get(`/referrals/leaderboard?type=${type}&limit=${limit}`);
    return response.data.data;
  },

  // Frontend-only methods for admin panel
  async getAllRankings() {
    await delay(500);
    return getRankings();
  },

  async createRanking(rankingData) {
    await delay(800);
    const rankings = getRankings();
    const newRanking = {
      id: String(rankings.length + 1),
      ...rankingData,
      levelStartValue: rankingData.levelStartValue || 0,
      levelEndValue: rankingData.levelEndValue || null,
    };
    rankings.push(newRanking);
    saveRankings(rankings);
    return newRanking;
  },

  async updateRanking(id, updates) {
    await delay(800);
    const rankings = getRankings();
    const index = rankings.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Ranking not found');
    }
    
    rankings[index] = { ...rankings[index], ...updates };
    saveRankings(rankings);
    return rankings[index];
  },

  // Reset rankings to default (useful for migration)
  async resetToDefault() {
    await delay(300);
    localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(mockRankings));
    return mockRankings;
  },
};
