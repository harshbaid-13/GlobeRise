import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { referralService } from '../../services/referralService';
import { formatDate } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import RankBadge from '../../components/rank/RankBadge';
import { FaUser, FaUsers, FaBriefcase, FaChartLine, FaCopy } from 'react-icons/fa';

const MyReferrals = () => {
  const navigate = useNavigate();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await referralService.getReferralTree();
      setReferralData(data);
    } catch (err) {
      console.error('Error loading referrals:', err);
      setError(err.response?.data?.message || 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralData?.myCode) {
      navigator.clipboard.writeText(referralData.myCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (loading) return <Loading size="lg" />;

  const referrals = referralData?.referrals || [];
  const totalDirect = referrals.length;
  const totalTeam = referrals.reduce((sum, ref) => sum + (ref.teamCount || 0), 0) + totalDirect;
  const totalBusiness = referrals.reduce((sum, ref) => sum + parseFloat(ref.totalTeamBusiness || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Referrals</h1>
        <button
          onClick={() => navigate('/client/network-tree')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          View Full Network Tree
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold mb-3">Your Referral Code</h3>
        <div className="flex items-center space-x-4">
          <code className="bg-[#0f1419] px-4 py-3 rounded text-blue-400 text-xl font-mono font-bold flex-1">
            {referralData?.myCode || 'N/A'}
          </code>
          <button
            onClick={copyReferralCode}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center space-x-2"
          >
            <FaCopy />
            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Share this code with others to build your network
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-400">Direct Referrals</div>
            <FaUser className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white">{totalDirect}</div>
        </div>
        <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-400">Total Team</div>
            <FaUsers className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white">{totalTeam}</div>
        </div>
        <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-400">Team Business</div>
            <FaBriefcase className="text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-white">${totalBusiness.toFixed(2)}</div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] overflow-hidden">
        <div className="p-4 border-b border-[#374151]">
          <h3 className="text-lg font-semibold text-white">Direct Referrals ({totalDirect})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1419]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Direct
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Team Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Month
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#1a1f2e] divide-y divide-[#374151]">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No referrals found. Share your referral code to build your network!
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-[#0f1419] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{referral.email}</div>
                      <div className="text-xs text-gray-500">{referral.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RankBadge rank={referral.rank} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {referral.directCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {referral.teamCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                      ${parseFloat(referral.totalTeamBusiness || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                      ${parseFloat(referral.lastMonthBusiness || 0).toFixed(2)}
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
