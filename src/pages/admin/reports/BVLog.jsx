import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useState, useEffect } from 'react';
import { delay } from '../../../utils/helpers';
import Loading from '../../../components/common/Loading';

const BVLog = () => {
  const [bvLogs, setBvLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBVLogs();
  }, []);

  const loadBVLogs = async () => {
    await delay(500);
    setBvLogs([]);
    setLoading(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User ID', accessor: 'userId' },
    { header: 'BV Amount', accessor: 'amount', render: (value) => formatCurrency(value) },
    { header: 'Type', accessor: 'type' },
    { header: 'Date', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">BV Log</h1>
      <Card>
        <Table columns={columns} data={bvLogs} />
      </Card>
    </div>
  );
};

export default BVLog;

