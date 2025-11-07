import { useState, useEffect } from 'react';
import { delay } from '../../utils/helpers';
import Loading from '../../components/common/Loading';
import { FaTrophy } from 'react-icons/fa';

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    await delay(500);
    // Mock ranking data
    const mockData = [
      { id: 1, username: 'user1', rank: 1, totalEarnings: 50000, level: 'Gold' },
      { id: 2, username: 'user2', rank: 2, totalEarnings: 40000, level: 'Silver' },
      { id: 3, username: 'user3', rank: 3, totalEarnings: 30000, level: 'Bronze' },
      { id: 4, username: 'user4', rank: 4, totalEarnings: 20000, level: 'Bronze' },
      { id: 5, username: 'user5', rank: 5, totalEarnings: 10000, level: 'Bronze' },
    ];
    setRankings(mockData);
    setUserRank({ rank: 10, totalEarnings: 5000, level: 'Bronze' });
    setLoading(false);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ranking</h1>

      {/* User's Current Rank */}
      {userRank && (
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Ranking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Your Rank</div>
              <div className="text-2xl font-bold text-gray-800">#{userRank.rank}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-gray-800">
                ${userRank.totalEarnings.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Level</div>
              <div className="text-2xl font-bold text-gray-800">{userRank.level}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top Rankings */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Top Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((ranking) => (
                <tr key={ranking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {ranking.rank <= 3 && (
                        <FaTrophy className={`w-5 h-5 ${getRankColor(ranking.rank)}`} />
                      )}
                      <span className="text-sm font-medium text-gray-800">#{ranking.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {ranking.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    ${ranking.totalEarnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ranking.level === 'Gold'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ranking.level === 'Silver'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {ranking.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ranking;

