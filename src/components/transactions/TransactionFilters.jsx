import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const TransactionFilters = ({ onFilterChange, currentFilters }) => {
    const [filters, setFilters] = useState(currentFilters || {});

    const transactionTypes = [
        { value: 'ALL', label: 'All Types' },
        { value: 'ROI', label: 'ROI' },
        { value: 'COMMISSION', label: 'Commission' },
        { value: 'ROYALTY', label: 'Royalty' },
        { value: 'RANK_BONUS', label: 'Rank Bonus' },
        { value: 'REWARDS', label: 'All Rewards' },
        { value: 'TRANSFER', label: 'Transfer' },
        { value: 'INVESTMENT', label: 'Investment' },
        { value: 'WITHDRAWAL', label: 'Withdrawal' },
        { value: 'DEPOSIT', label: 'Deposit' },
    ];

    const walletTypes = [
        { value: 'ALL', label: 'All Wallets' },
        { value: 'FIAT', label: 'Fiat Wallet' },
        { value: 'DEPOSIT', label: 'Deposit Wallet' },
        { value: 'STAKING', label: 'Staking Wallet' },
        { value: 'REWARD', label: 'Reward Wallet' },
        { value: 'WITHDRAWAL', label: 'Withdrawal Wallet' },
    ];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const resetFilters = { type: 'ALL', wallet: 'ALL' };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--text-primary)] font-semibold flex items-center">
                    <FaFilter className="mr-2 text-blue-500" />
                    Filters
                </h3>
                <button
                    onClick={resetFilters}
                    className="px-3 py-1 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-blue-500 rounded transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-2">
                        Transaction Type
                    </label>
                    <select
                        value={filters.type || 'ALL'}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    >
                        {transactionTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Wallet Filter */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-2">
                        Wallet
                    </label>
                    <select
                        value={filters.wallet || 'ALL'}
                        onChange={(e) => handleFilterChange('wallet', e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    >
                        {walletTypes.map((wallet) => (
                            <option key={wallet.value} value={wallet.value}>
                                {wallet.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {(filters.type !== 'ALL' || filters.wallet !== 'ALL') && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.type !== 'ALL' && (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                            Type: {transactionTypes.find(t => t.value === filters.type)?.label}
                        </span>
                    )}
                    {filters.wallet !== 'ALL' && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                            Wallet: {walletTypes.find(w => w.value === filters.wallet)?.label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

TransactionFilters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    currentFilters: PropTypes.shape({
        type: PropTypes.string,
        wallet: PropTypes.string,
    }),
};

export default TransactionFilters;
