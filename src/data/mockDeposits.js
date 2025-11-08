const statuses = ['pending', 'approved', 'successful', 'rejected', 'initiated'];

// Helper function to generate random transaction ID
const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Sample user names and usernames for deposits
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

export const mockDeposits = [];

// Generate deposits based on stats
// Pending: 301
for (let i = 0; i < 301; i++) {
  const user = getRandomUser();
  const amount = i === 6 ? 5000.00 : (i < 3 ? [100.00, 10.00, 10.00][i] : Math.random() * 5000 + 100);
  const charge = amount >= 5000 ? 102.00 : amount >= 100 ? 4.00 : amount * 0.04;
  const gateway = ['Bank Transfer', 'Mobile Money'][Math.floor(Math.random() * 2)];
  const createdAt = new Date('2025-10-03T15:21:00');
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
  createdAt.setHours(Math.floor(Math.random() * 24));
  createdAt.setMinutes(Math.floor(Math.random() * 60));
  
  mockDeposits.push({
    id: `dep_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: parseFloat(amount.toFixed(2)),
    status: 'pending',
    method: gateway,
    gateway: gateway,
    transactionId: generateTransactionId(),
    charge: parseFloat(charge.toFixed(2)),
    conversionRate: 1.00,
    conversionCurrency: 'USD',
    afterCharge: parseFloat((amount + charge).toFixed(2)),
    afterConversion: parseFloat((amount + charge).toFixed(2)),
    userName: user.name,
    username: user.username,
    accountNumber: Math.floor(Math.random() * 1000000000) + 100000000,
    accountName: gateway === 'Bank Transfer' ? 'Cuenta luz stella' : 'Mobile Money Account',
    createdAt: createdAt.toISOString(),
    processedAt: null,
  });
}

// Approved: ~200
for (let i = 0; i < 200; i++) {
  const user = getRandomUser();
  const amount = Math.random() * 5000 + 100;
  const charge = amount >= 5000 ? 102.00 : amount >= 100 ? 4.00 : amount * 0.04;
  const gateway = ['Bank Transfer', 'Credit Card', 'Crypto'][Math.floor(Math.random() * 3)];
  
  mockDeposits.push({
    id: `dep_approved_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: parseFloat(amount.toFixed(2)),
    status: 'approved',
    method: gateway,
    gateway: gateway,
    transactionId: generateTransactionId(),
    charge: parseFloat(charge.toFixed(2)),
    conversionRate: 1.00,
    conversionCurrency: 'USD',
    afterCharge: parseFloat((amount + charge).toFixed(2)),
    afterConversion: parseFloat((amount + charge).toFixed(2)),
    userName: user.name,
    username: user.username,
    accountNumber: Math.floor(Math.random() * 1000000000) + 100000000,
    accountName: gateway === 'Bank Transfer' ? 'Bank Account' : 'Payment Account',
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Successful: ~500
for (let i = 0; i < 500; i++) {
  const user = getRandomUser();
  const amount = Math.random() * 5000 + 100;
  const charge = amount >= 5000 ? 102.00 : amount >= 100 ? 4.00 : amount * 0.04;
  const gateway = ['Bank Transfer', 'Credit Card', 'Crypto', 'PayPal'][Math.floor(Math.random() * 4)];
  
  mockDeposits.push({
    id: `dep_success_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: parseFloat(amount.toFixed(2)),
    status: 'successful',
    method: gateway,
    gateway: gateway,
    transactionId: generateTransactionId(),
    charge: parseFloat(charge.toFixed(2)),
    conversionRate: 1.00,
    conversionCurrency: 'USD',
    afterCharge: parseFloat((amount + charge).toFixed(2)),
    afterConversion: parseFloat((amount + charge).toFixed(2)),
    userName: user.name,
    username: user.username,
    accountNumber: Math.floor(Math.random() * 1000000000) + 100000000,
    accountName: gateway === 'Bank Transfer' ? 'Bank Account' : 'Payment Account',
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Rejected: 0 (as per stats)
// Initiated: ~100
for (let i = 0; i < 100; i++) {
  const user = getRandomUser();
  const amount = Math.random() * 5000 + 100;
  const charge = amount >= 5000 ? 102.00 : amount >= 100 ? 4.00 : amount * 0.04;
  const gateway = ['Bank Transfer', 'Credit Card', 'Crypto'][Math.floor(Math.random() * 3)];
  
  mockDeposits.push({
    id: `dep_init_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: parseFloat(amount.toFixed(2)),
    status: 'initiated',
    method: gateway,
    gateway: gateway,
    transactionId: generateTransactionId(),
    charge: parseFloat(charge.toFixed(2)),
    conversionRate: 1.00,
    conversionCurrency: 'USD',
    afterCharge: parseFloat((amount + charge).toFixed(2)),
    afterConversion: parseFloat((amount + charge).toFixed(2)),
    userName: user.name,
    username: user.username,
    accountNumber: Math.floor(Math.random() * 1000000000) + 100000000,
    accountName: gateway === 'Bank Transfer' ? 'Bank Account' : 'Payment Account',
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: null,
  });
}

