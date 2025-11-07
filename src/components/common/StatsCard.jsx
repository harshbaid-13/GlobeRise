import { FaArrowRight } from 'react-icons/fa';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  onClick,
  className = '' 
}) => {
  const colors = {
    blue: 'border-[#00d4ff] text-[#00d4ff]',
    green: 'border-[#10b981] text-[#10b981]',
    red: 'border-[#ef4444] text-[#ef4444]',
    orange: 'border-[#f59e0b] text-[#f59e0b]',
    purple: 'border-[#8b5cf6] text-[#8b5cf6]',
  };
  
  const iconColors = {
    blue: 'bg-[#00d4ff]/20',
    green: 'bg-[#10b981]/20',
    red: 'bg-[#ef4444]/20',
    orange: 'bg-[#f59e0b]/20',
    purple: 'bg-[#8b5cf6]/20',
  };
  
  return (
    <div 
      className={`bg-[#1a1f2e] border-l-4 rounded-lg shadow-md border border-[#374151] p-6 cursor-pointer hover:shadow-lg hover:bg-[#252a3a] transition-all ${colors[color]} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`${iconColors[color]} p-3 rounded-full`}>
          {Icon && <Icon className="text-2xl" />}
        </div>
      </div>
      {onClick && (
        <div className="mt-4 flex items-center text-sm font-medium text-gray-400 hover:text-[#00d4ff] transition-colors">
          View Details <FaArrowRight className="ml-2" />
        </div>
      )}
    </div>
  );
};

export default StatsCard;

