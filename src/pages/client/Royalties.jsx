import { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import Table from '../../components/common/Table';
import StatsCard from '../../components/common/StatsCard';
import { FaCrown } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const Royalties = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [totalRoyalties, setTotalRoyalties] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await transactionService.getTransactions({ type: 'ROYALTY' });
                setTransactions(data.transactions || []);

                // Calculate total from transactions or fetch from earnings endpoint
                const total = (data.transactions || []).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                setTotalRoyalties(total);
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
        { header: 'Amount', accessor: 'amount', render: (row) => `$${parseFloat(row.amount).toFixed(2)}` },
        { header: 'Description', accessor: 'description' },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Royalties</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Royalties Earned"
                    value={`$${totalRoyalties.toFixed(2)}`}
                    icon={FaCrown}
                    color="purple"
                />
            </div>

            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Royalty History</h2>
                <Table columns={columns} data={transactions} />
            </div>
        </div>
    );
};

export default Royalties;
