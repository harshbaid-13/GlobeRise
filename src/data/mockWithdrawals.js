export const mockWithdrawals = [];

// Pending: 26
for (let i = 0; i < 26; i++) {
  mockWithdrawals.push({
    id: `wd_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: Math.random() * 3000 + 50,
    status: 'pending',
    method: ['Bank Transfer', 'Crypto', 'PayPal'][Math.floor(Math.random() * 3)],
    accountDetails: `Account ending in ${Math.floor(Math.random() * 10000)}`,
    transactionId: `WD${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: null,
  });
}

// Approved: ~150
for (let i = 0; i < 150; i++) {
  mockWithdrawals.push({
    id: `wd_approved_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: Math.random() * 3000 + 50,
    status: 'approved',
    method: ['Bank Transfer', 'Crypto'][Math.floor(Math.random() * 2)],
    accountDetails: `Account ending in ${Math.floor(Math.random() * 10000)}`,
    transactionId: `WD${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Rejected: 1
mockWithdrawals.push({
  id: 'wd_rejected_1',
  userId: String(Math.floor(Math.random() * 1281) + 1),
  amount: 500.00,
  status: 'rejected',
  method: 'Bank Transfer',
  accountDetails: 'Account ending in 1234',
  transactionId: 'WD_REJECTED_001',
  reason: 'Insufficient funds',
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  processedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
});

