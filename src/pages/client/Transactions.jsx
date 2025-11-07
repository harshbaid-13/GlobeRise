import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useState, useEffect } from 'react';
import { mockTransactions } from '../../data/mockTransactions';
import { delay } from '../../utils/helpers';
import Loading from '../../components/common/Loading';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await delay(500);
    setTransactions(mockTransactions.slice(0, 50));
    setLoading(false);
  };

  const columns = [
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
      <h1 className="text-2xl font-bold text-white mb-6">Transactions</h1>
      <Card>
        <Table columns={columns} data={transactions} />
      </Card>
    </div>
  );
};

export default Transactions;

