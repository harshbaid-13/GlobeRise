import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaUser, FaTrophy } from 'react-icons/fa';
import TeamMemberCard from './TeamMemberCard';

const ReferralTreeView = ({ treeData }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    const toggleNode = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const getRankColor = (rank) => {
        const rankColors = {
            'NONE': 'text-gray-400',
            'STARTER': 'text-blue-400',
            'EXPLORER': 'text-green-400',
            'ADVENTURER': 'text-yellow-400',
            'NAVIGATOR': 'text-orange-400',
            'VOYAGER': 'text-purple-400',
            'CHAMPION': 'text-pink-400',
            'MASTER': 'text-indigo-400',
            'GRANDMASTER': 'text-red-400',
            'LEGEND': 'text-yellow-300',
        };
        return rankColors[rank] || rankColors['NONE'];
    };

    if (!treeData) {
        return (
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-8">
                <p className="text-gray-400 text-center">No network data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Upline Section */}
            {treeData.upline && (
                <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        Your Sponsor (Upline)
                    </h3>
                    <div className="bg-[#0f1419] rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{treeData.upline.email}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <FaTrophy className={`${getRankColor(treeData.upline.rank)}`} />
                                    <span className="text-gray-400 text-sm">{treeData.upline.rank}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400 text-sm">{treeData.upline.totalDownlines} team members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Your Referral Code */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Your Referral Code</h3>
                <div className="flex items-center space-x-4">
                    <code className="bg-[#0f1419] px-4 py-2 rounded text-blue-400 text-xl font-mono font-bold">
                        {treeData.myCode}
                    </code>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(treeData.myCode);
                            // Could add a toast notification here
                        }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                        Copy Code
                    </button>
                </div>
            </div>

            {/* Downlines Section */}
            <div className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                    <FaUser className="mr-2 text-green-500" />
                    Your Direct Referrals ({treeData.referrals?.length || 0})
                </h3>

                {!treeData.referrals || treeData.referrals.length === 0 ? (
                    <div className="bg-[#0f1419] rounded-lg p-8 text-center">
                        <FaUser className="mx-auto text-4xl text-gray-600 mb-3" />
                        <p className="text-gray-400">No direct referrals yet</p>
                        <p className="text-gray-500 text-sm mt-2">Share your referral code to build your team</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {treeData.referrals.map((member) => (
                            <TeamMemberCard
                                key={member.id}
                                member={member}
                                onClick={() => toggleNode(member.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Tree Visualization Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                    💡 <strong>Tip:</strong> Click on team member cards to view their network details (coming soon)
                </p>
            </div>
        </div>
    );
};

ReferralTreeView.propTypes = {
    treeData: PropTypes.shape({
        myCode: PropTypes.string.isRequired,
        upline: PropTypes.shape({
            id: PropTypes.string,
            email: PropTypes.string,
            rank: PropTypes.string,
            totalDownlines: PropTypes.number,
        }),
        referrals: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
                rank: PropTypes.string.isRequired,
                directCount: PropTypes.number,
                teamCount: PropTypes.number,
                totalTeamBusiness: PropTypes.string,
                lastMonthBusiness: PropTypes.string,
            })
        ),
    }),
};

export default ReferralTreeView;
