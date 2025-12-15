import { useState, useEffect } from 'react';
import { referralService } from '../../services/referralService';
import { dashboardService } from '../../services/dashboardService';
import Table from '../../components/common/Table';
import StatsCard from '../../components/common/StatsCard';
import RankBadge from '../../components/rank/RankBadge';
import { formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import { FaUsers, FaUserPlus, FaCopy, FaChartLine, FaLink } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const MyTeam = () => {
    const [loading, setLoading] = useState(true);
    const [treeData, setTreeData] = useState(null);
    const [dashStats, setDashStats] = useState(null);
    const [myRank, setMyRank] = useState('NONE');
    const [copySuccess, setCopySuccess] = useState(false);
    const [linkCopySuccess, setLinkCopySuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tree, stats] = await Promise.all([
                    referralService.getReferralTree(),
                    dashboardService.getStats()
                ]);
                setTreeData(tree);
                setDashStats(stats);
                setMyRank(stats?.rank || 'NONE');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyReferralCode = () => {
        if (treeData?.myCode) {
            navigator.clipboard.writeText(treeData.myCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const copyReferralLink = () => {
        if (treeData?.myCode) {
            const referralLink = `${window.location.origin}${ROUTES.REGISTER}?ref=${treeData.myCode}`;
            navigator.clipboard.writeText(referralLink);
            setLinkCopySuccess(true);
            setTimeout(() => setLinkCopySuccess(false), 2000);
        }
    };

    const getReferralLink = () => {
        if (treeData?.myCode) {
            return `${window.location.origin}${ROUTES.REGISTER}?ref=${treeData.myCode}`;
        }
        return '';
    };

    if (loading) return <Loading />;

    const referrals = treeData?.referrals || [];
    const totalDirect = referrals.length;
    const totalTeam = referrals.reduce((sum, ref) => sum + (ref.teamCount || 0), 0) + totalDirect;
    const totalBusiness = referrals.reduce((sum, ref) => sum + parseFloat(ref.totalTeamBusiness || 0), 0);

    const columns = [
        { header: 'Name', accessor: 'name', render: (value, row) => value || row.email?.split('@')[0] || 'N/A' },
        { header: 'Rank', accessor: 'rank', render: (value) => <RankBadge rank={value || 'NONE'} size="sm" /> },
        { header: 'Directs', accessor: 'directCount' },
        { header: 'Team Size', accessor: 'teamCount' },
        { header: 'Total Business', accessor: 'totalTeamBusiness', render: (value) => formatCurrency(parseFloat(value || 0)) },
        { header: 'Last Month', accessor: 'lastMonthBusiness', render: (value) => formatCurrency(parseFloat(value || 0)) },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Team</h1>
            </div>

            {/* Referral Code Card */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 space-y-4">
                <div>
                    <h3 className="text-[var(--text-primary)] font-semibold mb-3">Your Referral Code</h3>
                    <div className="flex items-center space-x-4">
                        <code className="bg-[var(--bg-primary)] px-4 py-3 rounded text-blue-400 text-xl font-mono font-bold flex-1 border border-[var(--border-color)]">
                            {treeData?.myCode || 'N/A'}
                        </code>
                        <button
                            onClick={copyReferralCode}
                            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center space-x-2"
                        >
                            <FaCopy />
                            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                    <p className="text-[var(--text-tertiary)] text-sm mt-3">
                        Share this code with others to build your network
                    </p>
                </div>

                {/* Referral Link Section */}
                <div className="border-t border-blue-500/30 pt-4">
                    <h3 className="text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2">
                        <FaLink className="text-blue-400" />
                        Your Referral Link
                    </h3>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            readOnly
                            value={getReferralLink()}
                            className="bg-[var(--bg-primary)] px-4 py-3 rounded text-blue-400 text-sm font-mono flex-1 border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={copyReferralLink}
                            className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center space-x-2"
                        >
                            <FaCopy />
                            <span>{linkCopySuccess ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                    </div>
                    <p className="text-[var(--text-tertiary)] text-sm mt-3">
                        Share this link - new users will have your referral code pre-filled when they register!
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Direct Referrals"
                    value={totalDirect}
                    icon={FaUserPlus}
                    color="blue"
                />
                <StatsCard
                    title="Total Team"
                    value={totalTeam}
                    icon={FaUsers}
                    color="green"
                />
                <StatsCard
                    title="Team Business"
                    value={formatCurrency(totalBusiness)}
                    icon={FaChartLine}
                    color="purple"
                />
            </div>

            {/* Referrals Table */}
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] overflow-hidden transition-colors duration-200">
                <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Direct Referrals ({totalDirect})</h3>
                </div>
                <Table columns={columns} data={referrals} />
            </div>

        </div>
    );
};

export default MyTeam;
