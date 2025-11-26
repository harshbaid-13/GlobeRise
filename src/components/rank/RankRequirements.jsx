import PropTypes from 'prop-types';
import { FaTrophy, FaBriefcase, FaGift, FaPercentage } from 'react-icons/fa';
import RankBadge from './RankBadge';

const RankRequirements = ({ ranks, currentRank }) => {
    if (!ranks || ranks.length === 0) {
        return (
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-8 text-center">
                <p className="text-gray-400">Loading rank requirements...</p>
            </div>
        );
    }

    // Sort ranks by order
    const sortedRanks = [...ranks].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-4">
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FaTrophy className="mr-2 text-yellow-500" />
                    Rank Requirements & Benefits
                </h2>

                <div className="space-y-4">
                    {sortedRanks.map((rank) => {
                        const isCurrentRank = currentRank === rank.name;
                        const isPastRank = sortedRanks.findIndex(r => r.name === currentRank) > sortedRanks.findIndex(r => r.name === rank.name);

                        return (
                            <div
                                key={rank.id || rank.name}
                                className={`bg-[#0f1419] border-2 rounded-lg p-5 transition-all ${isCurrentRank
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                        : isPastRank
                                            ? 'border-green-500/30 opacity-75'
                                            : 'border-[#374151] hover:border-[#4b5563]'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <RankBadge rank={rank.name} size="lg" />
                                        {isCurrentRank && (
                                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                                Current Rank
                                            </span>
                                        )}
                                        {isPastRank && (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                                Achieved
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-400 text-xs">Rank Order</div>
                                        <div className="text-white font-bold">#{rank.order}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Required Business */}
                                    <div className="bg-[#1a1f2e] rounded p-3 border border-[#374151]">
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                            <FaBriefcase />
                                            <span>Required Business</span>
                                        </div>
                                        <div className="text-white font-bold text-lg">
                                            ${parseFloat(rank.requiredBusiness || 0).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Rank Bonus */}
                                    <div className="bg-[#1a1f2e] rounded p-3 border border-[#374151]">
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                            <FaGift />
                                            <span>Rank Bonus</span>
                                        </div>
                                        <div className="text-green-400 font-bold text-lg">
                                            ${parseFloat(rank.bonusAmount || 0).toLocaleString()}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-1">One-time bonus</div>
                                    </div>

                                    {/* Royalty Percentage */}
                                    <div className="bg-[#1a1f2e] rounded p-3 border border-[#374151]">
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                            <FaPercentage />
                                            <span>Monthly Royalty</span>
                                        </div>
                                        <div className="text-purple-400 font-bold text-lg">
                                            {parseFloat(rank.royaltyPercent || 0).toFixed(2)}%
                                        </div>
                                        <div className="text-gray-500 text-xs mt-1">Of company profits</div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                {rank.description && (
                                    <div className="mt-4 p-3 bg-[#1a1f2e] rounded border border-[#374151]">
                                        <p className="text-gray-400 text-sm">{rank.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Information Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                    <strong>Note:</strong> Ranks are calculated daily based on your total team business volume.
                    Rank bonuses are awarded once when you first achieve a rank. Monthly royalties are distributed
                    to all qualifying members based on their rank percentage.
                </p>
            </div>
        </div>
    );
};

RankRequirements.propTypes = {
    ranks: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired,
            requiredBusiness: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            bonusAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            royaltyPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            description: PropTypes.string,
        })
    ).isRequired,
    currentRank: PropTypes.string,
};

export default RankRequirements;
