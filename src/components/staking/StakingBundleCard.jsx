import Button from '../common/Button';
import { FaLock, FaClock, FaHistory } from 'react-icons/fa';

const StakingBundleCard = ({ bundle, onStake }) => {
    return (
        <div className="bg-[#1a1f2e] rounded-xl border border-[#374151] p-6 hover:shadow-lg hover:border-[#f59e0b] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#f59e0b]/20 rounded-lg">
                    <FaLock className="text-[#f59e0b] text-2xl" />
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">APY</p>
                    <p className="text-2xl font-bold text-[#f59e0b]">{bundle.apy}%</p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">{bundle.name}</h3>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                        <FaClock className="mr-2" /> Duration
                    </span>
                    <span className="text-white font-medium">{bundle.durationMonths} Months</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                        <FaHistory className="mr-2" /> Min Stake
                    </span>
                    <span className="text-white font-medium">${bundle.minAmount}</span>
                </div>
            </div>

            <Button
                variant="warning"
                className="w-full"
                onClick={() => onStake(bundle)}
            >
                Stake Now
            </Button>
        </div>
    );
};

export default StakingBundleCard;
