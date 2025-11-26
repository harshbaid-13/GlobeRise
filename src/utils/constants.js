// User Roles
export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

// Route paths
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  RESEND_EMAIL: '/resend-email',
  TWO_FA: '/2fa-verify',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PLANS: '/admin/plans',
  ADMIN_PINS_ALL: '/admin/pins/all',
  ADMIN_PINS_USER: '/admin/pins/user',
  ADMIN_PINS_ADMIN: '/admin/pins/admin',
  ADMIN_PINS_USED: '/admin/pins/used',
  ADMIN_PINS_UNUSED: '/admin/pins/unused',
  ADMIN_USERS_ACTIVE: '/admin/users/active',
  ADMIN_USERS_BANNED: '/admin/users/banned',
  ADMIN_USERS_EMAIL_UNVERIFIED: '/admin/users/email-unverified',
  ADMIN_USERS_MOBILE_UNVERIFIED: '/admin/users/mobile-unverified',
  ADMIN_USERS_KYC_UNVERIFIED: '/admin/users/kyc-unverified',
  ADMIN_USERS_KYC_PENDING: '/admin/users/kyc-pending',
  ADMIN_USERS_PAID: '/admin/users/paid',
  ADMIN_USERS_ALL: '/admin/users/all',
  ADMIN_USERS_SEND_NOTIFICATION: '/admin/users/send-notification',
  ADMIN_DEPOSITS_PENDING: '/admin/deposits/pending',
  ADMIN_DEPOSITS_APPROVED: '/admin/deposits/approved',
  ADMIN_DEPOSITS_SUCCESSFUL: '/admin/deposits/successful',
  ADMIN_DEPOSITS_REJECTED: '/admin/deposits/rejected',
  ADMIN_DEPOSITS_INITIATED: '/admin/deposits/initiated',
  ADMIN_DEPOSITS_ALL: '/admin/deposits/all',
  ADMIN_DEPOSIT_DETAILS: '/admin/deposit/details/:id',
  ADMIN_WITHDRAWALS_PENDING: '/admin/withdrawals/pending',
  ADMIN_WITHDRAWALS_APPROVED: '/admin/withdrawals/approved',
  ADMIN_WITHDRAWALS_REJECTED: '/admin/withdrawals/rejected',
  ADMIN_WITHDRAWALS_ALL: '/admin/withdrawals/all',
  ADMIN_SUPPORT_PENDING: '/admin/support/pending',
  ADMIN_SUPPORT_CLOSED: '/admin/support/closed',
  ADMIN_SUPPORT_ANSWERED: '/admin/support/answered',
  ADMIN_SUPPORT_ALL: '/admin/support/all',
  ADMIN_REPORTS_TRANSACTION: '/admin/reports/transaction',
  ADMIN_REPORTS_INVEST: '/admin/reports/invest',
  ADMIN_REPORTS_BV: '/admin/reports/bv',
  ADMIN_REPORTS_REFERRAL: '/admin/reports/referral',
  ADMIN_REPORTS_BINARY: '/admin/reports/binary',
  ADMIN_REPORTS_LOGIN: '/admin/reports/login',
  ADMIN_REPORTS_NOTIFICATION: '/admin/reports/notification',
  ADMIN_SUBSCRIBERS: '/admin/subscribers',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_EXTRA_APPLICATION: '/admin/extra/application',
  ADMIN_EXTRA_SERVER: '/admin/extra/server',
  ADMIN_EXTRA_CACHE: '/admin/extra/cache',
  ADMIN_EXTRA_UPDATE: '/admin/extra/update',
  ADMIN_EXTRA_REPORT_REQUEST: '/admin/extra/report-request',
  ADMIN_RANKING: '/admin/ranking',
  
  // Client routes
  CLIENT_DASHBOARD: '/client/dashboard',
  CLIENT_PLANS: '/client/plans',
  CLIENT_BV_LOG: '/client/bv-log',
  CLIENT_MY_REFERRALS: '/client/my-referrals',
  CLIENT_MY_TREE: '/client/my-tree',
  CLIENT_DEPOSIT: '/client/deposit',
  CLIENT_WITHDRAW: '/client/withdraw',
  CLIENT_BALANCE_TRANSFER: '/client/balance-transfer',
  CLIENT_EPIN_RECHARGE: '/client/epin-recharge',
  CLIENT_TRANSACTIONS: '/client/transactions',
  CLIENT_RANKING: '/client/ranking',
  CLIENT_SUPPORT: '/client/support',
  CLIENT_2FA: '/client/2fa',
  CLIENT_PROFILE: '/client/profile',
  CLIENT_CHANGE_PASSWORD: '/client/change-password',
  
  // Wallet Routes
  CLIENT_WALLETS: '/client/wallets',
  CLIENT_WALLET_DEPOSIT: '/client/wallets/deposit',
  CLIENT_WALLET_ROI: '/client/wallets/roi',
  CLIENT_WALLET_STAKING: '/client/wallets/staking',
  CLIENT_WALLET_REWARDS: '/client/wallets/rewards',
  CLIENT_WALLET_WITHDRAWAL: '/client/wallets/withdrawal',

  // MLM Routes
  CLIENT_TEAM_BUSINESS: '/client/team-business',
  CLIENT_INDIVIDUAL_BUSINESS: '/client/individual-business',
  CLIENT_ROYALTIES: '/client/royalties',
  CLIENT_BONUSES: '/client/bonuses',
  CLIENT_MY_TEAM: '/client/my-team',

  // History & Reports Routes
  CLIENT_HISTORY_REWARDS: '/client/history/rewards',
  CLIENT_HISTORY_STAKING: '/client/history/staking',
  CLIENT_REPORTS: '/client/reports',
};

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  USERS: 'users',
  DEPOSITS: 'deposits',
  WITHDRAWALS: 'withdrawals',
  SUPPORT_TICKETS: 'support_tickets',
  PLANS: 'plans',
  PINS: 'pins',
  TRANSACTIONS: 'transactions',
  RANKINGS: 'rankings',
  WALLET_ADDRESS: 'wallet_address',
  WALLET_CONNECTED: 'wallet_connected',
};

// Supported networks
export const SUPPORTED_NETWORKS = {
  11155111: { name: 'Sepolia', currency: 'ETH' },
  56: { name: 'BSC Mainnet', currency: 'BNB' },
  97: { name: 'BSC Testnet', currency: 'tBNB' },
};

