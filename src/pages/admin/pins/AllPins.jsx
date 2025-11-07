import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { useState, useEffect } from 'react';
import { pinService } from '../../../services/pinService';
import { formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const AllPins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    try {
      const data = await pinService.getAllPins();
      setPins(data);
    } catch (error) {
      console.error('Error loading pins:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'PIN', accessor: 'pin' },
    { header: 'Type', accessor: 'type', render: (value) => value.charAt(0).toUpperCase() + value.slice(1) },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${value === 'used' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#10b981]/20 text-[#10b981]'}`}>
        {value}
      </span>
    )},
    { header: 'Used By', accessor: 'usedBy' },
    { header: 'Used At', accessor: 'usedAt', render: (value) => value ? formatDate(value) : '-' },
    { header: 'Created At', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">All Pins</h1>
      <Card>
        <Table columns={columns} data={pins} />
      </Card>
    </div>
  );
};

export default AllPins;

