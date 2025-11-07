import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import { formatDate } from '../../utils/formatters';
import { useState, useEffect } from 'react';
import { delay } from '../../utils/helpers';
import Loading from '../../components/common/Loading';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    await delay(500);
    setSubscribers([]);
    setLoading(false);
  };

  const columns = [
    { header: 'Email', accessor: 'email' },
    { header: 'Subscribed At', accessor: 'createdAt', render: (value) => formatDate(value) },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-gray-500/20 text-gray-400'}`}>
        {value}
      </span>
    )},
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Subscribers</h1>
      <Card>
        <Table columns={columns} data={subscribers} />
      </Card>
    </div>
  );
};

export default Subscribers;

