import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { FaBell } from 'react-icons/fa';

const ClientDashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard statistics
  const stats = {
    totalDeposit: {
      main: 100.00,
      submitted: 100.00,
      pending: 0.00,
      rejected: 0.00,
    },
    totalWithdraw: {
      main: 0.00,
      submitted: 0.00,
      pending: 0.00,
      rejected: 0.00,
    },
    totalReferralCommission: {
      main: 0.00,
      referrals: 0,
      left: 0,
      right: 1,
    },
    totalInvest: 0.00,
    totalBinaryCommission: 0.00,
    totalBV: 0,
    leftBV: 0,
    rightBV: 0,
    totalBvCut: 0,
    binarySummary: {
      paidLeft: 0,
      paidRight: 0,
      freeLeft: 0,
      freeRight: 1,
      bvLeft: 0,
      bvRight: 0,
    },
  };

  const StatCard = ({ title, mainValue, children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 ${className}`}>
      <div className="text-2xl font-bold text-gray-800 mb-2">{formatCurrency(mainValue)}</div>
      <div className="text-sm text-gray-600 space-y-1">{children}</div>
    </div>
  );

  const SimpleStatCard = ({ title, value, isNumber = false }) => (
    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
      <div className="text-sm font-semibold text-gray-600 mb-2">{title}</div>
      <div className="text-2xl font-bold text-gray-800">
        {isNumber ? value : formatCurrency(value)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Browser Notification Banner */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-800">Please Allow / Reset Browser Notification</h3>
              <FaBell className="text-red-500" />
            </div>
            <p className="text-sm text-gray-600">
              If you want to get push notification then you have to allow notification from your browser
            </p>
          </div>
        </div>
      </div>

      {/* Notice Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Notice</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Multi-level marketing is a diverse and varied industry, employing many different structures and methods of selling. 
          Although there may be significant differences in how multi-level marketers sell their products or services, core consumer 
          protection principles are applicable to every member of the industry. The Commission staff offers this non-binding guidance 
          to assist multi-level marketers in applying those core principles to their business practices.
        </p>
      </div>

      {/* Statistics Grid - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Deposit" mainValue={stats.totalDeposit.main}>
          <div>Submitted {formatCurrency(stats.totalDeposit.submitted)}</div>
          <div>Pending {formatCurrency(stats.totalDeposit.pending)}</div>
          <div>Rejected {formatCurrency(stats.totalDeposit.rejected)}</div>
        </StatCard>

        <StatCard title="Total Withdraw" mainValue={stats.totalWithdraw.main}>
          <div>Submitted {formatCurrency(stats.totalWithdraw.submitted)}</div>
          <div>Pending {formatCurrency(stats.totalWithdraw.pending)}</div>
          <div>Rejected {formatCurrency(stats.totalWithdraw.rejected)}</div>
        </StatCard>

        <StatCard title="Total Referral Commission" mainValue={stats.totalReferralCommission.main}>
          <div>Referrals {stats.totalReferralCommission.referrals}</div>
          <div>Left {stats.totalReferralCommission.left}</div>
          <div>Right {stats.totalReferralCommission.right}</div>
        </StatCard>
      </div>

      {/* Statistics Grid - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SimpleStatCard title="Total Invest" value={stats.totalInvest} />
        <SimpleStatCard title="Total Binary Commission" value={stats.totalBinaryCommission} />
        <SimpleStatCard title="Total BV" value={stats.totalBV} isNumber={true} />
      </div>

      {/* Statistics Grid - Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SimpleStatCard title="Left BV" value={stats.leftBV} isNumber={true} />
        <SimpleStatCard title="Right BV" value={stats.rightBV} isNumber={true} />
        <SimpleStatCard title="Total Bv Cut" value={stats.totalBvCut} isNumber={true} />
      </div>

      {/* Binary Summary Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-3">
          <h3 className="text-lg font-semibold">Binary Summery</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Paid left</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Paid right</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Free left</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Free right</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Bv left</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Bv right</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-800">{stats.binarySummary.paidLeft}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{stats.binarySummary.paidRight}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{stats.binarySummary.freeLeft}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{stats.binarySummary.freeRight}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{stats.binarySummary.bvLeft}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{stats.binarySummary.bvRight}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

