import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import Table from '../../components/common/Table';
import StatsCard from '../../components/common/StatsCard';
import { FaGift, FaDollarSign, FaChartLine, FaPercentage, FaTrophy } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';

const Bonuses = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [earnings, setEarnings] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const [bonusTransactions, earningsData] = await Promise.all([
                transactionService.getTransactions({ type: 'RANK_BONUS' }),
                transactionService.getEarnings(),
            ]);

            console.log('DEBUG: bonusTransactions =', bonusTransactions);
            console.log('DEBUG: transactions array =', bonusTransactions?.transactions);
            setTransactions(bonusTransactions?.transactions || []);
            setEarnings(earningsData);
        } catch (err) {
            console.error('Error loading bonuses:', err);
            setError(err.response?.data?.message || 'Failed to load bonus data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    const breakdown = earnings?.breakdown || {};
    const totalRankBonus = parseFloat(breakdown.RANK_BONUS?.total || 0);
    const totalROI = parseFloat(breakdown.ROI?.total || 0);
    const totalCommission = parseFloat(breakdown.COMMISSION?.total || 0);
    const totalRoyalty = parseFloat(breakdown.ROYALTY?.total || 0);

    const columns = [
        {
            header: 'Date',
            accessor: 'createdAt',
            render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00'
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (value) => value || 'N/A'
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => value || 'N/A'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Bonuses & Earnings</h1>
                <button
                    onClick={() => navigate('/client/earnings-breakdown')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    View Full Breakdown
                </button>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Earnings Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Rank Bonuses"
                    value={`$${totalRankBonus.toFixed(2)}`}
                    icon={FaTrophy}
                    color="yellow"
                />
                <StatsCard
                    title="ROI Earnings"
                    value={`$${totalROI.toFixed(2)}`}
                    icon={FaChartLine}
                    color="blue"
                />
                <StatsCard
                    title="Commissions"
                    value={`$${totalCommission.toFixed(2)}`}
                    icon={FaDollarSign}
                    color="green"
                />
                <StatsCard
                    title="Royalties"
                    value={`$${totalRoyalty.toFixed(2)}`}
                    icon={FaPercentage}
                    color="purple"
                />
            </div>

            {/* Rank Bonus History */}
            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaGift className="mr-2 text-yellow-500" />
                    Rank Bonus History
                </h2>
                <Table columns={columns} data={transactions} />
                {transactions.length === 0 && (
                    <div className="text-center py-8">
                        <FaGift className="mx-auto text-5xl text-gray-600 mb-4" />
                        <p className="text-gray-400">No rank bonuses yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Achieve higher ranks to earn bonuses!
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => navigate('/client/rank-progress')}
                    className="bg-[#1a1f2e] border border-[#374151] hover:border-blue-500 rounded-lg p-6 text-left transition-all"
                >
                    <FaTrophy className="text-yellow-500 text-2xl mb-3" />
                    <h3 className="text-white font-semibold mb-2">View Rank Progress</h3>
                    <p className="text-gray-400 text-sm">Track your rank advancement and requirements</p>
                </button>
                <button
                    onClick={() => navigate('/client/transaction-history')}
                    className="bg-[#1a1f2e] border border-[#374151] hover:border-blue-500 rounded-lg p-6 text-left transition-all"
                >
                    <FaChartLine className="text-blue-500 text-2xl mb-3" />
                    <h3 className="text-white font-semibold mb-2">Transaction History</h3>
                    <p className="text-gray-400 text-sm">View all your earnings and transactions</p>
                </button>
            </div>
        </div>
    );
};

export default Bonuses;
