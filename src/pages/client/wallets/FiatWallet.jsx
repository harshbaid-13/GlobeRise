import { useState, useEffect } from 'react';
import { walletService } from '../../../services/walletService';
import { transactionService } from '../../../services/transactionService';
import { WALLET_TYPES } from '../../../utils/walletConstants';
import WalletCard from '../../../components/wallet/WalletCard';
import WalletTransferModal from '../../../components/wallet/WalletTransferModal';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';
import { FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';

const FiatWallet = () => {
    const [balance, setBalance] = useState(0);
    const [balances, setBalances] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [bals, txs] = await Promise.all([
                walletService.getBalances(),
                transactionService.getTransactions({ wallet: WALLET_TYPES.FIAT })
            ]);
            setBalances(bals);
            setBalance(bals.fiat || 0);
            setTransactions(txs.transactions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTransfer = async (from, to, amount) => {
        await walletService.transfer(from, to, amount);
        await fetchData();
    };

    if (loading) return <Loading />;

    const columns = [
        { header: 'Date', accessor: 'createdAt', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
        { header: 'Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Status', accessor: 'status', render: (value) => {
                const colorMap = {
                    COMPLETED: 'text-green-400',
                    PENDING: 'text-yellow-400',
                    REJECTED: 'text-red-400',
                    FAILED: 'text-red-400'
                };
                return <span className={`font-medium ${colorMap[value] || 'text-gray-400'}`}>{value}</span>;
            }
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaMoneyBillWave className="text-green-400" />
                Fiat Wallet
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WalletCard
                    type={WALLET_TYPES.FIAT}
                    balance={balance}
                    onTransfer={() => setTransferModalOpen(true)}
                    showTransfer={true}
                />
            </div>

            {/* Info Card */}
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
                    <FaExchangeAlt />
                    Fiat Wallet Information
                </h3>
                <ul className="space-y-2 text-sm text-green-200">
                    <li>• <strong>Purpose:</strong> Entry point for all deposits (crypto/fiat from admin)</li>
                    <li>• <strong>Transfer to DEPOSIT:</strong> Create MLM investment packages</li>
                    <li>• <strong>Transfer to STAKING:</strong> Create fixed-term staking deposits</li>
                    <li>• <strong>Funding:</strong> Balance increases through admin credits or blockchain deposits</li>
                    <li>• <strong>Note:</strong> This is your holding wallet before investing</li>
                </ul>
            </div>

            {/* Transaction History */}
            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Fiat Wallet History</h2>
                <Table columns={columns} data={transactions} />
            </div>

            <WalletTransferModal
                isOpen={transferModalOpen}
                onClose={() => setTransferModalOpen(false)}
                onTransfer={handleTransfer}
                sourceWallet={WALLET_TYPES.FIAT}
                balances={balances}
            />
        </div>
    );
};

export default FiatWallet;
