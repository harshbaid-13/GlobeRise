import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { useState, useEffect } from 'react';
import { withdrawalService } from '../../../services/withdrawalService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const AllWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const data = await withdrawalService.getAllWithdrawals();
      setWithdrawals(data);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await withdrawalService.updateWithdrawalStatus(id, status);
      loadWithdrawals();
    } catch (error) {
      console.error('Error updating withdrawal:', error);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User ID', accessor: 'userId' },
    { header: 'Amount', accessor: 'amount', render: (value) => formatCurrency(value) },
    { header: 'Method', accessor: 'method' },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'approved' ? 'bg-[#10b981]/20 text-[#10b981]' :
        value === 'pending' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
        'bg-[#ef4444]/20 text-[#ef4444]'
      }`}>
        {value}
      </span>
    )},
    { header: 'Created', accessor: 'createdAt', render: (value) => formatDate(value) },
    { header: 'Actions', accessor: 'id', render: (value, row) => (
      <div className="space-x-2">
        {row.status === 'pending' && (
          <>
            <Button size="sm" variant="success" onClick={() => handleStatusUpdate(value, 'approved')}>
              Approve
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(value, 'rejected')}>
              Reject
            </Button>
          </>
        )}
      </div>
    )},
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">All Withdrawals</h1>
      <Card>
        <Table columns={columns} data={withdrawals} />
      </Card>
    </div>
  );
};

export default AllWithdrawals;

