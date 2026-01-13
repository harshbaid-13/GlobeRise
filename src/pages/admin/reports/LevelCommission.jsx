import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useState, useEffect } from 'react';
import { delay } from '../../../utils/helpers';
import Loading from '../../../components/common/Loading';

// Frontend-only mock for level commission report
const LevelCommission = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    await delay(500);
    // Dummy data for level commission transactions
    const dummyCommissions = [
      {
        id: 'LC001',
        userName: 'John Doe',
        fromUserName: 'Alice Smith',
        level: 1,
        amount: 150.50,
        createdAt: new Date('2024-01-15T10:30:00'),
      },
      {
        id: 'LC002',
        userName: 'John Doe',
        fromUserName: 'Bob Johnson',
        level: 2,
        amount: 75.25,
        createdAt: new Date('2024-01-15T11:15:00'),
      },
      {
        id: 'LC003',
        userName: 'Jane Williams',
        fromUserName: 'Charlie Brown',
        level: 1,
        amount: 200.00,
        createdAt: new Date('2024-01-15T12:00:00'),
      },
      {
        id: 'LC004',
        userName: 'Mike Davis',
        fromUserName: 'David Wilson',
        level: 3,
        amount: 60.00,
        createdAt: new Date('2024-01-15T13:45:00'),
      },
      {
        id: 'LC005',
        userName: 'Sarah Miller',
        fromUserName: 'Emily Taylor',
        level: 1,
        amount: 180.75,
        createdAt: new Date('2024-01-15T14:20:00'),
      },
      {
        id: 'LC006',
        userName: 'Tom Anderson',
        fromUserName: 'Frank Moore',
        level: 4,
        amount: 48.00,
        createdAt: new Date('2024-01-15T15:10:00'),
      },
      {
        id: 'LC007',
        userName: 'Lisa Garcia',
        fromUserName: 'George Martinez',
        level: 2,
        amount: 90.50,
        createdAt: new Date('2024-01-15T16:00:00'),
      },
      {
        id: 'LC008',
        userName: 'Robert Lee',
        fromUserName: 'Helen White',
        level: 5,
        amount: 36.75,
        createdAt: new Date('2024-01-15T17:30:00'),
      },
      {
        id: 'LC009',
        userName: 'Patricia Harris',
        fromUserName: 'Ian Clark',
        level: 1,
        amount: 165.25,
        createdAt: new Date('2024-01-16T09:15:00'),
      },
      {
        id: 'LC010',
        userName: 'James Lewis',
        fromUserName: 'Karen Walker',
        level: 6,
        amount: 30.00,
        createdAt: new Date('2024-01-16T10:00:00'),
      },
      {
        id: 'LC011',
        userName: 'Mary Young',
        fromUserName: 'Larry Hall',
        level: 3,
        amount: 55.50,
        createdAt: new Date('2024-01-16T11:45:00'),
      },
      {
        id: 'LC012',
        userName: 'William Allen',
        fromUserName: 'Nancy King',
        level: 7,
        amount: 27.75,
        createdAt: new Date('2024-01-16T12:30:00'),
      },
      {
        id: 'LC013',
        userName: 'Elizabeth Wright',
        fromUserName: 'Oliver Scott',
        level: 8,
        amount: 20.00,
        createdAt: new Date('2024-01-16T13:15:00'),
      },
      {
        id: 'LC014',
        userName: 'Christopher Green',
        fromUserName: 'Pamela Adams',
        level: 2,
        amount: 85.25,
        createdAt: new Date('2024-01-16T14:00:00'),
      },
      {
        id: 'LC015',
        userName: 'Jennifer Baker',
        fromUserName: 'Quinn Nelson',
        level: 9,
        amount: 18.50,
        createdAt: new Date('2024-01-16T15:45:00'),
      },
    ];
    setCommissions(dummyCommissions);
    setLoading(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User', accessor: 'userName' },
    { header: 'From User', accessor: 'fromUserName' },
    { header: 'Level', accessor: 'level' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (value) => formatCurrency(value),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (value) => formatDate(value),
    },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Level Commission</h1>
      <Card>
        <Table columns={columns} data={commissions} />
      </Card>
    </div>
  );
};

export default LevelCommission;


