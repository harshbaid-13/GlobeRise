import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import BusinessChart from '../../components/charts/BusinessChart';
import StatsCard from '../../components/common/StatsCard';
import { FaUsers, FaChartLine } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const TeamBusiness = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTeamBusiness: 0,
        monthlyTeamBusiness: 0,
        activeMembers: 0
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats({
                    totalTeamBusiness: parseFloat(data.teamBusiness || 0),
                    monthlyTeamBusiness: parseFloat(data.lastMonthBusiness || 0), // Using lastMonthBusiness as proxy for monthly or need specific endpoint
                    activeMembers: 0 // Backend doesn't seem to return active members count in stats, might need another endpoint or ignore
                });

                // Note: Backend API documentation doesn't show a specific team business chart endpoint.
                // We might need to use /api/dashboard/chart (earnings) or request a new endpoint.
                // For now, we'll leave chart data empty or use a placeholder if backend doesn't support it.
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
            <h1 className="text-2xl font-bold text-white">Team Business</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Team Business"
                    value={`$${stats.totalTeamBusiness.toLocaleString()}`}
                    icon={FaChartLine}
                    color="purple"
                />
                <StatsCard
                    title="Last Month Business"
                    value={`$${stats.monthlyTeamBusiness.toLocaleString()}`}
                    icon={FaChartLine}
                    color="blue"
                />
                {/* <StatsCard
          title="Active Members"
          value={stats.activeMembers}
          icon={FaUsers}
          color="green"
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

export default TeamBusiness;
