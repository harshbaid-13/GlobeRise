import { useState, useEffect } from 'react';
import { investmentService } from '../../services/investmentService';
import { walletService } from '../../services/walletService';
import { formatCurrency } from '../../utils/formatters';
import { FaLock, FaClock, FaCoins, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const Staking = () => {
    const [fiatBalance, setFiatBalance] = useState(0);
    const [stakes, setStakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingStake, setCreatingStake] = useState(false);
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState(6);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const stakingTiers = [
        { months: 3, rate: 1.25, label: '3 Months' },
        { months: 6, rate: 1.75, label: '6 Months' },
        { months: 12, rate: 2.25, label: '12 Months' },
        { months: 18, rate: 4.00, label: '18 Months' },
        { months: 24, rate: 4.75, label: '24 Months' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [balances, investments] = await Promise.all([
                walletService.getBalances(),
                investmentService.getMyInvestments()
            ]);
            setFiatBalance(balances.fiat || 0);
            setStakes(investments.filter(inv => inv.type === 'FIXED'));
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load staking data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStake = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const amountNum = parseFloat(amount);
        if (!amountNum || amountNum <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (amountNum > fiatBalance) {
            setError('Insufficient Fiat wallet balance');
            return;
        }

        try {
            setCreatingStake(true);
            await investmentService.createFixedDeposit(amountNum, duration);
            setSuccess(`Successfully created ${duration}-month stake of ${formatCurrency(amountNum)}!`);
            setAmount('');
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create stake');
        } finally {
            setCreatingStake(false);
        }
    };

    const calculateExpectedReturn = () => {
        const amountNum = parseFloat(amount) || 0;
        const selectedTier = stakingTiers.find(t => t.months === duration);
        if (!selectedTier || !amountNum) return 0;

        const monthlyReturn = (amountNum * selectedTier.rate) / 100;
        const totalReturn = monthlyReturn * duration;
        return amountNum + totalReturn;
    };

    const calculateStakeProgress = (stake) => {
        const now = new Date();
        const start = new Date(stake.startDate);
        const end = new Date(stake.endDate);

        const totalDuration = end - start;
        const elapsed = now - start;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);

        const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

        return { progress, daysRemaining };
    };

    if (loading) return <Loading />;

    const selectedTier = stakingTiers.find(t => t.months === duration);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Fixed Term Staking</h1>

            {/* Create Stake Section */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border border-purple-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FaLock className="text-purple-300 text-2xl" />
                    <h2 className="text-2xl font-bold text-white">Create New Stake</h2>
                </div>

                <div className="bg-purple-950/50 rounded-lg p-4 mb-4">
                    <p className="text-purple-200 text-sm mb-2">
                        <strong>Available Fiat Balance:</strong> {formatCurrency(fiatBalance)}
                    </p>
                    <p className="text-purple-300 text-xs">
                        💡 <strong>Note:</strong> Staked funds are locked until maturity. Principal + Interest will be transferred to Reward wallet upon completion.
                    </p>
                </div>

                <form onSubmit={handleCreateStake} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                            Staking Duration
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {stakingTiers.map((tier) => (
                                <button
                                    key={tier.months}
                                    type="button"
                                    onClick={() => setDuration(tier.months)}
                                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${duration === tier.months
                                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                                            : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
                                        }`}
                                >
                                    <div className="font-bold">{tier.label}</div>
                                    <div className="text-xs mt-1">{tier.rate}%/mo</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                            Stake Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={creatingStake}
                            min="0.01"
                            step="0.01"
                        />
                    </div>

                    {amount && selectedTier && (
                        <div className="bg-purple-950/70 rounded-lg p-4 border border-purple-700">
                            <h3 className="font-bold text-purple-200 mb-2">Expected Return</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-purple-300">Principal:</p>
                                    <p className="text-white font-bold">{formatCurrency(parseFloat(amount) || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-purple-300">Monthly Rate:</p>
                                    <p className="text-white font-bold">{selectedTier.rate}%</p>
                                </div>
                                <div>
                                    <p className="text-purple-300">Duration:</p>
                                    <p className="text-white font-bold">{duration} months</p>
                                </div>
                                <div>
                                    <p className="text-purple-300">Total Return:</p>
                                    <p className="text-green-400 font-bold text-lg">{formatCurrency(calculateExpectedReturn())}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
                            <FaCheckCircle />
                            {success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 text-lg font-bold bg-purple-600 hover:bg-purple-700"
                        disabled={creatingStake}
                    >
                        {creatingStake ? (
                            <span className="flex items-center justify-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Creating Stake...
                            </span>
                        ) : (
                            'Create Stake'
                        )}
                    </Button>
                </form>
            </div>

            {/* Active Stakes */}
            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaClock className="text-purple-400" />
                    Active Stakes
                </h2>

                {stakes.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg mb-2">No active stakes yet</p>
                        <p className="text-sm">Create your first stake above to earn guaranteed returns</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stakes.map((stake) => {
                            const { progress, daysRemaining } = calculateStakeProgress(stake);
                            const isActive = stake.status === 'ACTIVE';
                            const amount = parseFloat(stake.amount);
                            const rate = parseFloat(stake.roiRate);
                            const months = stake.durationDays / 30;
                            const expectedReturn = amount + ((amount * rate / 100) * months);

                            return (
                                <div
                                    key={stake.id}
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 p-6 hover:border-purple-500 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Staked Amount</p>
                                            <p className="text-3xl font-bold text-white">
                                                {formatCurrency(amount)}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {stake.status}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Monthly Rate:</span>
                                            <span className="text-purple-400 font-bold">{rate}%</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white font-medium">{months.toFixed(0)} months</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Start Date:</span>
                                            <span className="text-white">{new Date(stake.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Maturity Date:</span>
                                            <span className="text-white">{new Date(stake.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Expected Return:</span>
                                            <span className="text-green-400 font-bold">{formatCurrency(expectedReturn)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-950/50 rounded-lg p-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Time Progress:</span>
                                            <span className="text-white font-medium">
                                                {daysRemaining} days remaining
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full ${progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-purple-500'
                                                    } transition-all duration-500`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{progress.toFixed(1)}% complete</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Staking Tiers Info */}
            <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-300 mb-3">Staking Tiers</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-purple-800">
                                <th className="text-left py-2 text-purple-300">Duration</th>
                                <th className="text-left py-2 text-purple-300">Monthly Rate</th>
                                <th className="text-left py-2 text-purple-300">Total Return (Example: $10,000)</th>
                            </tr>
                        </thead>
                        <tbody className="text-purple-200">
                            {stakingTiers.map((tier) => {
                                const principal = 10000;
                                const totalReturn = principal + ((principal * tier.rate / 100) * tier.months);
                                return (
                                    <tr key={tier.months} className="border-b border-purple-900/50">
                                        <td className="py-2">{tier.label}</td>
                                        <td className="py-2 font-bold text-purple-400">{tier.rate}%</td>
                                        <td className="py-2 font-bold text-green-400">{formatCurrency(totalReturn)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Staking;
