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
        <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-6">
            <div className="flex items-center gap-3 mb-6">
                <FaCalculator className="text-purple-400 text-2xl" />
                <h3 className="text-xl font-bold text-white">Staking Return Calculator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Staking Amount (GRT)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 bg-[#222831] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Duration (Months)
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {STAKING_TIERS.map((tier) => (
                                <button
                                    key={tier.months}
                                    type="button"
                                    onClick={() => setDuration(tier.months)}
                                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                                        duration === tier.months
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'bg-[#222831] text-gray-300 hover:bg-[#2a2f38] border border-[#4b5563]'
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
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Expected Returns</h4>
                    
                    {amountNum > 0 ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-gray-300">Principal:</span>
                                <span className="text-white font-bold text-lg">{formatCurrency(result.principal)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-gray-300">Monthly Rate:</span>
                                <span className="text-purple-400 font-semibold">{selectedTier.rate}%</span>
                            </div>
                            
                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-gray-300">Duration:</span>
                                <span className="text-white font-semibold">{duration} months</span>
                            </div>
                            
                            <div className="flex justify-between items-center pb-3 border-b border-purple-500/30">
                                <span className="text-gray-300">Total Interest:</span>
                                <span className="text-green-400 font-bold">{formatCurrency(result.interest)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-white font-semibold">Total Return:</span>
                                <span className="text-green-400 font-bold text-2xl">{formatCurrency(result.total)}</span>
                            </div>
                            
                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">ROI:</span>
                                    <span className="text-green-400 font-bold">{result.roi.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p>Enter amount and select duration to calculate returns</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StakingCalculator;

