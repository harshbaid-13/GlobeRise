import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  className = '' 
}) => {
  const variants = {
    success: {
      bg: 'bg-[#10b981]/20',
      border: 'border-[#10b981]',
      text: 'text-[#10b981]',
      icon: FaCheckCircle,
    },
    error: {
      bg: 'bg-[#ef4444]/20',
      border: 'border-[#ef4444]',
      text: 'text-[#ef4444]',
      icon: FaTimesCircle,
    },
    warning: {
      bg: 'bg-[#f59e0b]/20',
      border: 'border-[#f59e0b]',
      text: 'text-[#f59e0b]',
      icon: FaExclamationCircle,
    },
    info: {
      bg: 'bg-[#00d4ff]/20',
      border: 'border-[#00d4ff]',
      text: 'text-[#00d4ff]',
      icon: FaInfoCircle,
    },
  };
  
  const variant = variants[type];
  const Icon = variant.icon;
  
  return (
    <div className={`${variant.bg} ${variant.border} border-l-4 p-4 rounded ${className}`}>
      <div className="flex items-center">
        <Icon className={`${variant.text} mr-3`} />
        <p className={`${variant.text} flex-1`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`${variant.text} hover:opacity-75 focus:outline-none`}
          >
            <FaTimesCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

