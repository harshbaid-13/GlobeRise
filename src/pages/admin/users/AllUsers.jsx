import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Name', accessor: 'name' },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
        {value}
      </span>
    )},
    { header: 'Balance', accessor: 'balance', render: (value) => formatCurrency(value) },
    { header: 'Created', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">All Users</h1>
      <Card>
        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
};

export default AllUsers;

