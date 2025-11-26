import { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import TransactionFilters from '../../components/transactions/TransactionFilters';
import TransactionDetailModal from '../../components/transactions/TransactionDetailModal';
import Table from '../../components/common/Table';
import { FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ type: 'ALL', wallet: 'ALL' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, [filters, currentPage]);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page: currentPage,
                limit: 20,
            };

            if (filters.type && filters.type !== 'ALL') {
                params.type = filters.type;
            }

            if (filters.wallet && filters.wallet !== 'ALL') {
                params.wallet = filters.wallet;
            }

            const data = await transactionService.getTransactions(params);
            setTransactions(data.transactions || []);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Error loading transactions:', err);
            setError(err.response?.data?.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleRowClick = (transaction) => {
        setSelectedTransaction(transaction);
        setModalOpen(true);
    };

    const getTypeColor = (type) => {
        const colors = {
            ROI: 'text-blue-400',
            COMMISSION: 'text-green-400',
            ROYALTY: 'text-purple-400',
            RANK_BONUS: 'text-yellow-400',
            TRANSFER: 'text-orange-400',
            INVESTMENT: 'text-pink-400',
            WITHDRAWAL: 'text-red-400',
            DEPOSIT: 'text-blue-400',
        };
        return colors[type] || 'text-gray-400';
    };

    const getStatusColor = (status) => {
        const colors = {
            COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
            PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
            REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const columns = [
        {
            header: 'Date',
            accessor: 'createdAt',
            render: (value) => (
                <span className="text-gray-300">
                    {value ? new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }) : 'N/A'}
                </span>
            ),
        },
        {
            header: 'Type',
            accessor: 'type',
            render: (value) => (
                <span className={`font-semibold ${getTypeColor(value)}`}>
                    {value || 'N/A'}
                </span>
            ),
        },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (value) => (
                <span className="text-white font-bold">
                    ${value ? parseFloat(value).toFixed(2) : '0.00'}
                </span>
            ),
        },
        {
            header: 'Wallet',
            accessor: 'destWallet',
            render: (value, row) => (
                <span className="text-gray-400">
                    {value || row.sourceWallet || '-'}
                </span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(value)}`}>
                    {value || 'N/A'}
                </span>
            ),
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (value) => (
                <span className="text-gray-400 truncate max-w-xs">
                    {value || '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <FaHistory className="mr-3 text-blue-500" />
                    Transaction History
                </h1>
                <p className="text-gray-400 mt-1">Complete history of all your transactions</p>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Filters */}
            <TransactionFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
            />

            {/* Transactions Table */}
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Transactions
                        {pagination && (
                            <span className="text-gray-400 text-sm ml-2">
                                ({pagination.total} total)
                            </span>
                        )}
                    </h3>
                </div>

                {loading ? (
                    <Loading />
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <FaHistory className="mx-auto text-5xl text-gray-600 mb-4" />
                        <p className="text-gray-400">No transactions found</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {filters.type !== 'ALL' || filters.wallet !== 'ALL'
                                ? 'Try adjusting your filters'
                                : 'Transactions will appear here once you start earning or investing'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                data={transactions}
                                onRowClick={handleRowClick}
                            />
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#374151]">
                                <div className="text-gray-400 text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-[#0f1419] border border-[#374151] text-white rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                        className="px-4 py-2 bg-[#0f1419] border border-[#374151] text-white rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Transaction Detail Modal */}
            <TransactionDetailModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                transaction={selectedTransaction}
            />
        </div>
    );
};

export default TransactionHistory;
