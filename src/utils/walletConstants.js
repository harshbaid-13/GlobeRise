// Wallet Type Constants (3 Wallets Only)
export const WALLET_TYPES = {
    DEPOSIT: 'DEPOSIT',
    REWARD: 'REWARD',
    WITHDRAWAL: 'WITHDRAWAL'
};

// Wallet Display Names
export const WALLET_LABELS = {
    DEPOSIT: 'Deposit Wallet',
    REWARD: 'Rewards Wallet',
    WITHDRAWAL: 'Withdrawal Wallet'
};

// Keep WALLET_NAMES as alias for backward compatibility
export const WALLET_NAMES = WALLET_LABELS;

// Wallet Descriptions
export const WALLET_DESCRIPTIONS = {
    DEPOSIT: 'Deposit from linked wallets (MetaMask/Trust Wallet) to create packages',
    REWARD: 'All ROI and income - Transfer to Deposit (reinvest) or Withdrawal (cashout)',
    WITHDRAWAL: 'Transfer from Rewards, then withdraw to linked wallet on Mondays'
};

// Allowed Transfer Paths
// User → Deposit (from linked wallet)
// Rewards → Deposit (reinvest) or Withdrawal (cashout)
// Withdrawal → User (to linked wallet on Mondays)
export const ALLOWED_TRANSFERS = {
    REWARD: ['DEPOSIT', 'WITHDRAWAL'],
    DEPOSIT: [],  // Locked (used for packages)
    WITHDRAWAL: []  // Locked (withdraws to linked wallet)
};

// Wallet Colors
export const WALLET_COLORS = {
    DEPOSIT: 'blue',
    REWARD: 'yellow',
    WITHDRAWAL: 'red'
};
