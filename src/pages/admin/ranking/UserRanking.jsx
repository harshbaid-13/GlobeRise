import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { formatCurrency } from '../../../utils/formatters';
import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import Loading from '../../../components/common/Loading';

const UserRanking = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      // Sort by total deposited
      const sorted = [...data].sort((a, b) => b.totalDeposited - a.totalDeposited);
      setUsers(sorted);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Rank', accessor: 'id', render: (value, row, index) => index + 1 },
    { header: 'Username', accessor: 'username' },
    { header: 'Name', accessor: 'name' },
    { header: 'Total Deposited', accessor: 'totalDeposited', render: (value) => formatCurrency(value) },
    { header: 'Total Withdrawn', accessor: 'totalWithdrawn', render: (value) => formatCurrency(value) },
    { header: 'Balance', accessor: 'balance', render: (value) => formatCurrency(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Ranking</h1>
      <Card>
        <Table columns={columns} data={users.slice(0, 100)} />
      </Card>
    </div>
  );
};

export default UserRanking;

