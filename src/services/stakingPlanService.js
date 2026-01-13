import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

const STORAGE_KEY = 'staking_plans';

// Default staking plans (5 tiers)
const defaultStakingPlans = [
  { id: '1', tier: 1, durationMonths: 3, monthlyRate: 1.25, active: true },
  { id: '2', tier: 2, durationMonths: 6, monthlyRate: 1.75, active: true },
  { id: '3', tier: 3, durationMonths: 12, monthlyRate: 2.25, active: true },
  { id: '4', tier: 4, durationMonths: 18, monthlyRate: 4.0, active: true },
  { id: '5', tier: 5, durationMonths: 24, monthlyRate: 4.75, active: true },
];

const getStakingPlans = () => {
  const plans = localStorage.getItem(STORAGE_KEY);
  return plans ? JSON.parse(plans) : defaultStakingPlans;
};

const saveStakingPlans = (plans) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
};

export const stakingPlanService = {
  async getAllStakingPlans() {
    await delay(300);
    return getStakingPlans();
  },

  async getStakingPlanById(id) {
    await delay(200);
    const plans = getStakingPlans();
    return plans.find(p => p.id === id);
  },

  async createStakingPlan(planData) {
    await delay(500);
    const plans = getStakingPlans();
    const newPlan = {
      id: String(plans.length + 1),
      ...planData,
      active: planData.active !== undefined ? planData.active : true,
    };
    plans.push(newPlan);
    saveStakingPlans(plans);
    return newPlan;
  },

  async updateStakingPlan(id, updates) {
    await delay(500);
    const plans = getStakingPlans();
    const index = plans.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Staking plan not found');
    }
    
    plans[index] = { ...plans[index], ...updates };
    saveStakingPlans(plans);
    return plans[index];
  },

  async deleteStakingPlan(id) {
    await delay(500);
    const plans = getStakingPlans();
    const filtered = plans.filter(p => p.id !== id);
    saveStakingPlans(filtered);
    return { message: 'Staking plan deleted successfully' };
  },
};

