const ticketStatuses = ['pending', 'answered', 'closed'];
const priorities = ['low', 'medium', 'high'];

export const mockSupportTickets = [];

// Pending: 65
for (let i = 0; i < 65; i++) {
  mockSupportTickets.push({
    id: `ticket_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    subject: `Support Ticket ${i + 1}`,
    message: `This is a support ticket message ${i + 1}. User needs help with their account.`,
    status: 'pending',
    priority: priorities[Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    answeredAt: null,
    closedAt: null,
    responses: [],
  });
}

// Answered: ~200
for (let i = 0; i < 200; i++) {
  mockSupportTickets.push({
    id: `ticket_answered_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    subject: `Support Ticket Answered ${i + 1}`,
    message: `This is an answered support ticket ${i + 1}.`,
    status: 'answered',
    priority: priorities[Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    answeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: null,
    responses: [
      {
        id: `resp_${i + 1}`,
        message: 'Thank you for contacting us. We have resolved your issue.',
        adminId: '1',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  });
}

// Closed: ~300
for (let i = 0; i < 300; i++) {
  mockSupportTickets.push({
    id: `ticket_closed_${i + 1}`,
    userId: String(Math.floor(Math.random() * 1281) + 1),
    subject: `Support Ticket Closed ${i + 1}`,
    message: `This is a closed support ticket ${i + 1}.`,
    status: 'closed',
    priority: priorities[Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    answeredAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: `resp_closed_${i + 1}`,
        message: 'Issue resolved. Ticket closed.',
        adminId: '1',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  });
}

