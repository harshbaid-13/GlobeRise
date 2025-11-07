export const mockTransactions = [];

// Generate transaction history
const transactionTypes = ['deposit', 'withdrawal', 'investment', 'commission', 'referral', 'binary'];

for (let i = 0; i < 1000; i++) {
  const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const amount = Math.random() * 5000 + 10;
  
  mockTransactions.push({
    id: `txn_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    type,
    amount,
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
    description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    transactionId: `TXN${Date.now()}${i}`,
  });
}

