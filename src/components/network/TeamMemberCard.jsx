import PropTypes from 'prop-types';
import { FaUser, FaUsers, FaBriefcase, FaChartLine, FaTrophy } from 'react-icons/fa';

const TeamMemberCard = ({ member, onClick }) => {
    const getRankColor = (rank) => {
        const rankColors = {
            'NONE': 'bg-gray-100 text-gray-800 border-gray-300',
            'STARTER': 'bg-blue-100 text-blue-800 border-blue-300',
            'EXPLORER': 'bg-green-100 text-green-800 border-green-300',
            'ADVENTURER': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'NAVIGATOR': 'bg-orange-100 text-orange-800 border-orange-300',
            'VOYAGER': 'bg-purple-100 text-purple-800 border-purple-300',
            'CHAMPION': 'bg-pink-100 text-pink-800 border-pink-300',
            'MASTER': 'bg-indigo-100 text-indigo-800 border-indigo-300',
            'GRANDMASTER': 'bg-red-100 text-red-800 border-red-300',
            'LEGEND': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-500',
        };
        return rankColors[rank] || rankColors['NONE'];
    };

    return (
        <div
            onClick={onClick}
            className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-4 hover:border-blue-500 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">{member.email}</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full border mt-1 ${getRankColor(member.rank)}`}>
                            <FaTrophy className="inline mr-1" />
                            {member.rank}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0f1419] rounded p-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                        <FaUser />
                        <span>Direct</span>
                    </div>
                    <div className="text-white font-semibold">{member.directCount || 0}</div>
                </div>

                <div className="bg-[#0f1419] rounded p-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                        <FaUsers />
                        <span>Team</span>
                    </div>
                    <div className="text-white font-semibold">{member.teamCount || 0}</div>
                </div>

                <div className="bg-[#0f1419] rounded p-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                        <FaBriefcase />
                        <span>Team Business</span>
                    </div>
                    <div className="text-white font-semibold text-sm">${parseFloat(member.totalTeamBusiness || 0).toFixed(2)}</div>
                </div>

                <div className="bg-[#0f1419] rounded p-2">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                        <FaChartLine />
                        <span>Last Month</span>
                    </div>
                    <div className="text-white font-semibold text-sm">${parseFloat(member.lastMonthBusiness || 0).toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};

TeamMemberCard.propTypes = {
    member: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        rank: PropTypes.string.isRequired,
        directCount: PropTypes.number,
        teamCount: PropTypes.number,
        totalTeamBusiness: PropTypes.string,
        lastMonthBusiness: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func,
};

export default TeamMemberCard;
