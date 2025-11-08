// Helper function to generate random transaction ID
const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Sample user names and usernames for withdrawals
const sampleUsers = [
  { name: 'testing 542145', username: '23523aae' },
  { name: 'Arvind3 Kumar', username: 'arvind_23' },
  { name: 'Work Adhdh', username: 'adeyemi' },
  { name: 'FELIPE LOPES', username: 'johnade' },
  { name: 'Pradeep Pandey', username: 'pradeep45' },
  { name: 'Hedley test', username: 'username110' },
];

// Helper to get random user info
const getRandomUser = () => {
  return sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
};

export const mockWithdrawals = [];

// Pending: 26
for (let i = 0; i < 26; i++) {
  const user = getRandomUser();
  const amount = Math.random() * 3000 + 50;
  const charge = amount * 0.02; // 2% charge
  const gateway = ['Bank Transfer', 'Crypto', 'PayPal'][Math.floor(Math.random() * 3)];
  
  mockWithdrawals.push({
    id: `wd_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: parseFloat(amount.toFixed(2)),
    status: 'pending',
    method: gateway,
    gateway: gateway,
    transactionId: generateTransactionId(),
    charge: parseFloat(charge.toFixed(2)),
    conversionRate: 1.00,
    conversionCurrency: 'USD',
    afterCharge: parseFloat((amount - charge).toFixed(2)),
    afterConversion: parseFloat((amount - charge).toFixed(2)),
    userName: user.name,
    username: user.username,
    accountNumber: Math.floor(Math.random() * 1000000000) + 100000000,
    accountName: gateway === 'Bank Transfer' ? 'Bank Account' : 'Payment Account',
    accountDetails: `Account ending in ${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: null,
  });
}

// Approved: ~150
for (let i = 0; i < 150; i++) {
  const user = getRandomUser();
  const amount = Math.random() * 3000 + 50;
  const charge = amount * 0.02; // 2% charge
  const gateway = ['Bank Transfer', 'Crypto'][Math.floor(Math.random() * 2)];
  
  mockWithdrawals.push({
    id: `wd_approved_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: parseFloat(amount.toFixed(2)),
    status: 'approved',
    method: gateway,
    gateway: gateway,
    transactionId: generateTransactionId(),
    charge: parseFloat(charge.toFixed(2)),
    conversionRate: 1.00,
    conversionCurrency: 'USD',
    afterCharge: parseFloat((amount - charge).toFixed(2)),
    afterConversion: parseFloat((amount - charge).toFixed(2)),
    userName: user.name,
    username: user.username,
    accountNumber: Math.floor(Math.random() * 1000000000) + 100000000,
    accountName: gateway === 'Bank Transfer' ? 'Bank Account' : 'Payment Account',
    accountDetails: `Account ending in ${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Rejected: 1
const rejectedUser = getRandomUser();
mockWithdrawals.push({
  id: 'wd_rejected_1',
  userId: String(Math.floor(Math.random() * 1281) + 1),
  amount: 500.00,
  status: 'rejected',
  method: 'Bank Transfer',
  gateway: 'Bank Transfer',
  transactionId: 'WD_REJECTED_001',
  charge: 10.00,
  conversionRate: 1.00,
  conversionCurrency: 'USD',
  afterCharge: 490.00,
  afterConversion: 490.00,
  userName: rejectedUser.name,
  username: rejectedUser.username,
  accountNumber: 123456789,
  accountName: 'Bank Account',
  accountDetails: 'Account ending in 1234',
  reason: 'Insufficient funds',
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  processedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
});

