import { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { dashboardService } from '../../services/dashboardService';
import EarningsChart from '../../components/charts/EarningsChart';
import StatsCard from '../../components/common/StatsCard';
import { FaChartPie, FaMoneyBillWave } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState({});
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [earningsData, chartData] = await Promise.all([
                    transactionService.getEarnings(),
                    dashboardService.getEarningsChart()
                ]);

                setEarnings(earningsData.breakdown || {});
                setChartData(chartData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="ROI Earnings"
                    value={`$${parseFloat(earnings.ROI?.total || 0).toFixed(2)}`}
                    icon={FaMoneyBillWave}
                    color="green"
                />
                <StatsCard
                    title="Commissions"
                    value={`$${parseFloat(earnings.COMMISSION?.total || 0).toFixed(2)}`}
                    icon={FaMoneyBillWave}
                    color="blue"
                />
                <StatsCard
                    title="Royalties"
                    value={`$${parseFloat(earnings.ROYALTY?.total || 0).toFixed(2)}`}
                    icon={FaMoneyBillWave}
                    color="purple"
                />
                <StatsCard
                    title="Rank Bonuses"
                    value={`$${parseFloat(earnings.RANK_BONUS?.total || 0).toFixed(2)}`}
                    icon={FaMoneyBillWave}
                    color="orange"
                />
            </div>

            {chartData.length > 0 ? (
                <EarningsChart data={chartData} />
            ) : (
                <div className="bg-[#1a1f2e] p-6 rounded-lg border border-[#374151] text-center text-gray-400">
                    No earnings history available
                </div>
            )}
        </div>
    );
};

export default Reports;
