import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { investmentService } from '../../services/investmentService';
import { walletService } from '../../services/walletService';
import { formatCurrency } from '../../utils/formatters';
import { FaCoins, FaRocket, FaCheckCircle, FaSpinner, FaLock, FaClock } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import StakingCalculator from '../../components/staking/StakingCalculator';

const Investments = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tabFromUrl = searchParams.get('tab') || 'packages';
    const [activeTab, setActiveTab] = useState(tabFromUrl); // 'packages' or 'staking'
    const [depositBalance, setDepositBalance] = useState(0);
    const [packages, setPackages] = useState([]);
    const [stakes, setStakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingPackage, setCreatingPackage] = useState(false);
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

    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') || 'packages';
        setActiveTab(tabFromUrl);
    }, [searchParams]);

    const handleTabChange = (tab) => {
        navigate(`?tab=${tab}`);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [balances, investments] = await Promise.all([
                walletService.getBalances(),
                investmentService.getMyInvestments()
            ]);
            setDepositBalance(balances.deposit || 0);
            setPackages(investments.filter(inv => inv.type === 'PACKAGE'));
            setStakes(investments.filter(inv => inv.type === 'FIXED'));
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load investment data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePackage = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const amountNum = parseFloat(amount);
        if (!amountNum || amountNum < 100) {
            setError('Minimum investment amount is 100 RISE tokens');
            return;
        }

        if (amountNum > depositBalance) {
            setError('Insufficient Deposit wallet balance. Please deposit from your linked wallet first.');
            return;
        }

        try {
            setCreatingPackage(true);
            await investmentService.createPackage(amountNum);
            setSuccess(`Successfully created package of ${formatCurrency(amountNum)}!`);
            setAmount('');
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create package');
        } finally {
            setCreatingPackage(false);
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

        if (amountNum > depositBalance) {
            setError('Insufficient Deposit wallet balance. Please deposit from your linked wallet first.');
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

    const calculateROIProgress = (pkg) => {
        const totalRoiPaid = parseFloat(pkg.totalRoiPaid || 0);
        const amount = parseFloat(pkg.amount);
        const roiRate = parseFloat(pkg.roiRate);

        // Determine cap based on ROI rate
        let capMultiplier = 2.5;
        if (roiRate >= 12) capMultiplier = 4;
        else if (roiRate >= 10) capMultiplier = 3;

        const capLimit = amount * capMultiplier;
        const progress = (totalRoiPaid / capLimit) * 100;

        return { totalRoiPaid, capLimit, progress: Math.min(progress, 100), capMultiplier };
    };

    if (loading) return <Loading />;

    const selectedTier = stakingTiers.find(t => t.months === duration);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">Investments</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-[var(--border-color)] overflow-x-auto">
                <button
                    onClick={() => handleTabChange('packages')}
                    className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'packages'
                        ? 'text-[#00ADB5] border-b-2 border-[#00ADB5]'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <FaRocket className="inline mr-2" />
                    Packages
                </button>
                <button
                    onClick={() => handleTabChange('staking')}
                    className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'staking'
                        ? 'text-[#00ADB5] border-b-2 border-[#00ADB5]'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <FaLock className="inline mr-2" />
                    Staking
                </button>
            </div>

            {/* Packages Tab */}
            {activeTab === 'packages' && (
                <>

                    {/* Create Package Section */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg border border-blue-500 p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-4">
                            <FaRocket className="text-blue-200 text-xl md:text-2xl" />
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Create New Package</h2>
                        </div>

                        <div className="bg-blue-800/50 rounded-lg p-4 mb-4">
                            <p className="text-blue-100 text-sm mb-2">
                                <strong>Available Deposit Balance:</strong> {formatCurrency(depositBalance)} RISE
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 Deposit from your linked wallet (MetaMask/Trust Wallet) to create packages. Minimum: 100 RISE tokens.
                            </p>
                        </div>

                        <form onSubmit={handleCreatePackage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">
                                    Investment Amount (Minimum 100 RISE)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 bg-blue-800/50 border border-blue-500 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    disabled={creatingPackage}
                                    min="100"
                                    step="0.01"
                                />
                            </div>

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
                                className="w-full py-3 text-lg font-bold"
                                disabled={creatingPackage}
                            >
                                {creatingPackage ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <FaSpinner className="animate-spin" />
                                        Creating Package...
                                    </span>
                                ) : (
                                    'Create Package'
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Active Packages */}
                    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-4 md:p-6 transition-colors duration-200">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <FaCoins className="text-yellow-400" />
                            Active Packages
                        </h2>

                        {packages.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-tertiary)]">
                                <p className="text-lg mb-2">No active packages yet</p>
                                <p className="text-sm">Create your first package above to start earning ROI</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {packages.map((pkg) => {
                                    const { totalRoiPaid, capLimit, progress, capMultiplier } = calculateROIProgress(pkg);
                                    const isActive = pkg.status === 'ACTIVE';
                                    const roiRate = parseFloat(pkg.roiRate);

                                    return (
                                        <div
                                            key={pkg.id}
                                            className="bg-[var(--bg-primary)] rounded-lg border-2 border-[var(--border-color)] p-4 md:p-6 hover:border-blue-500 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-sm text-[var(--text-tertiary)]">Package Amount</p>
                                                    <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                                                        {formatCurrency(pkg.amount)}
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {pkg.status}
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">ROI Rate:</span>
                                                    <span className={`font-bold ${roiRate >= 12 ? 'text-purple-400' : roiRate >= 10 ? 'text-blue-400' : 'text-green-400'
                                                        }`}>
                                                        {roiRate}% per month
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Cap Limit:</span>
                                                    <span className="text-[var(--text-primary)] font-medium">{capMultiplier}x ({formatCurrency(capLimit)})</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Start Date:</span>
                                                    <span className="text-[var(--text-primary)]">{new Date(pkg.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Last ROI:</span>
                                                    <span className="text-[var(--text-primary)]">
                                                        {pkg.lastRoiDate ? new Date(pkg.lastRoiDate).toLocaleDateString() : 'Not yet paid'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-[var(--text-tertiary)]">ROI Progress:</span>
                                                    <span className="text-[var(--text-primary)] font-medium">
                                                        {formatCurrency(totalRoiPaid)} / {formatCurrency(capLimit)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[var(--border-color)] rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-full ${progress >= 100 ? 'bg-red-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                            } transition-all duration-500`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-[var(--text-tertiary)] mt-1">{progress.toFixed(1)}% of cap reached</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 md:p-6">
                        <h3 className="text-lg font-bold text-blue-400 mb-3">Package Information</h3>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li>• <strong>Minimum Investment:</strong> 100 RISE tokens</li>
                            <li>• <strong>Base ROI:</strong> 8% per month up to 2.5x cap</li>
                            <li>• <strong>Speed Bonus 1:</strong> 10% ROI & 3x cap (Get 2 direct refs within 14 days)</li>
                            <li>• <strong>Speed Bonus 2:</strong> 12% ROI & 4x cap (Get 4 direct refs within 21 days)</li>
                            <li>• <strong>ROI Payout:</strong> Monthly on package anniversary date</li>
                            <li>• <strong>Direct Bonus:</strong> Your referrer gets 5% of your package amount immediately</li>
                            <li>• <strong>Direct Referral Counting:</strong> Next referral must invest MORE than your package amount (X) to count for cap increase</li>
                        </ul>
                    </div>
                </>
            )}

            {/* Staking Tab */}
            {activeTab === 'staking' && (
                <>
                    {/* Create Stake Section */}
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg border border-purple-500 p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-4">
                            <FaLock className="text-purple-200 text-xl md:text-2xl" />
                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Create New Stake</h2>
                        </div>

                        <div className="bg-purple-800/50 rounded-lg p-4 mb-4">
                            <p className="text-purple-100 text-sm mb-2">
                                <strong>Available Deposit Balance:</strong> {formatCurrency(depositBalance)} RISE
                            </p>
                            <p className="text-purple-200 text-xs">
                                💡 <strong>Note:</strong> Deposit from your linked wallet first. Staked funds are locked until maturity. Principal + Interest will be transferred to Reward wallet upon completion.
                            </p>
                        </div>

                        <form onSubmit={handleCreateStake} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-100 mb-2">
                                    Staking Duration
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {stakingTiers.map((tier) => (
                                        <button
                                            key={tier.months}
                                            type="button"
                                            onClick={() => setDuration(tier.months)}
                                            className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${duration === tier.months
                                                ? 'bg-purple-500 text-white shadow-lg scale-105'
                                                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
                                                }`}
                                        >
                                            <div className="font-bold">{tier.label}</div>
                                            <div className="text-xs mt-1">{tier.rate}%/mo</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-100 mb-2">
                                    Stake Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    disabled={creatingStake}
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>

                            {amount && selectedTier && (
                                <div className="bg-purple-800/70 rounded-lg p-4 border border-purple-500">
                                    <h3 className="font-bold text-purple-100 mb-2">Expected Return</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-purple-200">Principal:</p>
                                            <p className="text-white font-bold">{formatCurrency(parseFloat(amount) || 0)}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-200">Monthly Rate:</p>
                                            <p className="text-white font-bold">{selectedTier.rate}%</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-200">Duration:</p>
                                            <p className="text-white font-bold">{duration} months</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-200">Total Return:</p>
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
                    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-4 md:p-6 transition-colors duration-200">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <FaClock className="text-purple-400" />
                            Active Stakes
                        </h2>

                        {stakes.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-tertiary)]">
                                <p className="text-lg mb-2">No active stakes yet</p>
                                <p className="text-sm">Create your first stake above to earn guaranteed returns</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {stakes.map((stake) => {
                                    const { progress, daysRemaining } = calculateStakeProgress(stake);
                                    const isActive = stake.status === 'ACTIVE';
                                    const stakeAmount = parseFloat(stake.amount);
                                    const rate = parseFloat(stake.roiRate);
                                    const months = stake.durationDays / 30;
                                    const expectedReturn = stakeAmount + ((stakeAmount * rate / 100) * months);

                                    return (
                                        <div
                                            key={stake.id}
                                            className="bg-[var(--bg-primary)] rounded-lg border-2 border-[var(--border-color)] p-4 md:p-6 hover:border-purple-500 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-sm text-[var(--text-tertiary)]">Staked Amount</p>
                                                    <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                                                        {formatCurrency(stakeAmount)}
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {stake.status}
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Monthly Rate:</span>
                                                    <span className="text-purple-400 font-bold">{rate}%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Duration:</span>
                                                    <span className="text-[var(--text-primary)] font-medium">{months.toFixed(0)} months</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Start Date:</span>
                                                    <span className="text-[var(--text-primary)]">{new Date(stake.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Maturity Date:</span>
                                                    <span className="text-[var(--text-primary)]">{new Date(stake.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--text-tertiary)]">Expected Return:</span>
                                                    <span className="text-green-400 font-bold">{formatCurrency(expectedReturn)}</span>
                                                </div>
                                            </div>

                                            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-[var(--text-tertiary)]">Time Progress:</span>
                                                    <span className="text-[var(--text-primary)] font-medium">
                                                        {daysRemaining} days remaining
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[var(--border-color)] rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-full ${progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-purple-500'
                                                            } transition-all duration-500`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-[var(--text-tertiary)] mt-1">{progress.toFixed(1)}% complete</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Staking Return Calculator */}
                    <StakingCalculator />
                </>
            )}
        </div>
    );
};

export default Investments;
