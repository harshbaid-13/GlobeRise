import Button from '../../components/common/Button';
import { useState, useEffect } from 'react';
import { planService } from '../../services/planService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

const ClientPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await planService.getAllPlans();
      setPlans(data.filter(p => p.status === 'active'));
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
            <div className="space-y-2 mb-4 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Min:</span> {formatCurrency(plan.minAmount)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Max:</span> {formatCurrency(plan.maxAmount)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Return:</span> {plan.returnRate}%
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Duration:</span> {plan.duration} days
              </p>
            </div>
            <Button variant="primary" className="w-full">Invest Now</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPlans;

