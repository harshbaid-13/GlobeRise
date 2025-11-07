import { useState, useEffect } from 'react';
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
  FaWaveSquare
} from 'react-icons/fa';
import { mockStats } from '../../data/mockStats';
import { formatCurrency } from '../../utils/formatters';
import StatsCard from '../../components/common/StatsCard';
import { ROUTES } from '../../utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockStats);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FaUsers}
          color="purple"
          onClick={() => navigate(ROUTES.ADMIN_USERS_ALL)}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={FaUserCheck}
          color="green"
          onClick={() => navigate(ROUTES.ADMIN_USERS_ACTIVE)}
        />
        <StatsCard
          title="Email Unverified Users"
          value={stats.emailUnverifiedUsers}
          icon={FaEnvelope}
          color="red"
          onClick={() => navigate(ROUTES.ADMIN_USERS_EMAIL_UNVERIFIED)}
        />
        <StatsCard
          title="Mobile Unverified Users"
          value={stats.mobileUnverifiedUsers}
          icon={FaMobileAlt}
          color="orange"
          onClick={() => navigate(ROUTES.ADMIN_USERS_MOBILE_UNVERIFIED)}
        />
      </div>

      {/* Deposits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <StatsCard
            title="Total Deposited"
            value={formatCurrency(stats.totalDeposited)}
            icon={FaDollarSign}
            color="green"
            onClick={() => navigate(ROUTES.ADMIN_DEPOSITS_ALL)}
          />
          <StatsCard
            title="Rejected Deposits"
            value={stats.rejectedDeposits}
            icon={FaTimesCircle}
            color="red"
            onClick={() => navigate(ROUTES.ADMIN_DEPOSITS_REJECTED)}
          />
        </div>
        <div className="space-y-4">
          <StatsCard
            title="Pending Deposits"
            value={stats.pendingDeposits}
            icon={FaSpinner}
            color="orange"
            onClick={() => navigate(ROUTES.ADMIN_DEPOSITS_PENDING)}
          />
          <StatsCard
            title="Deposited Charge"
            value={formatCurrency(stats.depositedCharge)}
            icon={FaPercentage}
            color="purple"
          />
        </div>
      </div>

      {/* Withdrawals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <StatsCard
            title="Total Withdrawn"
            value={formatCurrency(stats.totalWithdrawn)}
            icon={FaBuilding}
            color="green"
            onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS_ALL)}
          />
          <StatsCard
            title="Rejected Withdrawals"
            value={stats.rejectedWithdrawals}
            icon={FaTimesCircle}
            color="red"
            onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS_REJECTED)}
          />
        </div>
        <div className="space-y-4">
          <StatsCard
            title="Pending Withdrawals"
            value={stats.pendingWithdrawals}
            icon={FaSpinner}
            color="orange"
            onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS_PENDING)}
          />
          <StatsCard
            title="Withdrawal Charge"
            value={formatCurrency(stats.withdrawalCharge)}
            icon={FaPercentage}
            color="purple"
          />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-400">Total Invest</p>
            <FaCreditCard className="text-[#00d4ff]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalInvest)}</p>
        </div>
        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-400">Last 7 Days Invest</p>
            <FaCreditCard className="text-[#10b981]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.last7DaysInvest)}</p>
        </div>
        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-400">Total Referral Commission</p>
            <FaWaveSquare className="text-[#8b5cf6]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalReferralCommission)}</p>
        </div>
        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-400">Total Binary Commission</p>
            <FaTree className="text-[#ef4444]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalBinaryCommission)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

