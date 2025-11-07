import Card from '../../components/common/Card';
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Investment Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="space-y-2 mb-4">
              <p><span className="font-semibold">Min:</span> {formatCurrency(plan.minAmount)}</p>
              <p><span className="font-semibold">Max:</span> {formatCurrency(plan.maxAmount)}</p>
              <p><span className="font-semibold">Return:</span> {plan.returnRate}%</p>
              <p><span className="font-semibold">Duration:</span> {plan.duration} days</p>
            </div>
            <Button variant="primary" className="w-full">Invest Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientPlans;

