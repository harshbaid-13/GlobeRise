import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/formatters';
import { FaWallet, FaTrophy, FaUsers, FaChartLine, FaCoins } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ClientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, chartDataRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getEarningsChart()
      ]);
      setStats(statsData);
      setChartData(chartDataRes || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-white rounded-lg shadow-md border-l-4 border-${color}-500 p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  const WalletCard = ({ title, balance, type }) => {
    const colors = {
      fiat: 'green',
      deposit: 'blue',
      staking: 'purple',
      reward: 'yellow',
      withdrawal: 'red'
    };
    const color = colors[type] || 'gray';

    return (
      <div className={`bg-[#1a1f2e] rounded-lg border border-[#374151] p-4 hover:border-${color}-500 transition-colors`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(balance)}</p>
          </div>
          <FaWallet className={`text-${color}-400 text-2xl`} />
        </div>
      </div>
    );
  };

  // Prepare chart data
  const earningsChartConfig = {
    labels: chartData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Daily Earnings',
        data: chartData.map(item => parseFloat(item.amount)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return 'Earnings: $' + context.parsed.y.toFixed(2);
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function (value) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
        }
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
        <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
          <span className="text-white font-bold text-sm">Rank: {stats?.rank || 'NONE'}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={formatCurrency(stats?.totalEarnings || 0)}
          icon={FaCoins}
          color="green"
          subtitle="All time earnings"
        />
        <StatCard
          title="Team Business"
          value={formatCurrency(stats?.teamBusiness || 0)}
          icon={FaUsers}
          color="blue"
          subtitle="Total team volume"
        />
        <StatCard
          title="Direct Business"
          value={formatCurrency(stats?.directBusiness || 0)}
          icon={FaChartLine}
          color="purple"
          subtitle="Your direct referrals"
        />
        <StatCard
          title="Last Month"
          value={formatCurrency(stats?.lastMonthBusiness || 0)}
          icon={FaTrophy}
          color="yellow"
          subtitle="Previous month volume"
        />
      </div>

      {/* Wallet Balances Section */}
      <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaWallet className="text-blue-400" />
          Wallet Balances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <WalletCard
            title="Fiat Wallet"
            balance={stats?.walletBalances?.fiat || 0}
            type="fiat"
          />
          <WalletCard
            title="Deposit Wallet"
            balance={stats?.walletBalances?.deposit || 0}
            type="deposit"
          />
          <WalletCard
            title="Staking Wallet"
            balance={stats?.walletBalances?.staking || 0}
            type="staking"
          />
          <WalletCard
            title="Reward Wallet"
            balance={stats?.walletBalances?.reward || 0}
            type="reward"
          />
          <WalletCard
            title="Withdrawal Wallet"
            balance={stats?.walletBalances?.withdrawal || 0}
            type="withdrawal"
          />
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
        <h2 className="text-xl font-bold text-white mb-4">Earnings Trend (Last 7 Days)</h2>
        <div className="h-80">
          {chartData.length > 0 ? (
            <Line data={earningsChartConfig} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No earnings data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/client/investments"
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-2">Create Package</h3>
          <p className="text-sm text-blue-100">Start earning with MLM investments</p>
        </a>
        <a
          href="/client/staking"
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-2">Fixed Staking</h3>
          <p className="text-sm text-purple-100">Lock funds for guaranteed returns</p>
        </a>
        <a
          href="/client/my-team"
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-2">View Team</h3>
          <p className="text-sm text-green-100">Manage your downline network</p>
        </a>
      </div>
    </div>
  );
};

export default ClientDashboard;

