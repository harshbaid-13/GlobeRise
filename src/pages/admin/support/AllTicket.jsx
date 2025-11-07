import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { useState, useEffect } from 'react';
import { supportService } from '../../../services/supportService';
import { formatDate } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const AllTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await supportService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'User ID', accessor: 'userId' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'closed' ? 'bg-gray-500/20 text-gray-400' :
        value === 'answered' ? 'bg-[#10b981]/20 text-[#10b981]' :
        'bg-[#f59e0b]/20 text-[#f59e0b]'
      }`}>
        {value}
      </span>
    )},
    { header: 'Priority', accessor: 'priority', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'high' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
        value === 'medium' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
        'bg-gray-500/20 text-gray-400'
      }`}>
        {value}
      </span>
    )},
    { header: 'Created', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">All Support Tickets</h1>
      <Card>
        <Table columns={columns} data={tickets} />
      </Card>
    </div>
  );
};

export default AllTicket;

