import PropTypes from 'prop-types';
import { FaUsers, FaUser, FaBriefcase, FaChartLine } from 'react-icons/fa';

const NetworkStats = ({ data }) => {
    const stats = [
        {
            title: 'Direct Referrals',
            value: data?.referrals?.length || 0,
            icon: FaUser,
            color: 'blue',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Total Team',
            value: data?.upline?.totalDownlines || 0,
            icon: FaUsers,
            color: 'green',
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500',
        },
        {
            title: 'Team Business',
            value: `$${parseFloat(data?.totalTeamBusiness || 0).toFixed(2)}`,
            icon: FaBriefcase,
            color: 'purple',
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
        },
        {
            title: 'Last Month',
            value: `$${parseFloat(data?.lastMonthBusiness || 0).toFixed(2)}`,
            icon: FaChartLine,
            color: 'orange',
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-[#1a1f2e] border border-[#374151] rounded-lg p-6 hover:border-blue-500 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                            <p className="text-white text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`text-xl ${stat.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

NetworkStats.propTypes = {
    data: PropTypes.shape({
        referrals: PropTypes.array,
        upline: PropTypes.shape({
            totalDownlines: PropTypes.number,
        }),
        totalTeamBusiness: PropTypes.string,
        lastMonthBusiness: PropTypes.string,
    }),
};

export default NetworkStats;
