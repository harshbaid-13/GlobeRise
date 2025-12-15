import { useState, useEffect } from 'react';
import { walletService } from '../../../services/walletService';
import { transactionService } from '../../../services/transactionService';
import { WALLET_TYPES } from '../../../utils/walletConstants';
import WalletCard from '../../../components/wallet/WalletCard';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';

const WithdrawalWallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const fetchData = async () => {
        try {
            const [balances, txs] = await Promise.all([
                walletService.getBalances(),
                transactionService.getTransactions({ wallet: WALLET_TYPES.WITHDRAWAL })
            ]);
            setBalance(balances.withdrawal || 0);
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

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            await walletService.requestWithdrawal(parseFloat(withdrawAmount));
            setWithdrawModalOpen(false);
            setWithdrawAmount('');
            await fetchData();
        } catch (err) {
            console.error(err);
            alert('Withdrawal failed: ' + err.message);
        }
    };

    if (loading) return <Loading />;

    const columns = [
        { header: 'Date', accessor: 'createdAt', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
        { header: 'Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
        {
            header: 'Status', accessor: 'status', render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${value === 'COMPLETED' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40' :
                    value === 'PENDING' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/40' :
                        'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40'
                    }`}>
                    {value || 'N/A'}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Withdrawal Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WalletCard
                    type={WALLET_TYPES.WITHDRAWAL}
                    balance={balance}
                    onWithdraw={() => setWithdrawModalOpen(true)}
                    showWithdraw={true}
                    showTransfer={false}
                />
            </div>

            <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Withdrawal History</h2>
                <Table columns={columns} data={transactions} />
            </div>

            <Modal
                isOpen={withdrawModalOpen}
                onClose={() => setWithdrawModalOpen(false)}
                title="Request Withdrawal"
            >
                <form onSubmit={handleWithdraw} className="space-y-4">
                    <Input
                        label="Amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        min="10"
                        required
                    />
                    <p className="text-sm text-gray-400">
                        Available Balance: ${parseFloat(balance).toFixed(2)}
                    </p>
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="secondary" onClick={() => setWithdrawModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Withdraw
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default WithdrawalWallet;
