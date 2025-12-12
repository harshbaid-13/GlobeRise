import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import TransactionFilters from '../../components/transactions/TransactionFilters';
import TransactionDetailModal from '../../components/transactions/TransactionDetailModal';
import Table from '../../components/common/Table';
import { FaHistory, FaChevronLeft, FaChevronRight, FaDownload, FaFileCsv, FaFilePdf } from 'react-icons/fa';

const TransactionHistory = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tabFromUrl = searchParams.get('tab') || 'ALL';
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]); // For export
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ type: 'ALL', wallet: 'ALL' });
    const [activeTab, setActiveTab] = useState(tabFromUrl); // Filter tabs
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const transactionTypes = [
        { key: 'ALL', label: 'All' },
        { key: 'DEPOSIT', label: 'Deposits' },
        { key: 'ROI', label: 'ROI' },
        { key: 'COMMISSION', label: 'Commissions' },
        { key: 'TRANSFER', label: 'Transfers' },
        { key: 'WITHDRAWAL', label: 'Withdrawals' },
        { key: 'RANK_BONUS', label: 'Bonuses' },
        { key: 'ROYALTY', label: 'Royalties' },
        { key: 'INVESTMENT', label: 'Investments' }
    ];

    useEffect(() => {
        loadTransactions();
    }, [filters, currentPage, activeTab, dateRange]);

    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') || 'ALL';
        setActiveTab(tabFromUrl);
    }, [searchParams]);

    useEffect(() => {
        if (activeTab !== 'ALL') {
            setFilters(prev => ({ ...prev, type: activeTab }));
        } else {
            setFilters(prev => ({ ...prev, type: 'ALL' }));
        }
    }, [activeTab]);

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

            if (dateRange.startDate) {
                params.startDate = dateRange.startDate;
            }

            if (dateRange.endDate) {
                params.endDate = dateRange.endDate;
            }

            const data = await transactionService.getTransactions(params);
            setTransactions(data.transactions || []);
            setPagination(data.pagination);

            // Load all transactions for export (without pagination)
            if (currentPage === 1) {
                const exportParams = { ...params, limit: 1000, page: 1 };
                const exportData = await transactionService.getTransactions(exportParams);
                setAllTransactions(exportData.transactions || []);
            }
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

    const handleTabChange = (tab) => {
        navigate(`?tab=${tab}`);
    };

    const exportToCSV = () => {
        setExporting(true);
        try {
            const headers = ['Date', 'Type', 'Amount', 'Wallet', 'Status', 'Description'];
            const rows = allTransactions.map(tx => [
                new Date(tx.createdAt).toLocaleDateString(),
                tx.type || 'N/A',
                parseFloat(tx.amount || 0).toFixed(2),
                tx.destWallet || tx.sourceWallet || '-',
                tx.status || 'N/A',
                tx.description || '-'
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
            setError('Failed to export CSV');
        } finally {
            setExporting(false);
        }
    };

    const exportToPDF = () => {
        setExporting(true);
        // For PDF export, we'll create a simple HTML table and use browser print
        // In production, you might want to use a library like jsPDF or pdfmake
        try {
            const printWindow = window.open('', '_blank');
            const htmlContent = `
                <html>
                    <head>
                        <title>Transaction History</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h1>Transaction History</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Wallet</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${allTransactions.map(tx => `
                                    <tr>
                                        <td>${new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td>${tx.type || 'N/A'}</td>
                                        <td>$${parseFloat(tx.amount || 0).toFixed(2)}</td>
                                        <td>${tx.destWallet || tx.sourceWallet || '-'}</td>
                                        <td>${tx.status || 'N/A'}</td>
                                        <td>${tx.description || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.print();
        } catch (err) {
            console.error('Export failed:', err);
            setError('Failed to export PDF');
        } finally {
            setExporting(false);
        }
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
            COMPLETED: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40',
            PENDING: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/40',
            FAILED: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40',
            REJECTED: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/40';
    };

    const columns = [
        {
            header: 'Date',
            accessor: 'createdAt',
            render: (value) => (
                <span className="text-[var(--text-secondary)]">
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
                <span className="text-[var(--text-primary)] font-bold">
                    {formatCurrency(parseFloat(value || 0))}
                </span>
            ),
        },
        {
            header: 'Wallet',
            accessor: 'destWallet',
            render: (value, row) => (
                <span className="text-[var(--text-tertiary)]">
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
                <span className="text-[var(--text-tertiary)] truncate max-w-xs">
                    {value || '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center">
                    <FaHistory className="mr-3 text-blue-500" />
                    Transaction History
                </h1>
                <p className="text-[var(--text-tertiary)] mt-1">Complete history of all your transactions</p>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Filter Tabs */}
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-4 transition-colors duration-200">
                <div className="flex flex-wrap gap-2 mb-4">
                    {transactionTypes.map((type) => (
                        <button
                            key={type.key}
                            onClick={() => handleTabChange(type.key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === type.key
                                ? 'bg-[#00ADB5] text-white'
                                : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Date Range Picker */}
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-2">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-2">End Date</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
                        />
                    </div>
                    {(dateRange.startDate || dateRange.endDate) && (
                        <button
                            onClick={() => setDateRange({ startDate: '', endDate: '' })}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            Clear Dates
                        </button>
                    )}
                </div>
            </div>

            {/* Additional Filters */}
            <TransactionFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
            />

            {/* Transactions Table */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Transactions
                        {pagination && (
                            <span className="text-[var(--text-tertiary)] text-sm ml-2">
                                ({pagination.total} total)
                            </span>
                        )}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={exportToCSV}
                            disabled={exporting || allTransactions.length === 0}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFileCsv />
                            Export CSV
                        </button>
                        <button
                            onClick={exportToPDF}
                            disabled={exporting || allTransactions.length === 0}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFilePdf />
                            Export PDF
                        </button>
                    </div>
                </div>

                {loading ? (
                    <Loading />
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <FaHistory className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-tertiary)]">No transactions found</p>
                        <p className="text-[var(--text-muted)] text-sm mt-2">
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
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-color)]">
                                <div className="text-[var(--text-tertiary)] text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                        className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
