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
    blue: 'border-[#00ADB5] text-[#00ADB5]',
    green: 'border-[#10b981] text-[#10b981]',
    red: 'border-[#ef4444] text-[#ef4444]',
    orange: 'border-[#f59e0b] text-[#f59e0b]',
    purple: 'border-[#8b5cf6] text-[#8b5cf6]',
  };

  const iconColors = {
    blue: 'bg-[#00ADB5]/20',
    green: 'bg-[#10b981]/20',
    red: 'bg-[#ef4444]/20',
    orange: 'bg-[#f59e0b]/20',
    purple: 'bg-[#8b5cf6]/20',
  };

  return (
    <div
      className={`bg-[var(--card-bg)] border-l-4 rounded-lg shadow-md border border-[var(--border-color)] p-4 md:p-6 cursor-pointer hover:shadow-lg hover:bg-[var(--bg-hover)] transition-all ${colors[color]} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-[var(--text-tertiary)] mb-1">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        <div className={`${iconColors[color]} p-2 md:p-3 rounded-full`}>
          {Icon && <Icon className="text-xl md:text-2xl" />}
        </div>
      </div>
      {onClick && (
        <div className="mt-4 flex items-center text-sm font-medium text-[var(--text-tertiary)] hover:text-[#00ADB5] transition-colors">
          View Details <FaArrowRight className="ml-2" />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
