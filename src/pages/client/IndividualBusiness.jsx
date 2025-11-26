import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import BusinessChart from '../../components/charts/BusinessChart';
import StatsCard from '../../components/common/StatsCard';
import { FaUserTie, FaChartBar } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const IndividualBusiness = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDirectBusiness: 0,
        monthlyDirectBusiness: 0,
        directReferrals: 0
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats({
                    totalDirectBusiness: parseFloat(data.directBusiness || 0),
                    monthlyDirectBusiness: 0, // Not provided in stats endpoint
                    directReferrals: 0 // Not provided in stats endpoint, maybe from referral tree?
                });
                setChartData([]);
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
            <h1 className="text-2xl font-bold text-white">Individual Business</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Direct Business"
                    value={`$${stats.totalDirectBusiness.toLocaleString()}`}
                    icon={FaChartBar}
                    color="green"
                />
                {/* <StatsCard
                    title="This Month"
                    value={`$${stats.monthlyDirectBusiness.toLocaleString()}`}
                    icon={FaChartBar}
                    color="blue"
                />
                <StatsCard
                    title="Direct Referrals"
                    value={stats.directReferrals}
                    icon={FaUserTie}
                    color="orange"
                /> */}
            </div>

            {chartData.length > 0 && <BusinessChart data={chartData} />}
            {chartData.length === 0 && (
                <div className="bg-[#1a1f2e] p-6 rounded-lg border border-[#374151] text-center text-gray-400">
                    No chart data available
                </div>
            )}
        </div>
    );
};

export default IndividualBusiness;
