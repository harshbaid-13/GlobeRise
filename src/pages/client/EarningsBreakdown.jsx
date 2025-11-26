import { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { dashboardService } from '../../services/dashboardService';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import EarningsChart from '../../components/charts/EarningsChart';
import StatsCard from '../../components/common/StatsCard';
import { FaDollarSign, FaChartLine, FaGift, FaTrophy, FaPercentage } from 'react-icons/fa';

const EarningsBreakdown = () => {
    const [earnings, setEarnings] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [earningsData, chart] = await Promise.all([
                transactionService.getEarnings(),
                dashboardService.getEarningsChart(),
            ]);

            setEarnings(earningsData);
            setChartData(chart);
        } catch (err) {
            console.error('Error loading earnings data:', err);
            setError(err.response?.data?.message || 'Failed to load earnings data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    const breakdown = earnings?.breakdown || {};
    const totalEarnings = parseFloat(earnings?.totalEarnings || 0);

    const earningTypes = [
        {
            key: 'ROI',
            label: 'ROI Earnings',
            icon: FaChartLine,
            color: 'blue',
            description: 'Daily return on investment',
        },
        {
            key: 'COMMISSION',
            label: 'Commission',
            icon: FaDollarSign,
            color: 'green',
            description: 'Referral commissions',
        },
        {
            key: 'ROYALTY',
            label: 'Royalty',
            icon: FaPercentage,
            color: 'purple',
            description: 'Monthly rank royalty',
        },
        {
            key: 'RANK_BONUS',
            label: 'Rank Bonuses',
            icon: FaTrophy,
            color: 'yellow',
            description: 'One-time rank achievement bonuses',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <FaGift className="mr-3 text-green-500" />
                    Earnings Breakdown
                </h1>
                <p className="text-gray-400 mt-1">Comprehensive view of all your earnings</p>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Total Earnings Card */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="text-center">
                    <div className="text-gray-400 text-sm mb-2">Total Lifetime Earnings</div>
                    <div className="text-5xl font-bold text-white mb-2">
                        ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-gray-400 text-sm">Across all earning types</div>
                </div>
            </div>

            {/* Earnings by Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {earningTypes.map((type) => {
                    const data = breakdown[type.key] || { total: '0', count: 0 };
                    return (
                        <div key={type.key} className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-${type.color}-500/10 flex items-center justify-center`}>
                                    <type.icon className={`text-xl text-${type.color}-500`} />
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">{data.count} transactions</div>
                                </div>
                            </div>
                            <div className="text-white font-bold text-2xl mb-1">
                                ${parseFloat(data.total || 0).toFixed(2)}
                            </div>
                            <div className="text-gray-400 text-sm font-medium mb-1">{type.label}</div>
                            <div className="text-gray-500 text-xs">{type.description}</div>
                        </div>
                    );
                })}
            </div>

            {/* Earnings Chart */}
            {chartData && chartData.length > 0 && (
                <EarningsChart data={chartData} />
            )}

            {/* Breakdown Details */}
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Detailed Breakdown</h3>
                <div className="space-y-3">
                    {earningTypes.map((type) => {
                        const data = breakdown[type.key] || { total: '0', count: 0 };
                        const percentage = totalEarnings > 0 ? (parseFloat(data.total || 0) / totalEarnings) * 100 : 0;

                        return (
                            <div key={type.key} className="bg-[#0f1419] rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <type.icon className={`text-${type.color}-500`} />
                                        <span className="text-white font-medium">{type.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">${parseFloat(data.total || 0).toFixed(2)}</div>
                                        <div className="text-gray-500 text-xs">{data.count} transactions</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${type.color}-500 transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-gray-400 text-sm font-medium">{percentage.toFixed(1)}%</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EarningsBreakdown;
