import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatters';
import { delay } from '../../utils/helpers';
import Loading from '../../components/common/Loading';

const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    await delay(500);
    // Mock referral data
    const mockData = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        position: 'left',
        joinedDate: new Date().toISOString(),
        status: 'active',
      },
      {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
        position: 'right',
        joinedDate: new Date().toISOString(),
        status: 'active',
      },
    ];
    setReferrals(mockData);
    setStats({
      total: mockData.length,
      left: mockData.filter((r) => r.position === 'left').length,
      right: mockData.filter((r) => r.position === 'right').length,
    });
    setLoading(false);
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Referrals</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
          <div className="text-sm font-semibold text-gray-600 mb-2">Total Referrals</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
          <div className="text-sm font-semibold text-gray-600 mb-2">Left Side</div>
          <div className="text-2xl font-bold text-gray-800">{stats.left}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
          <div className="text-sm font-semibold text-gray-600 mb-2">Right Side</div>
          <div className="text-2xl font-bold text-gray-800">{stats.right}</div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {referral.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {referral.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          referral.position === 'left'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {referral.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {formatDate(referral.joinedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          referral.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyReferrals;

