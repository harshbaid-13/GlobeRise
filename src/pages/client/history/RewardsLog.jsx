import { useState, useEffect } from 'react';
import { transactionService } from '../../../services/transactionService';
import Table from '../../../components/common/Table';
import Loading from '../../../components/common/Loading';

const RewardsLog = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await transactionService.getTransactions({ type: 'REWARDS' });
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
        { header: 'Date', accessor: 'createdAt', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
        { header: 'Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '$0.00' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Status', accessor: 'status', render: (data) => {
                return <span className={`px-2 py-1 rounded text-xs font-medium border ${data === 'COMPLETED' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/40'}`}>
                    {data}
                </span>

            }
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Rewards History</h1>
            <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-6">
                <Table columns={columns} data={transactions} />
            </div>
        </div>
    );
};

export default RewardsLog;
