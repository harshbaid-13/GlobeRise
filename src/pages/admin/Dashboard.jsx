import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaUserCheck,
  FaEnvelope,
  FaMobileAlt,
  FaDollarSign,
  FaTimesCircle,
  FaSpinner,
  FaPercentage,
  FaBuilding,
  FaCreditCard,
  FaTree,
  FaWaveSquare,
  FaArrowRight,
  FaCut,
  FaShoppingCart,
  FaArrowLeft,
  FaList,
  FaPlus,
  FaMinus,
  FaSearch,
  FaHandPaper,
  FaHome,
  FaBars,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockStats } from '../../data/mockStats';
import { formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/common/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState(mockStats);
  const [dateRange] = useState('October 24, 2025 - November 7, 2025');

  // Zoom state for each chart
  const [chartZooms, setChartZooms] = useState({
    depositWithdraw: { startIndex: 0, endIndex: stats.depositWithdrawData.length - 1 },
    transactions: { startIndex: 0, endIndex: stats.transactionData.length - 1 },
    depositWithdrawLine: { startIndex: 0, endIndex: stats.depositWithdrawData.length - 1 },
    transactionsLine: { startIndex: 0, endIndex: stats.transactionData.length - 1 },
  });

  const COLORS = {
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    blue: '#00ADB5',
    coral: '#ff7f7f',
    mutedPurple: '#8b8bb8',
    yellow: '#ffd700',
  };

  // Colors matching the image: coral/light red, muted purple/blue, orange, pale yellow
  const pieColors = ['#ff7f7f', '#8b8bb8', '#ffa500', '#ffffe0', '#ffd700'];

  const StatCard = ({ title, value, icon: Icon, color, onClick, small = false }) => {
    const colorClasses = {
      purple: { border: 'border-2 border-purple-500', text: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-500/20' },
      green: { border: 'border-2 border-green-500', text: 'text-green-600 dark:text-green-400', iconBg: 'bg-green-100 dark:bg-green-500/20' },
      red: { border: 'border-2 border-red-500', text: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-500/20' },
      orange: { border: 'border-2 border-orange-500', text: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-500/20' },
      blue: { border: 'border-2 border-blue-500', text: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-500/20' },
    };

    const colorStyle = colorClasses[color] || colorClasses.blue;

    return (
      <div
        className={`bg-[var(--card-bg)] rounded-lg shadow-md border border-[var(--border-color)] ${colorStyle.border} ${small ? 'p-4' : 'p-6'} cursor-pointer hover:shadow-lg transition-all`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">{title}</p>
            <p className={`${small ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-primary)]`}>{value}</p>
          </div>
          <div className={`${colorStyle.iconBg} ${small ? 'p-2' : 'p-3'} rounded-full`}>
            <Icon className={`${small ? 'text-xl' : 'text-2xl'} ${colorStyle.text}`} />
          </div>
          {onClick && <FaArrowRight className="text-[var(--text-tertiary)] ml-2" />}
        </div>
      </div>
    );
  };

  const FinancialCard = ({ title, value, icon: Icon, bgColor, textColor, iconColor }) => {
    return (
      <div className={`${bgColor} rounded-lg shadow-md p-6 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <Icon className={`text-2xl ${iconColor || 'text-white'}`} />
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };

  const BVCard = ({ title, value, icon: Icon, iconBg }) => {
    return (
      <div className="bg-[var(--card-bg)] rounded-lg shadow-md border border-[var(--border-color)] p-6 cursor-pointer hover:shadow-lg transition-all">
        <div className="flex items-center justify-between">
          <div className={`${iconBg} p-3 rounded-full`}>
            <Icon className="text-2xl text-[var(--text-primary)]" />
          </div>
          <div className="flex-1 ml-4">
            <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">{title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          </div>
          <FaArrowRight className="text-[var(--text-tertiary)]" />
        </div>
      </div>
    );
  };

  const DepositWithdrawCard = ({ title, value, icon: Icon, color, onClick, border }) => {
    const colorClasses = {
      green: { iconBg: 'bg-green-100 dark:bg-green-500/20', iconColor: 'text-green-600 dark:text-green-400' },
      orange: { iconBg: 'bg-orange-100 dark:bg-orange-500/20', iconColor: 'text-orange-600 dark:text-orange-400' },
      red: { iconBg: 'bg-red-100 dark:bg-red-500/20', iconColor: 'text-red-600 dark:text-red-400' },
      purple: { iconBg: 'bg-purple-100 dark:bg-purple-500/20', iconColor: 'text-purple-600 dark:text-purple-400' },
    };

    const colorStyle = colorClasses[color] || colorClasses.green;

    return (
      <div
        className={`p-4 cursor-pointer hover:bg-[var(--bg-hover)] border-[var(--border-color)] transition-all ${border}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`${colorStyle.iconBg} p-3 rounded-lg`}>
              <Icon className={`text-2xl ${colorStyle.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-xl text-[var(--text-primary)] mb-1">{value}</p>
              <p className="text-sm font-medium text-[var(--text-tertiary)]">{title}</p>
            </div>
          </div>
          {onClick && <FaArrowRight className="text-[var(--text-tertiary)] text-lg" />}
        </div>
      </div>
    );
  };

  const handleZoomIn = (chartKey) => {
    setChartZooms(prev => {
      const current = prev[chartKey];
      const range = current.endIndex - current.startIndex;
      const newRange = Math.max(3, Math.floor(range * 0.7)); // Zoom in by 30%, minimum 3 points
      const center = Math.floor((current.startIndex + current.endIndex) / 2);
      const maxIndex = chartKey.includes('transaction')
        ? stats.transactionData.length - 1
        : stats.depositWithdrawData.length - 1;

      return {
        ...prev,
        [chartKey]: {
          startIndex: Math.max(0, center - Math.floor(newRange / 2)),
          endIndex: Math.min(maxIndex, center + Math.floor(newRange / 2)),
        },
      };
    });
  };

  const handleZoomOut = (chartKey) => {
    setChartZooms(prev => {
      const current = prev[chartKey];
      const range = current.endIndex - current.startIndex;
      const newRange = Math.floor(range * 1.3); // Zoom out by 30%
      const center = Math.floor((current.startIndex + current.endIndex) / 2);
      const maxIndex = chartKey.includes('transaction')
        ? stats.transactionData.length - 1
        : stats.depositWithdrawData.length - 1;

      const newStart = Math.max(0, center - Math.floor(newRange / 2));
      const newEnd = Math.min(maxIndex, center + Math.floor(newRange / 2));

      return {
        ...prev,
        [chartKey]: {
          startIndex: newStart,
          endIndex: newEnd,
        },
      };
    });
  };

  const handleResetZoom = (chartKey) => {
    const maxIndex = chartKey.includes('transaction')
      ? stats.transactionData.length - 1
      : stats.depositWithdrawData.length - 1;

    setChartZooms(prev => ({
      ...prev,
      [chartKey]: {
        startIndex: 0,
        endIndex: maxIndex,
      },
    }));
  };

  const ChartCard = ({ title, children, dateRange, showControls = true, chartKey }) => {
    return (
      <div className="bg-[var(--card-bg)] rounded-lg shadow-md border border-[var(--border-color)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <div className="flex items-center space-x-2">
            {dateRange && (
              <div className="text-sm text-[var(--text-secondary)] border border-[var(--border-color)] rounded px-3 py-1 flex items-center cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
                {dateRange}
                <span className="ml-2 text-xs">▼</span>
              </div>
            )}
            {showControls && chartKey && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleZoomIn(chartKey)}
                  className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                  title="Zoom In"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleZoomOut(chartKey)}
                  className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                  title="Zoom Out"
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <button
                  className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                  title="Zoom"
                >
                  <FaSearch className="w-3 h-3" />
                </button>
                <button
                  className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                  title="Pan"
                >
                  <FaHandPaper className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleResetZoom(chartKey)}
                  className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                  title="Reset View"
                >
                  <FaHome className="w-3 h-3" />
                </button>
                <button
                  className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
                  title="Menu"
                >
                  <FaBars className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full" style={{ height: '300px' }}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Title and Cron Setup */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <Button variant="primary" className="flex items-center" size="sm">
          <FaList className="mr-2" />
          Cron Setup
        </Button>
      </div>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FaUsers}
          color="purple"
          onClick={() => navigate(ROUTES.ADMIN_USERS_ALL)}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={FaUserCheck}
          color="green"
          onClick={() => navigate(ROUTES.ADMIN_USERS_ACTIVE)}
        />
        <StatCard
          title="Email Unverified Users"
          value={stats.emailUnverifiedUsers}
          icon={FaEnvelope}
          color="red"
          onClick={() => navigate(ROUTES.ADMIN_USERS_EMAIL_UNVERIFIED)}
        />
        <StatCard
          title="Mobile Unverified Users"
          value={stats.mobileUnverifiedUsers}
          icon={FaMobileAlt}
          color="orange"
          onClick={() => navigate(ROUTES.ADMIN_USERS_MOBILE_UNVERIFIED)}
        />
      </div>

      {/* Deposits and Withdrawals Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposits Section */}
        <div className='bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] mr-2'>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] m-5 mb-0">Deposits</h2>
          <div className="grid grid-cols-2 p-4">
            <DepositWithdrawCard
              border='border-r-1 border-b-1'
              title="Total Deposited"
              value={formatCurrency(stats.totalDeposited)}
              icon={FaDollarSign}
              color="green"
              onClick={() => navigate(ROUTES.ADMIN_DEPOSITS_ALL)}
            />
            <DepositWithdrawCard
              border='border-l-1 border-b-1'
              title="Pending Deposits"
              value={stats.pendingDeposits}
              icon={FaSpinner}
              color="orange"
              onClick={() => navigate(ROUTES.ADMIN_DEPOSITS_PENDING)}
            />
            <DepositWithdrawCard
              border='border-r-1 border-t-1'
              title="Rejected Deposits"
              value={stats.rejectedDeposits}
              icon={FaTimesCircle}
              color="red"
              onClick={() => navigate(ROUTES.ADMIN_DEPOSITS_REJECTED)}
            />
            <DepositWithdrawCard
              border='border-l-1 border-t-1'
              title="Deposited Charge"
              value={formatCurrency(stats.depositedCharge)}
              icon={FaPercentage}
              color="purple"
            />
          </div>
        </div>

        {/* Withdrawals Section */}
        <div className='bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] ml-2'>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] m-5 mb-0">Withdrawals</h2>
          <div className="grid grid-cols-2 p-4">
            <DepositWithdrawCard
              border='border-r-1 border-b-1'
              title="Total Withdrawn"
              value={formatCurrency(stats.totalWithdrawn)}
              icon={FaBuilding}
              color="green"
              onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS_ALL)}
            />
            <DepositWithdrawCard
              border='border-l-1 border-b-1'
              title="Pending Withdrawals"
              value={stats.pendingWithdrawals}
              icon={FaSpinner}
              color="orange"
              onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS_PENDING)}
            />
            <DepositWithdrawCard
              border='border-r-1 border-t-1'
              title="Rejected Withdrawals"
              value={stats.rejectedWithdrawals}
              icon={FaTimesCircle}
              color="red"
              onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS_REJECTED)}
            />
            <DepositWithdrawCard
              border='border-l-1 border-t-1'
              title="Withdrawal Charge"
              value={formatCurrency(stats.withdrawalCharge)}
              icon={FaPercentage}
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          title="Total Invest"
          value={formatCurrency(stats.totalInvest)}
          icon={FaCreditCard}
          bgColor="bg-blue-400"
          textColor="text-white"
        />
        <FinancialCard
          title="Last 7 Days Invest"
          value={formatCurrency(stats.last7DaysInvest)}
          icon={FaCreditCard}
          bgColor="bg-green-400"
          textColor="text-white"
        />
        <FinancialCard
          title="Total Referral Commission"
          value={formatCurrency(stats.totalReferralCommission)}
          icon={FaWaveSquare}
          bgColor="bg-purple-400"
          textColor="text-white"
        />
        <FinancialCard
          title="Total Binary Commission"
          value={formatCurrency(stats.totalBinaryCommission)}
          icon={FaTree}
          bgColor="bg-red-400"
          textColor="text-white"
        />
      </div>

      {/* User BV Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BVCard
          title="Users Total Bv Cut"
          value={stats.usersTotalBvCut}
          icon={FaCut}
          iconBg="bg-green-100"
        />
        <BVCard
          title="Users Total BV"
          value={stats.usersTotalBV.toLocaleString()}
          icon={FaShoppingCart}
          iconBg="bg-orange-100"
        />
        <BVCard
          title="Users Left BV"
          value={stats.usersLeftBV.toLocaleString()}
          icon={FaArrowLeft}
          iconBg="bg-red-100"
        />
        <BVCard
          title="Users Right BV"
          value={stats.usersRightBV.toLocaleString()}
          icon={FaArrowRight}
          iconBg="bg-blue-100"
        />
      </div>

      {/* Charts Section - Deposit & Withdraw Report and Transactions Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Deposit & Withdraw Report" dateRange={dateRange} chartKey="depositWithdraw">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.depositWithdrawData.slice(chartZooms.depositWithdraw.startIndex, chartZooms.depositWithdraw.endIndex + 1)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis label={{ value: 'USD', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="deposited" fill={COLORS.green} name="Deposited" />
              <Bar dataKey="withdrawn" fill={COLORS.red} name="Withdrawn" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Transactions Report" dateRange={dateRange} chartKey="transactions">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.transactionData.slice(chartZooms.transactions.startIndex, chartZooms.transactions.endIndex + 1)}>
              <defs>
                <linearGradient id="colorPlus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMinus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="plus"
                stroke={COLORS.green}
                fillOpacity={1}
                fill="url(#colorPlus)"
                name="Plus Transactions"
              />
              <Area
                type="monotone"
                dataKey="minus"
                stroke={COLORS.red}
                fillOpacity={1}
                fill="url(#colorMinus)"
                name="Minus Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Line Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Deposited vs Withdrawn" chartKey="depositWithdrawLine">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.depositWithdrawData.slice(chartZooms.depositWithdrawLine.startIndex, chartZooms.depositWithdrawLine.endIndex + 1)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="deposited"
                stroke={COLORS.green}
                strokeWidth={2}
                name="Deposited"
              />
              <Line
                type="monotone"
                dataKey="withdrawn"
                stroke={COLORS.red}
                strokeWidth={2}
                name="Withdrawn"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Plus Transactions vs Minus Transactions" chartKey="transactionsLine">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.transactionData.slice(chartZooms.transactionsLine.startIndex, chartZooms.transactionsLine.endIndex + 1)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="plus"
                stroke={COLORS.green}
                strokeWidth={2}
                name="Plus Transactions"
              />
              <Line
                type="monotone"
                dataKey="minus"
                stroke={COLORS.red}
                strokeWidth={2}
                name="Minus Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Donut Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Login By Browser (Last 30 days)" showControls={false}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.loginByBrowser}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {stats.loginByBrowser.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Login By OS (Last 30 days)" showControls={false}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.loginByOS}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {stats.loginByOS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Login By Country (Last 30 days)" showControls={false}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.loginByCountry}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {stats.loginByCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
