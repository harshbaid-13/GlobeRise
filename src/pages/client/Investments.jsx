import { useState, useEffect } from 'react';
import { investmentService } from '../../services/investmentService';
import { walletService } from '../../services/walletService';
import { formatCurrency } from '../../utils/formatters';
import { FaCoins, FaRocket, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const Investments = () => {
    const [fiatBalance, setFiatBalance] = useState(0);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingPackage, setCreatingPackage] = useState(false);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setPackages(investments.filter(inv => inv.type === 'PACKAGE'));
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
            setError('Minimum investment amount is $100');
            return;
        }

        if (amountNum > fiatBalance) {
            setError('Insufficient Fiat wallet balance');
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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">MLM Investment Packages</h1>

            {/* Create Package Section */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FaRocket className="text-blue-300 text-2xl" />
                    <h2 className="text-2xl font-bold text-white">Create New Package</h2>
                </div>

                <div className="bg-blue-950/50 rounded-lg p-4 mb-4">
                    <p className="text-blue-200 text-sm mb-2">
                        <strong>Available Fiat Balance:</strong> {formatCurrency(fiatBalance)}
                    </p>
                    <p className="text-blue-300 text-xs">
                        💡 <strong>Speed Bonus:</strong> Get 2 direct refs within 14 days for 10% ROI (3x cap) or 4 refs within 21 days for 12% ROI (4x cap)
                    </p>
                </div>

                <form onSubmit={handleCreatePackage} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                            Investment Amount (Minimum $100)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 bg-blue-950/50 border border-blue-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaCoins className="text-yellow-400" />
                    Active Packages
                </h2>

                {packages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg mb-2">No active packages yet</p>
                        <p className="text-sm">Create your first package above to start earning ROI</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {packages.map((pkg) => {
                            const { totalRoiPaid, capLimit, progress, capMultiplier } = calculateROIProgress(pkg);
                            const isActive = pkg.status === 'ACTIVE';
                            const roiRate = parseFloat(pkg.roiRate);

                            return (
                                <div
                                    key={pkg.id}
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 p-6 hover:border-blue-500 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Package Amount</p>
                                            <p className="text-3xl font-bold text-white">
                                                {formatCurrency(pkg.amount)}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {pkg.status}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">ROI Rate:</span>
                                            <span className={`font-bold ${roiRate >= 12 ? 'text-purple-400' : roiRate >= 10 ? 'text-blue-400' : 'text-green-400'
                                                }`}>
                                                {roiRate}% per month
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Cap Limit:</span>
                                            <span className="text-white font-medium">{capMultiplier}x ({formatCurrency(capLimit)})</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Start Date:</span>
                                            <span className="text-white">{new Date(pkg.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Last ROI:</span>
                                            <span className="text-white">
                                                {pkg.lastRoiDate ? new Date(pkg.lastRoiDate).toLocaleDateString() : 'Not yet paid'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-950/50 rounded-lg p-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">ROI Progress:</span>
                                            <span className="text-white font-medium">
                                                {formatCurrency(totalRoiPaid)} / {formatCurrency(capLimit)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full ${progress >= 100 ? 'bg-red-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                    } transition-all duration-500`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{progress.toFixed(1)}% of cap reached</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-300 mb-3">Package Information</h3>
                <ul className="space-y-2 text-sm text-blue-200">
                    <li>• <strong>Base ROI:</strong> 8% per month up to 2.5x cap</li>
                    <li>• <strong>Speed Bonus 1:</strong> 10% ROI & 3x cap (Get 2 direct refs within 14 days)</li>
                    <li>• <strong>Speed Bonus 2:</strong> 12% ROI & 4x cap (Get 4 direct refs within 21 days)</li>
                    <li>• <strong>ROI Payout:</strong> Monthly on package anniversary date</li>
                    <li>• <strong>Direct Bonus:</strong> Your referrer gets 5% of your package amount immediately</li>
                    <li>• <strong>Progressive Rule:</strong> Cannot invest less than your previous package</li>
                    <li>• <strong>Downline Rule:</strong> Cannot invest more than your referrer's package</li>
                </ul>
            </div>
        </div>
    );
};

export default Investments;
