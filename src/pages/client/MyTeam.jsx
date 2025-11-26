import { useState, useEffect } from 'react';
import { referralService } from '../../services/referralService';
import Table from '../../components/common/Table';
import StatsCard from '../../components/common/StatsCard';
import { FaUsers, FaUserPlus, FaSitemap } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const MyTeam = () => {
    const [loading, setLoading] = useState(true);
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await referralService.getReferralTree();
                setTreeData(data);
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
        { header: 'Name', accessor: 'email', render: (value) => value ? value.split('@')[0] : 'N/A' }, // Using email as name for now if name not available
        { header: 'Rank', accessor: 'rank' },
        { header: 'Directs', accessor: 'directCount' },
        { header: 'Team Size', accessor: 'teamCount' },
        { header: 'Total Business', accessor: 'totalTeamBusiness', render: (value) => `$${parseFloat(value || 0).toFixed(2)}` },
        { header: 'Last Month', accessor: 'lastMonthBusiness', render: (value) => `$${parseFloat(value || 0).toFixed(2)}` },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">My Team</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="My Rank"
                    value={treeData?.upline?.rank || 'None'} // This might be wrong, need my rank
                    icon={FaSitemap}
                    color="purple"
                />
                <StatsCard
                    title="Direct Referrals"
                    value={treeData?.referrals?.length || 0}
                    icon={FaUserPlus}
                    color="blue"
                />
                <StatsCard
                    title="Upline"
                    value={treeData?.upline?.email?.split('@')[0] || 'None'}
                    icon={FaUsers}
                    color="green"
                />
            </div>

            {treeData?.upline && (
                <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">My Upline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                        <div>
                            <span className="text-gray-500 block text-sm">Name</span>
                            <span className="font-medium text-white">{treeData.upline.email}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-sm">Rank</span>
                            <span className="font-medium text-[#00d4ff]">{treeData.upline.rank}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-sm">Total Downlines</span>
                            <span className="font-medium text-white">{treeData.upline.totalDownlines}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#1a1f2e] rounded-lg border border-[#374151] p-6">
                <h2 className="text-xl font-bold text-white mb-4">My Direct Downline</h2>
                <Table columns={columns} data={treeData?.referrals || []} />
            </div>
        </div>
    );
};

export default MyTeam;
