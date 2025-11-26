import { useState, useEffect } from 'react';
import { walletService } from '../../../services/walletService';
import { transactionService } from '../../../services/transactionService';
import { WALLET_TYPES } from '../../../utils/walletConstants';
import WalletCard from '../../../components/wallet/WalletCard';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';
import ROIPlanCard from '../../../components/roi/ROIPlanCard';
import { investmentService } from '../../../services/investmentService';

const ROIWallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balances, txs, invs] = await Promise.all([
                    walletService.getBalances(),
                    transactionService.getTransactions({ type: 'ROI' }),
                    investmentService.getMyInvestments()
                ]);
                setBalance(balances.roi || 0); // Assuming ROI wallet balance exists or derived
                setTransactions(txs.transactions || []);
                setInvestments(invs || []);
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
        { header: 'Description', accessor: 'description' },
        { header: 'Amount', accessor: 'amount', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
    ];

    const investmentColumns = [
        { header: 'Package', accessor: 'packageName' },
        { header: 'Amount', accessor: 'amount', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
        { header: 'ROI Paid', accessor: 'roiPaid', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">ROI Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WalletCard
                    type={WALLET_TYPES.ROI}
                    balance={balance}
                    showTransfer={false}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Active Investments</h2>
                    <Table columns={investmentColumns} data={investments} />
                </div>

                <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                    <h2 className="text-xl font-bold text-white mb-4">ROI History</h2>
                    <Table columns={columns} data={transactions} />
                </div>
            </div>
        </div>
    );
};

export default ROIWallet;
