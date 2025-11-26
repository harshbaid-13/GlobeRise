import PropTypes from 'prop-types';
import { FaTrophy, FaStar, FaCrown, FaGem } from 'react-icons/fa';

const RankBadge = ({ rank, size = 'md', showLabel = true }) => {
    const rankConfig = {
        'NONE': {
            label: 'No Rank',
            color: 'bg-gray-500',
            textColor: 'text-gray-100',
            borderColor: 'border-gray-400',
            icon: FaTrophy,
            gradient: 'from-gray-500 to-gray-600',
        },
        'STARTER': {
            label: 'Starter',
            color: 'bg-blue-500',
            textColor: 'text-blue-100',
            borderColor: 'border-blue-400',
            icon: FaStar,
            gradient: 'from-blue-500 to-blue-600',
        },
        'EXPLORER': {
            label: 'Explorer',
            color: 'bg-green-500',
            textColor: 'text-green-100',
            borderColor: 'border-green-400',
            icon: FaStar,
            gradient: 'from-green-500 to-green-600',
        },
        'ADVENTURER': {
            label: 'Adventurer',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-100',
            borderColor: 'border-yellow-400',
            icon: FaStar,
            gradient: 'from-yellow-500 to-yellow-600',
        },
        'NAVIGATOR': {
            label: 'Navigator',
            color: 'bg-orange-500',
            textColor: 'text-orange-100',
            borderColor: 'border-orange-400',
            icon: FaTrophy,
            gradient: 'from-orange-500 to-orange-600',
        },
        'VOYAGER': {
            label: 'Voyager',
            color: 'bg-purple-500',
            textColor: 'text-purple-100',
            borderColor: 'border-purple-400',
            icon: FaTrophy,
            gradient: 'from-purple-500 to-purple-600',
        },
        'CHAMPION': {
            label: 'Champion',
            color: 'bg-pink-500',
            textColor: 'text-pink-100',
            borderColor: 'border-pink-400',
            icon: FaCrown,
            gradient: 'from-pink-500 to-pink-600',
        },
        'MASTER': {
            label: 'Master',
            color: 'bg-indigo-500',
            textColor: 'text-indigo-100',
            borderColor: 'border-indigo-400',
            icon: FaCrown,
            gradient: 'from-indigo-500 to-indigo-600',
        },
        'GRANDMASTER': {
            label: 'Grandmaster',
            color: 'bg-red-500',
            textColor: 'text-red-100',
            borderColor: 'border-red-400',
            icon: FaGem,
            gradient: 'from-red-500 to-red-600',
        },
        'LEGEND': {
            label: 'Legend',
            color: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
            textColor: 'text-white',
            borderColor: 'border-yellow-400',
            icon: FaGem,
            gradient: 'from-yellow-400 to-red-500',
            special: true,
        },
    };

    const config = rankConfig[rank] || rankConfig['NONE'];
    const Icon = config.icon;

    const sizeClasses = {
        sm: {
            badge: 'px-2 py-1 text-xs',
            icon: 'text-xs',
        },
        md: {
            badge: 'px-3 py-1.5 text-sm',
            icon: 'text-sm',
        },
        lg: {
            badge: 'px-4 py-2 text-base',
            icon: 'text-base',
        },
        xl: {
            badge: 'px-6 py-3 text-lg',
            icon: 'text-xl',
        },
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div
            className={`inline-flex items-center space-x-2 rounded-full border-2 ${config.borderColor} ${config.special ? config.color : `bg-gradient-to-r ${config.gradient}`
                } ${config.textColor} ${currentSize.badge} font-semibold shadow-lg`}
        >
            <Icon className={currentSize.icon} />
            {showLabel && <span>{config.label}</span>}
        </div>
    );
};

RankBadge.propTypes = {
    rank: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    showLabel: PropTypes.bool,
};

export default RankBadge;
