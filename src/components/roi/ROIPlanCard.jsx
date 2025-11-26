import Button from '../common/Button';
import { FaCheckCircle } from 'react-icons/fa';

const ROIPlanCard = ({ plan, onInvest }) => {
    return (
        <div className="bg-[#1a1f2e] rounded-xl border border-[#374151] overflow-hidden hover:border-[#00d4ff] transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
            <div className="p-6 text-center border-b border-[#374151] bg-gradient-to-b from-[#252a3a] to-[#1a1f2e]">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-[#00d4ff] mb-1">
                    {plan.roi}%
                    <span className="text-sm text-gray-400 font-normal ml-1">/ day</span>
                </div>
                <p className="text-gray-400 text-sm">for {plan.duration} days</p>
            </div>

            <div className="p-6">
                <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-300">
                        <FaCheckCircle className="text-[#10b981] mr-2 flex-shrink-0" />
                        <span>Min Investment: ${plan.minAmount}</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                        <FaCheckCircle className="text-[#10b981] mr-2 flex-shrink-0" />
                        <span>Max Investment: ${plan.maxAmount}</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                        <FaCheckCircle className="text-[#10b981] mr-2 flex-shrink-0" />
                        <span>Total Return: {plan.roi * plan.duration}%</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                        <FaCheckCircle className="text-[#10b981] mr-2 flex-shrink-0" />
                        <span>Principal Returned: {plan.principalReturned ? 'Yes' : 'No'}</span>
                    </li>
                </ul>

                <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => onInvest(plan)}
                >
                    Invest Now
                </Button>
            </div>
        </div>
    );
};

export default ROIPlanCard;
