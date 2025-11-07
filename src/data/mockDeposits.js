const statuses = ['pending', 'approved', 'successful', 'rejected', 'initiated'];

export const mockDeposits = [];

// Generate deposits based on stats
// Pending: 301
for (let i = 0; i < 301; i++) {
  mockDeposits.push({
    id: `dep_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: Math.random() * 5000 + 100,
    status: 'pending',
    method: ['Bank Transfer', 'Credit Card', 'Crypto', 'PayPal'][Math.floor(Math.random() * 4)],
    transactionId: `TXN${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: null,
  });
}

// Approved: ~200
for (let i = 0; i < 200; i++) {
  mockDeposits.push({
    id: `dep_approved_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: Math.random() * 5000 + 100,
    status: 'approved',
    method: ['Bank Transfer', 'Credit Card', 'Crypto'][Math.floor(Math.random() * 3)],
    transactionId: `TXN${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Successful: ~500
for (let i = 0; i < 500; i++) {
  mockDeposits.push({
    id: `dep_success_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: Math.random() * 5000 + 100,
    status: 'successful',
    method: ['Bank Transfer', 'Credit Card', 'Crypto', 'PayPal'][Math.floor(Math.random() * 4)],
    transactionId: `TXN${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Rejected: 0 (as per stats)
// Initiated: ~100
for (let i = 0; i < 100; i++) {
  mockDeposits.push({
    id: `dep_init_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    amount: Math.random() * 5000 + 100,
    status: 'initiated',
    method: ['Bank Transfer', 'Credit Card', 'Crypto'][Math.floor(Math.random() * 3)],
    transactionId: `TXN${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: null,
  });
}

