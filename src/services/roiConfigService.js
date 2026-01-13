import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

const STORAGE_KEY = 'roi_config';

// Default ROI configuration by rank
const defaultROIConfig = {
  EXPLORER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  PATHFINDER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  CHALLENGER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  NAVIGATOR: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  CHAMPION: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  COMMANDER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  STRATEGIST: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  TRAILBLAZER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  GRANDMASTER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  LEGEND: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  CROWN_PRINCE: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  KING: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  EMPEROR: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  SUPREME_LEADER: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
  IMPERATOR: { baseRate: 8, tier2Rate: 10, tier3Rate: 12, applyTo: 'new_only' },
};

const getROIConfig = () => {
  const config = localStorage.getItem(STORAGE_KEY);
  return config ? JSON.parse(config) : defaultROIConfig;
};

const saveROIConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const roiConfigService = {
  async getROIConfig() {
    await delay(300);
    return getROIConfig();
  },

  async updateROIConfig(rankName, config) {
    await delay(500);
    const currentConfig = getROIConfig();
    currentConfig[rankName] = { ...currentConfig[rankName], ...config };
    saveROIConfig(currentConfig);
    return currentConfig[rankName];
  },

  async updateAllROIConfig(config) {
    await delay(500);
    saveROIConfig(config);
    return config;
  },
};

