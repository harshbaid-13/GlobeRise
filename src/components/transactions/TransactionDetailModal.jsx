import PropTypes from 'prop-types';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'PENDING':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'FAILED':
            case 'REJECTED':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getTypeColor = (type) => {
        const typeColors = {
            ROI: 'text-blue-400',
            COMMISSION: 'text-green-400',
            ROYALTY: 'text-purple-400',
            RANK_BONUS: 'text-yellow-400',
            TRANSFER: 'text-orange-400',
            INVESTMENT: 'text-pink-400',
            WITHDRAWAL: 'text-red-400',
            DEPOSIT: 'text-blue-400',
        };
        return typeColors[type] || 'text-gray-400';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#374151]">
                    <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Amount & Status */}
                    <div className="text-center py-4">
                        <div className="text-4xl font-bold text-white mb-2">
                            ${parseFloat(transaction.amount).toFixed(2)}
                        </div>
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'COMPLETED' && <FaCheckCircle />}
                            {transaction.status === 'PENDING' && <FaExclamationCircle />}
                            {(transaction.status === 'FAILED' || transaction.status === 'REJECTED') && <FaTimes />}
                            <span className="font-semibold">{transaction.status}</span>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0f1419] rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-1">Transaction Type</div>
                            <div className={`font-semibold ${getTypeColor(transaction.type)}`}>
                                {transaction.type}
                            </div>
                        </div>

                        <div className="bg-[#0f1419] rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-1">Transaction ID</div>
                            <div className="text-white font-mono text-sm truncate">
                                {transaction.id}
                            </div>
                        </div>
                    </div>

                    {/* Wallet Information */}
                    {(transaction.sourceWallet || transaction.destWallet) && (
                        <div className="bg-[#0f1419] rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-3">Wallet Transfer</div>
                            <div className="flex items-center justify-center space-x-4">
                                {transaction.sourceWallet && (
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">From</div>
                                        <div className="px-3 py-2 bg-[#1a1f2e] rounded border border-[#374151] text-white font-semibold">
                                            {transaction.sourceWallet}
                                        </div>
                                    </div>
                                )}

                                {transaction.sourceWallet && transaction.destWallet && (
                                    <FaArrowRight className="text-blue-500" />
                                )}

                                {transaction.destWallet && (
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">To</div>
                                        <div className="px-3 py-2 bg-[#1a1f2e] rounded border border-[#374151] text-white font-semibold">
                                            {transaction.destWallet}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {transaction.description && (
                        <div className="bg-[#0f1419] rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-2">Description</div>
                            <div className="text-white">{transaction.description}</div>
                        </div>
                    )}

                    {/* Metadata */}
                    {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                        <div className="bg-[#0f1419] rounded-lg p-4">
                            <div className="text-gray-400 text-sm mb-2">Additional Information</div>
                            <div className="space-y-2">
                                {Object.entries(transaction.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                                        <span className="text-white font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="bg-[#0f1419] rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-2">Date & Time</div>
                        <div className="text-white">{formatDate(transaction.createdAt)}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#374151]">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

TransactionDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    transaction: PropTypes.shape({
        id: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        type: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        sourceWallet: PropTypes.string,
        destWallet: PropTypes.string,
        description: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        metadata: PropTypes.object,
    }),
};

export default TransactionDetailModal;
