import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { configService } from '../../services/configService';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import RankProgressBar from '../../components/rank/RankProgressBar';
import RankRequirements from '../../components/rank/RankRequirements';
import RankBadge from '../../components/rank/RankBadge';
import { FaTrophy, FaBriefcase } from 'react-icons/fa';

const RankProgress = () => {
    const [stats, setStats] = useState(null);
    const [ranks, setRanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [dashStats, ranksData] = await Promise.all([
                dashboardService.getStats(),
                configService.getRanks(),
            ]);

            setStats(dashStats);
            setRanks(ranksData);
        } catch (err) {
            console.error('Error loading rank data:', err);
            setError(err.response?.data?.message || 'Failed to load rank data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    // Find current and next rank
    const currentRankName = stats?.rank || 'NONE';
    const currentRankIndex = ranks.findIndex(r => r.name === currentRankName);
    const nextRank = currentRankIndex >= 0 && currentRankIndex < ranks.length - 1
        ? ranks[currentRankIndex + 1]
        : null;

    const currentBusiness = parseFloat(stats?.teamBusiness || 0);
    const requiredBusiness = nextRank ? parseFloat(nextRank.requiredBusiness || 0) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <FaTrophy className="mr-3 text-yellow-500" />
                    Rank Progress
                </h1>
                <p className="text-gray-400 mt-1">Track your rank advancement and requirements</p>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Current Rank Card */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-gray-400 text-sm mb-2">Your Current Rank</div>
                        <RankBadge rank={currentRankName} size="xl" />
                    </div>
                    <div className="text-right">
                        <div className="text-gray-400 text-sm mb-1">Team Business</div>
                        <div className="flex items-center space-x-2">
                            <FaBriefcase className="text-green-500" />
                            <div className="text-2xl font-bold text-white">
                                ${currentBusiness.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <RankProgressBar
                currentRank={currentRankName}
                nextRank={nextRank?.name}
                currentBusiness={currentBusiness}
                requiredBusiness={requiredBusiness}
            />

            {/* Rank Requirements */}
            <RankRequirements ranks={ranks} currentRank={currentRankName} />
        </div>
    );
};

export default RankProgress;
