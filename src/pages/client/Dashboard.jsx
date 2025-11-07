import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Balance</h3>
          <p className="text-3xl font-bold text-[#00d4ff]">{formatCurrency(user?.balance || 0)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Deposited</h3>
          <p className="text-3xl font-bold text-[#10b981]">{formatCurrency(user?.totalDeposited || 0)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Withdrawn</h3>
          <p className="text-3xl font-bold text-[#ef4444]">{formatCurrency(user?.totalWithdrawn || 0)}</p>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;

