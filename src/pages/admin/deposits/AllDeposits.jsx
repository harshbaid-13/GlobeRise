import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { useState, useEffect } from 'react';
import { depositService } from '../../../services/depositService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const AllDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      const data = await depositService.getAllDeposits();
      setDeposits(data);
    } catch (error) {
      console.error('Error loading deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await depositService.updateDepositStatus(id, status);
      loadDeposits();
    } catch (error) {
      console.error('Error updating deposit:', error);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User ID', accessor: 'userId' },
    { header: 'Amount', accessor: 'amount', render: (value) => formatCurrency(value) },
    { header: 'Method', accessor: 'method' },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'successful' ? 'bg-[#10b981]/20 text-[#10b981]' :
        value === 'pending' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
        value === 'rejected' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
        'bg-[#00d4ff]/20 text-[#00d4ff]'
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
      <h1 className="text-2xl font-bold text-white mb-6">All Deposits</h1>
      <Card>
        <Table columns={columns} data={deposits} />
      </Card>
    </div>
  );
};

export default AllDeposits;

