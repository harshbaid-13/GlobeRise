import PropTypes from 'prop-types';
import RankBadge from './RankBadge';

const RankProgressBar = ({ currentRank, nextRank, currentBusiness, requiredBusiness }) => {
    // Calculate progress percentage
    const progress = requiredBusiness > 0 ? Math.min((currentBusiness / requiredBusiness) * 100, 100) : 0;
    const remaining = Math.max(requiredBusiness - currentBusiness, 0);

    return (
        <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Rank Progress</h3>
                    <p className="text-gray-400 text-sm">
                        {nextRank ? `Progress to ${nextRank}` : 'Maximum rank achieved!'}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{progress.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Complete</div>
                </div>
            </div>

            {/* Current and Next Rank Badges */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                    <div className="text-gray-400 text-xs mb-2">Current Rank</div>
                    <RankBadge rank={currentRank} size="lg" />
                </div>

                {nextRank && (
                    <>
                        <div className="flex-1 mx-4">
                            <div className="h-0.5 bg-gray-700 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-gray-400 text-xs mb-2">Next Rank</div>
                            <RankBadge rank={nextRank} size="lg" />
                        </div>
                    </>
                )}
            </div>

            {/* Progress Bar */}
            {nextRank && (
                <>
                    <div className="mb-4">
                        <div className="h-4 bg-[#0f1419] rounded-full overflow-hidden border border-[#374151]">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Business Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-[#0f1419] rounded p-3">
                            <div className="text-gray-400 text-xs mb-1">Current Business</div>
                            <div className="text-white font-semibold">${currentBusiness.toLocaleString()}</div>
                        </div>

                        <div className="bg-[#0f1419] rounded p-3">
                            <div className="text-gray-400 text-xs mb-1">Required Business</div>
                            <div className="text-white font-semibold">${requiredBusiness.toLocaleString()}</div>
                        </div>

                        <div className="bg-[#0f1419] rounded p-3">
                            <div className="text-gray-400 text-xs mb-1">Remaining</div>
                            <div className="text-orange-400 font-semibold">${remaining.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Motivational Message */}
                    {progress >= 75 && progress < 100 && (
                        <div className="mt-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded p-3">
                            <p className="text-green-400 text-sm text-center">
                                🎉 You're almost there! Just ${remaining.toLocaleString()} more to reach {nextRank}!
                            </p>
                        </div>
                    )}

                    {progress >= 100 && (
                        <div className="mt-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded p-3">
                            <p className="text-yellow-400 text-sm text-center">
                                ⭐ Congratulations! You've met the requirements for {nextRank}. Your rank will be updated in the next cycle!
                            </p>
                        </div>
                    )}
                </>
            )}

            {!nextRank && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded p-4 text-center">
                    <p className="text-purple-400 font-semibold">
                        👑 You've achieved the highest rank! Keep growing your team to earn more royalties!
                    </p>
                </div>
            )}
        </div>
    );
};

RankProgressBar.propTypes = {
    currentRank: PropTypes.string.isRequired,
    nextRank: PropTypes.string,
    currentBusiness: PropTypes.number.isRequired,
    requiredBusiness: PropTypes.number,
};

export default RankProgressBar;
