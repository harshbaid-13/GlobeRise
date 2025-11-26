import { useState, useEffect } from 'react';
import { referralService } from '../../services/referralService';
import { dashboardService } from '../../services/dashboardService';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import ReferralTreeView from '../../components/network/ReferralTreeView';
import NetworkStats from '../../components/network/NetworkStats';

const NetworkTree = () => {
    const [treeData, setTreeData] = useState(null);
    const [dashStats, setDashStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [tree, stats] = await Promise.all([
                referralService.getReferralTree(),
                dashboardService.getStats(),
            ]);

            setTreeData(tree);
            setDashStats(stats);
        } catch (err) {
            console.error('Error loading network data:', err);
            setError(err.response?.data?.message || 'Failed to load network data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Network Tree</h1>
                    <p className="text-gray-400 mt-1">View your MLM network structure and team</p>
                </div>
                <button
                    onClick={loadData}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    Refresh
                </button>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Network Statistics */}
            <NetworkStats data={{ ...treeData, ...dashStats }} />

            {/* Referral Tree View */}
            <ReferralTreeView treeData={treeData} />
        </div>
    );
};

export default NetworkTree;
