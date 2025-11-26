import { useState, useEffect } from 'react';
import { walletService } from '../../../services/walletService';
import { transactionService } from '../../../services/transactionService';
import { WALLET_TYPES } from '../../../utils/walletConstants';
import WalletCard from '../../../components/wallet/WalletCard';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';
import StakingBundleCard from '../../../components/staking/StakingBundleCard';
import { investmentService } from '../../../services/investmentService';

const StakingWallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock bundles for demo
    const bundles = [
        { id: 1, name: 'Starter Bundle', apy: 12, durationMonths: 6, minAmount: 100 },
        { id: 2, name: 'Growth Bundle', apy: 18, durationMonths: 12, minAmount: 500 },
        { id: 3, name: 'Wealth Bundle', apy: 24, durationMonths: 24, minAmount: 1000 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balances, txs] = await Promise.all([
                    walletService.getBalances(),
                    transactionService.getTransactions({ wallet: WALLET_TYPES.STAKING })
                ]);
                setBalance(balances.staking || 0);
                setTransactions(txs.transactions || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStake = async (bundle) => {
        // Implement stake logic
        console.log('Staking', bundle);
        // await investmentService.createFixedDeposit(amount, bundle.durationMonths);
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
            <h1 className="text-2xl font-bold text-white">Staking Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WalletCard
                    type={WALLET_TYPES.STAKING}
                    balance={balance}
                    showTransfer={false}
                />
            </div>

            <h2 className="text-xl font-bold text-white">Available Staking Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bundles.map(bundle => (
                    <StakingBundleCard key={bundle.id} bundle={bundle} onStake={handleStake} />
                ))}
            </div>

            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Staking History</h2>
                <Table columns={columns} data={transactions} />
            </div>
        </div>
    );
};

export default StakingWallet;
