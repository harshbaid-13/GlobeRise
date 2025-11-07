export const mockPins = [];

// Generate various types of pins
const pinTypes = ['user', 'admin'];
const statuses = ['used', 'unused'];

// User Pins
for (let i = 0; i < 500; i++) {
  mockPins.push({
    id: `pin_user_${i + 1}`,
    pin: `PIN${String(100000 + i).slice(-6)}`,
    type: 'user',
    status: statuses[Math.floor(Math.random() * 2)],
    usedBy: statuses[0] === 'used' ? String(Math.floor(Math.random() * 1281) + 1) : null,
    usedAt: statuses[0] === 'used' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : null,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

// Admin Pins
for (let i = 0; i < 200; i++) {
  mockPins.push({
    id: `pin_admin_${i + 1}`,
    pin: `ADMIN${String(10000 + i).slice(-5)}`,
    type: 'admin',
    status: statuses[Math.floor(Math.random() * 2)],
    usedBy: statuses[0] === 'used' ? String(Math.floor(Math.random() * 1281) + 1) : null,
    usedAt: statuses[0] === 'used' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : null,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

