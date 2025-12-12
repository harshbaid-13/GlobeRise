import { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { FaCalculator } from 'react-icons/fa';

const STAKING_TIERS = [
    { months: 3, rate: 1.25, label: '3 Months' },
    { months: 6, rate: 1.75, label: '6 Months' },
    { months: 12, rate: 2.25, label: '12 Months' },
    { months: 18, rate: 4.00, label: '18 Months' },
    { months: 24, rate: 4.75, label: '24 Months' }
];

const StakingCalculator = () => {
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState(6);

    const selectedTier = STAKING_TIERS.find(t => t.months === duration);
    const amountNum = parseFloat(amount) || 0;

    const calculateReturn = () => {
        if (!selectedTier || !amountNum) return { principal: 0, interest: 0, total: 0, roi: 0 };

        const monthlyReturn = (amountNum * selectedTier.rate) / 100;
        const totalInterest = monthlyReturn * duration;
        const totalReturn = amountNum + totalInterest;
        const roi = (totalInterest / amountNum) * 100;

        return {
            principal: amountNum,
            interest: totalInterest,
            total: totalReturn,
            roi: roi
        };
    };

    const result = calculateReturn();

    return (
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-6">
                <FaCalculator className="text-purple-400 text-2xl" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Staking Return Calculator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Staking Amount (RISE)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Duration (Months)
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {STAKING_TIERS.map((tier) => (
                                <button
                                    key={tier.months}
                                    type="button"
                                    onClick={() => setDuration(tier.months)}
                                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${duration === tier.months
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)]'
                                        }`}
                                >
                                    <div className="font-bold">{tier.label}</div>
                                    <div className="text-xs mt-1">{tier.rate}%/mo</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-purple-500/10 rounded-lg border border-purple-500/30 p-6">
                    <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Expected Returns</h4>

                    {amountNum > 0 ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-[var(--text-secondary)]">Principal:</span>
                                <span className="text-[var(--text-primary)] font-bold text-lg">{formatCurrency(result.principal)}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-[var(--text-secondary)]">Monthly Rate:</span>
                                <span className="text-purple-400 font-semibold">{selectedTier.rate}%</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-[var(--text-secondary)]">Duration:</span>
                                <span className="text-[var(--text-primary)] font-semibold">{duration} months</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-[var(--text-secondary)]">Total Interest:</span>
                                <span className="text-green-400 font-bold">{formatCurrency(result.interest)}</span>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-[var(--text-primary)] font-semibold">Total Return:</span>
                                <span className="text-green-400 font-bold text-2xl">{formatCurrency(result.total)}</span>
                            </div>

                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--text-secondary)] text-sm">ROI:</span>
                                    <span className="text-green-400 font-bold">{result.roi.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-[var(--text-tertiary)]">
                            <p>Enter amount and select duration to calculate returns</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StakingCalculator;
