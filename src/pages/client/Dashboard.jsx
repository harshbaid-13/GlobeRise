import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { dashboardService } from "../../services/dashboardService";
import { formatCurrency } from "../../utils/formatters";
import {
  FaWallet,
  FaTrophy,
  FaUsers,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";
import Loading from "../../components/common/Loading";
import LiveRatesWidget from "../../components/notifications/LiveRatesWidget";
import AnnouncementBanner from "../../components/announcements/AnnouncementBanner";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

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
        dashboardService.getEarningsChart(),
      ]);
      setStats(statsData);
      setChartData(chartDataRes || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
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

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => {
    const colorMap = {
      green: {
        border: "border-green-500",
        icon: "text-green-400",
        iconBg: "bg-green-500/20",
      },
      blue: {
        border: "border-[#00ADB5]",
        icon: "text-[#00ADB5]",
        iconBg: "bg-[#00ADB5]/20",
      },
      purple: {
        border: "border-purple-500",
        icon: "text-purple-400",
        iconBg: "bg-purple-500/20",
      },
      yellow: {
        border: "border-yellow-500",
        icon: "text-yellow-400",
        iconBg: "bg-yellow-500/20",
      },
    };
    const colors = colorMap[color] || colorMap.blue;

    return (
      <div
        className={`bg-[#393E46] rounded-lg shadow-md border-l-4 ${colors.border} p-6 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className={`p-3 ${colors.iconBg} rounded-full`}>
            <Icon className={`${colors.icon} text-xl`} />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    );
  };

  const WalletCard = ({ title, balance, type }) => {
    const colors = {
      deposit: { border: "border-blue-500", icon: "text-blue-400" },
      reward: { border: "border-yellow-500", icon: "text-yellow-400" },
      withdrawal: { border: "border-red-500", icon: "text-red-400" },
    };
    const color = colors[type] || {
      border: "border-gray-500",
      icon: "text-gray-400",
    };

    return (
      <div
        className={`bg-[#222831] rounded-lg border-2 ${color.border} p-4 hover:shadow-lg transition-all`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(balance)}
            </p>
          </div>
          <FaWallet className={`${color.icon} text-2xl`} />
        </div>
      </div>
    );
  };

  // Prepare chart data
  const earningsChartConfig = {
    labels: chartData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Daily Earnings",
        data: chartData.map((item) => parseFloat(item.amount)),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
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
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return "Earnings: $" + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            return "$" + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Announcements Banner */}
      <AnnouncementBanner />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.email?.split("@")[0] || "User"}!
        </h1>
        <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
          <span className="text-white font-bold text-sm">
            Rank: {stats?.rank || "NONE"}
          </span>
        </div>
      </div>

      {/* Live Rates Widget */}
      <LiveRatesWidget />

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
          subtitle={
            stats?.rule6040 ? (
              <span
                className={`flex items-center gap-2 ${
                  stats.rule6040.isValid ? "text-green-400" : "text-red-400"
                }`}
              >
                Stronger Leg is bringing{" "}
                {stats.rule6040.strongerLegPercent.toFixed(1)}%
              </span>
            ) : (
              "Total team volume"
            )
          }
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
      <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaWallet className="text-blue-400" />
          Wallet Balances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WalletCard
            title="Deposit Wallet"
            balance={stats?.walletBalances?.deposit || 0}
            type="deposit"
          />
          <WalletCard
            title="Rewards Wallet"
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
      <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Earnings Trend (Last 7 Days)
        </h2>
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
          <p className="text-sm text-blue-100">
            Start earning with MLM investments
          </p>
        </a>
        <a
          href="/client/staking"
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-2">Fixed Staking</h3>
          <p className="text-sm text-purple-100">
            Lock funds for guaranteed returns
          </p>
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
