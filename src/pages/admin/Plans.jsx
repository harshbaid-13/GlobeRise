import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { useState, useEffect } from 'react';
import { planService } from '../../services/planService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Min Amount', accessor: 'minAmount', render: (value) => formatCurrency(value) },
    { header: 'Max Amount', accessor: 'maxAmount', render: (value) => formatCurrency(value) },
    { header: 'Return Rate', accessor: 'returnRate', render: (value) => `${value}%` },
    { header: 'Duration', accessor: 'duration', render: (value) => `${value} days` },
    { header: 'Status', accessor: 'status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-gray-500/20 text-gray-400'}`}>
        {value}
      </span>
    )},
  ];

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Plans</h1>
        <Button variant="primary">Add New Plan</Button>
      </div>
      
      <Card>
        <Table columns={columns} data={plans} />
      </Card>
    </div>
  );
};

export default Plans;

