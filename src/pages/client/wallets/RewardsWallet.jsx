import { useState, useEffect } from 'react';
import { walletService } from '../../../services/walletService';
import { transactionService } from '../../../services/transactionService';
import { WALLET_TYPES } from '../../../utils/walletConstants';
import WalletCard from '../../../components/wallet/WalletCard';
import WalletTransferModal from '../../../components/wallet/WalletTransferModal';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';

const RewardsWallet = () => {
    const [balance, setBalance] = useState(0);
    const [balances, setBalances] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [bals, txs] = await Promise.all([
                walletService.getBalances(),
                transactionService.getTransactions({ wallet: WALLET_TYPES.REWARD })
            ]);
            setBalances(bals);
            setBalance(bals.reward || 0);
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
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Rewards Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WalletCard
                    type={WALLET_TYPES.REWARD}
                    balance={balance}
                    onTransfer={() => setTransferModalOpen(true)}
                    showTransfer={true}
                />
            </div>

            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Rewards History</h2>
                <Table columns={columns} data={transactions} />
            </div>

            <WalletTransferModal
                isOpen={transferModalOpen}
                onClose={() => setTransferModalOpen(false)}
                onTransfer={handleTransfer}
                sourceWallet={WALLET_TYPES.REWARD}
                balances={balances}
            />
        </div>
    );
};

export default RewardsWallet;
