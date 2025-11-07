import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { mockPlans } from '../data/mockPlans';

// Initialize plans in localStorage if not exists
if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(mockPlans));
}

const getPlans = () => {
  const plans = localStorage.getItem(STORAGE_KEYS.PLANS);
  return plans ? JSON.parse(plans) : [];
};

const savePlans = (plans) => {
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
};

export const planService = {
  async getAllPlans() {
    await delay(500);
    return getPlans();
  },

  async getPlanById(id) {
    await delay(300);
    const plans = getPlans();
    return plans.find(p => p.id === id);
  },

  async createPlan(planData) {
    await delay(800);
    const plans = getPlans();
    const newPlan = {
      id: String(plans.length + 1),
      ...planData,
      status: planData.status || 'enabled',
    };
    
    plans.push(newPlan);
    savePlans(plans);
    return newPlan;
  },

  async updatePlan(id, updates) {
    await delay(800);
    const plans = getPlans();
    const index = plans.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Plan not found');
    }
    
    plans[index] = { ...plans[index], ...updates };
    savePlans(plans);
    return plans[index];
  },

  async deletePlan(id) {
    await delay(800);
    const plans = getPlans();
    const filtered = plans.filter(p => p.id !== id);
    savePlans(filtered);
    return { message: 'Plan deleted successfully' };
  },
};

