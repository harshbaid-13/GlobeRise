import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { formatDate } from '../../../utils/formatters';
import { useState, useEffect } from 'react';
import { delay } from '../../../utils/helpers';
import Loading from '../../../components/common/Loading';

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    await delay(500);
    setHistory([]);
    setLoading(false);
  };

  const columns = [
    { header: 'User ID', accessor: 'userId' },
    { header: 'IP Address', accessor: 'ipAddress' },
    { header: 'Device', accessor: 'device' },
    { header: 'Date', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Login History</h1>
      <Card>
        <Table columns={columns} data={history} />
      </Card>
    </div>
  );
};

export default LoginHistory;

