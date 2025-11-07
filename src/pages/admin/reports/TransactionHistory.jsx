import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { useState, useEffect } from 'react';
import { mockTransactions } from '../../../data/mockTransactions';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';
import { delay } from '../../../utils/helpers';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await delay(500);
    setTransactions(mockTransactions);
    setLoading(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User ID', accessor: 'userId' },
    { header: 'Type', accessor: 'type', render: (value) => value.charAt(0).toUpperCase() + value.slice(1) },
    { header: 'Amount', accessor: 'amount', render: (value) => formatCurrency(value) },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'completed' ? 'bg-[#10b981]/20 text-[#10b981]' :
        value === 'pending' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
        'bg-[#ef4444]/20 text-[#ef4444]'
      }`}>
        {value}
      </span>
    )},
    { header: 'Date', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Transaction History</h1>
      <Card>
        <Table columns={columns} data={transactions} />
      </Card>
    </div>
  );
};

export default TransactionHistory;

