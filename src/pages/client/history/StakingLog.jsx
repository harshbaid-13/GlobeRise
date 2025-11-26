import { useState, useEffect } from 'react';
import { transactionService } from '../../../services/transactionService';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';
import { WALLET_TYPES } from '../../../utils/walletConstants';

const StakingLog = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await transactionService.getTransactions({ wallet: WALLET_TYPES.STAKING });
                setTransactions(data.transactions || []);
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
        { header: 'Date', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        { header: 'Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (row) => `$${parseFloat(row.amount).toFixed(2)}` },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Status', accessor: 'status', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs ${row.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {row.status}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Staking History</h1>
            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <Table columns={columns} data={transactions} />
            </div>
        </div>
    );
};

export default StakingLog;
