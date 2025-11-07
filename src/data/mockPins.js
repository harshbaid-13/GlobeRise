// Generate a random pin number in format: xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx
const generatePinNumber = () => {
  const generateSegment = () => String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  return `${generateSegment()}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
};

// Sample usernames for createdBy field
const sampleUsernames = ['admin', 'demodemol', 'pradeep45', 'username110', 'dheeraj1234', 'sudin123'];

export const mockPins = [];

// Generate various types of pins
const pinTypes = ['user', 'admin'];
const statuses = ['used', 'unused'];
const amounts = [1, 2, 10, 100];

// User Pins
for (let i = 0; i < 500; i++) {
  const status = statuses[Math.floor(Math.random() * 2)];
  const createdBy = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
  const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
  const usedAt = status === 'used' ? new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())) : null;
  
  mockPins.push({
    id: `pin_user_${i + 1}`,
    pin: generatePinNumber(),
    type: 'user',
    status: status,
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    createdBy: createdBy,
    usedBy: status === 'used' ? String(Math.floor(Math.random() * 1281) + 1) : null,
    usedAt: usedAt ? usedAt.toISOString() : null,
    createdAt: createdAt.toISOString(),
  });
}

// Admin Pins
for (let i = 0; i < 200; i++) {
  const status = statuses[Math.floor(Math.random() * 2)];
  const createdBy = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
  const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
  const usedAt = status === 'used' ? new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())) : null;
  
  mockPins.push({
    id: `pin_admin_${i + 1}`,
    pin: generatePinNumber(),
    type: 'admin',
    status: status,
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    createdBy: createdBy,
    usedBy: status === 'used' ? String(Math.floor(Math.random() * 1281) + 1) : null,
    usedAt: usedAt ? usedAt.toISOString() : null,
    createdAt: createdAt.toISOString(),
  });
}

