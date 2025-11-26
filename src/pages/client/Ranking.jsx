import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import RankBadge from '../../components/rank/RankBadge';
import { FaTrophy, FaBriefcase } from 'react-icons/fa';

const Ranking = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRankData();
  }, []);

  const loadRankData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading rank data:', err);
      setError(err.response?.data?.message || 'Failed to load rank data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading size="lg" />;

  const currentRank = stats?.rank || 'NONE';
  const totalEarnings = parseFloat(stats?.totalEarnings || 0);
  const teamBusiness = parseFloat(stats?.teamBusiness || 0);
  const directBusiness = parseFloat(stats?.directBusiness || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your Rank</h1>
        <button
          onClick={() => navigate('/client/rank-progress')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          View Rank Progress
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Current Rank Card */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-8">
        <div className="text-center">
          <h3 className="text-lg text-gray-400 mb-4">Your Current Rank</h3>
          <RankBadge rank={currentRank} size="xl" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#374151]">
              <div className="text-gray-400 text-sm mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-white">${totalEarnings.toLocaleString()}</div>
            </div>
            <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#374151]">
              <div className="text-gray-400 text-sm mb-1">Team Business</div>
              <div className="text-2xl font-bold text-green-400">${teamBusiness.toLocaleString()}</div>
            </div>
            <div className="bg-[#1a1f2e] rounded-lg p-4 border border-[#374151]">
              <div className="text-gray-400 text-sm mb-1">Direct Business</div>
              <div className="text-2xl font-bold text-blue-400">${directBusiness.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Info */}
      <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FaTrophy className="mr-2 text-yellow-500" />
          Rank Information
        </h3>
        <div className="space-y-4 text-gray-300">
          <p>
            Your rank is determined by your total team business volume. As you and your team grow,
            you'll progress through different ranks, each with its own benefits and bonuses.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Benefits of Higher Ranks:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>One-time rank achievement bonuses</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Monthly royalty percentages from company profits</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Higher commission rates on team business</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Recognition and status within the network</span>
              </li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/client/rank-progress')}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
            >
              View Your Progress
            </button>
            <button
              onClick={() => navigate('/client/network-tree')}
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-semibold"
            >
              View Your Network
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Team Performance</h4>
            <FaBriefcase className="text-green-500 text-xl" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Team Business</span>
              <span className="text-white font-bold">${teamBusiness.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Direct Business</span>
              <span className="text-white font-bold">${directBusiness.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Month</span>
              <span className="text-white font-bold">${parseFloat(stats?.lastMonthBusiness || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Wallet Summary</h4>
            <FaTrophy className="text-blue-500 text-xl" />
          </div>
          <div className="space-y-3">
            {stats?.walletBalances && Object.entries(stats.walletBalances).map(([wallet, balance]) => (
              <div key={wallet} className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">{wallet}</span>
                <span className="text-white font-bold">${parseFloat(balance).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
