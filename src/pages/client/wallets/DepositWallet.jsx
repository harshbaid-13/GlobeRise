import { useState, useEffect } from 'react';
import { walletService } from '../../../services/walletService';
import { transactionService } from '../../../services/transactionService';
import { WALLET_TYPES } from '../../../utils/walletConstants';
import WalletCard from '../../../components/wallet/WalletCard';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';

const DepositWallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balances, txs] = await Promise.all([
                    walletService.getBalances(),
                    transactionService.getTransactions({ wallet: WALLET_TYPES.DEPOSIT })
                ]);
                setBalance(balances.deposit || 0);
                setTransactions(txs.transactions || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loading />;

    const columns = [
        { header: 'Date', accessor: 'createdAt', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
        { header: 'Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
        {
            header: 'Status', accessor: 'status', render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${value === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                    value === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>
                    {value || 'N/A'}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Deposit Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WalletCard
                    type={WALLET_TYPES.DEPOSIT}
                    balance={balance}
                    showTransfer={false}
                />
            </div>

            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
                <Table columns={columns} data={transactions} />
            </div>
        </div>
    );
};

export default DepositWallet;
