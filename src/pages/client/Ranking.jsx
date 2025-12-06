import { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import { rankingService } from "../../services/rankingService";
import { formatCurrency } from "../../utils/formatters";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import {
  FaTrophy,
  FaCheckCircle,
  FaLock,
  FaCrown,
  FaStar,
  FaMedal,
  FaUsers,
  FaCoins,
} from "react-icons/fa";
import { capitalizeFirst } from "../../utils/helpers";

const Ranking = () => {
  const [rankProgress, setRankProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState({
    earnings: [],
    referrals: [],
    investments: [],
  });
  const [leaderboardType, setLeaderboardType] = useState("earnings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRankData();
  }, []);

  useEffect(() => {
    if (leaderboardType) {
      loadLeaderboard();
    }
  }, [leaderboardType]);

  const loadRankData = async () => {
    try {
      setLoading(true);
      setError("");
      const [progress] = await Promise.all([rankingService.getRankProgress()]);
      setRankProgress(progress);
    } catch (err) {
      console.error("Error loading rank data:", err);
      setError(err.response?.data?.message || "Failed to load rank data");
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await rankingService.getLeaderboard(leaderboardType, 10);
      setLeaderboard((prev) => ({ ...prev, [leaderboardType]: data }));
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    }
  };

  if (loading) return <Loading size="lg" />;

  if (!rankProgress) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No rank data available</p>
      </div>
    );
  }

  const currentRank = rankProgress.currentRank || "NONE";
  const teamBusiness = parseFloat(rankProgress.teamBusiness || 0);
  const nextRank = rankProgress.nextRank;
  const allRanks = rankProgress.allRanks || [];
  const progressPercentage = rankProgress.progress || 0;
  const remainingBV = rankProgress.remainingBV || 0;

  // Find current rank index
  const currentRankIndex = allRanks.findIndex((r) => r.name === currentRank);

  const getRankIcon = (rank, index) => {
    if (index >= 10) return <FaCrown className="text-yellow-500" />;
    if (index >= 7) return <FaTrophy className="text-purple-500" />;
    if (index >= 4) return <FaStar className="text-blue-500" />;
    return <FaStar className="text-gray-400" />;
  };

  const isRankAchieved = (rank) => {
    if (!allRanks || allRanks.length === 0) return false;
    const rankIndex = allRanks.findIndex((tier) => tier.name === rank);
    return rankIndex <= currentRankIndex && rankIndex >= 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaTrophy className="text-yellow-500" />
          Ranking System
        </h1>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Current Status Card */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm mb-2">Current Rank</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              {getRankIcon(currentRank, currentRankIndex)}
              <h2 className="text-2xl font-bold text-white">
                {capitalizeFirst(currentRank)}
              </h2>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm mb-2">Your Team Business</p>
            <h2 className="text-2xl font-bold text-green-400">
              ${teamBusiness.toLocaleString()}
            </h2>
          </div>
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm mb-2">Next Rank</p>
            <h2 className="text-2xl font-bold text-blue-400">
              {nextRank ? capitalizeFirst(nextRank.name) : "MAX RANK"}
            </h2>
          </div>
        </div>

        {/* Progress Bar */}
        {nextRank && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">
                Progress to {capitalizeFirst(nextRank.name)}
              </span>
              <span className="text-sm text-gray-300">
                {Math.max(0, Math.min(100, progressPercentage)).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Remaining BV:{" "}
              <span className="text-white font-bold">
                ${Math.max(0, remainingBV).toLocaleString()}
              </span>
            </p>
          </div>
        )}
        {!nextRank && (
          <div className="mt-6">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm font-semibold">
                🎉 You've reached the maximum rank!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rankings Table */}
      <div className="bg-[#393E46] border border-[#4b5563] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#4b5563]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            All Ranking Tiers
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Achieve higher ranks to unlock bigger bonuses and exclusive benefits
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1419]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Total Team Business
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  One Time Bonus
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4b5563]">
              {allRanks.map((tier, index) => {
                const achieved = isRankAchieved(tier.name);
                const isCurrent = tier.name === currentRank;
                const progress = Math.min(
                  (teamBusiness / parseFloat(tier.requiredBusiness || 0)) * 100,
                  100
                );

                return (
                  <tr
                    key={tier.name}
                    className={`
                      ${
                        isCurrent
                          ? "bg-blue-500/10 border-l-4 border-l-blue-500"
                          : ""
                      }
                      ${achieved && !isCurrent ? "bg-green-500/5" : ""}
                      hover:bg-white/5 transition-colors
                    `}
                  >
                    <td className="px-6 py-4">
                      {achieved ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaLock className="text-gray-600 text-xl" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getRankIcon(tier.name, index)}
                        <span
                          className={`font-semibold ${
                            isCurrent
                              ? "text-blue-400"
                              : achieved
                              ? "text-green-400"
                              : "text-gray-300"
                          }`}
                        >
                          {tier.name}
                          {isCurrent && (
                            <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white">
                      {formatCurrency(parseFloat(tier.requiredBusiness || 0))}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-yellow-400 font-bold">
                      {formatCurrency(parseFloat(tier.bonusAmount || 0))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              achieved ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${achieved ? 100 : progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-12 text-right">
                          {achieved ? "100" : progress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-[#393E46] border border-[#4b5563] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#4b5563]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <FaTrophy className="text-yellow-500" />
            Top Performers
          </h3>

          {/* Leaderboard Type Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setLeaderboardType("earnings")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                leaderboardType === "earnings"
                  ? "bg-[#00ADB5] text-white"
                  : "bg-[#222831] text-gray-400 hover:text-white"
              }`}
            >
              <FaCoins className="inline mr-2" />
              Top Earners
            </button>
            <button
              onClick={() => setLeaderboardType("referrals")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                leaderboardType === "referrals"
                  ? "bg-[#00ADB5] text-white"
                  : "bg-[#222831] text-gray-400 hover:text-white"
              }`}
            >
              <FaUsers className="inline mr-2" />
              Top Referrers
            </button>
            <button
              onClick={() => setLeaderboardType("investments")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                leaderboardType === "investments"
                  ? "bg-[#00ADB5] text-white"
                  : "bg-[#222831] text-gray-400 hover:text-white"
              }`}
            >
              <FaMedal className="inline mr-2" />
              Top Investors
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1419]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Rank
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">
                  {leaderboardType === "earnings"
                    ? "Total Earnings"
                    : leaderboardType === "referrals"
                    ? "Referrals"
                    : "Invested"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4b5563]">
              {leaderboard[leaderboardType]?.length > 0 ? (
                leaderboard[leaderboardType].map((entry) => (
                  <tr
                    key={entry.userId}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {entry.rank <= 3 ? (
                          <FaMedal
                            className={`text-xl ${
                              entry.rank === 1
                                ? "text-yellow-500"
                                : entry.rank === 2
                                ? "text-gray-400"
                                : "text-orange-600"
                            }`}
                          />
                        ) : (
                          <span className="text-gray-400 font-bold">
                            #{entry.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                        {entry.rankName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white font-bold">
                      {leaderboardType === "referrals"
                        ? entry.value
                        : formatCurrency(parseFloat(entry.value || 0))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Info */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaTrophy className="text-yellow-500" />
          Rank Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <p>
              Receive a{" "}
              <strong className="text-white">one-time cash bonus</strong> upon
              achieving each new rank
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <p>
              Unlock{" "}
              <strong className="text-white">higher commission rates</strong> on
              team business volume
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <p>
              Gain access to{" "}
              <strong className="text-white">
                exclusive leadership training
              </strong>{" "}
              and resources
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <p>
              Earn <strong className="text-white">monthly royalties</strong>{" "}
              from company profits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
