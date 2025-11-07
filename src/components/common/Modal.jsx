import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  variant = 'dark',
  className = '' 
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const isLight = variant === 'light';
  const bgColor = isLight ? 'bg-white' : 'bg-[#1a1f2e]';
  const borderColor = isLight ? 'border-gray-200' : 'border-[#374151]';
  const textColor = isLight ? 'text-gray-800' : 'text-white';
  const titleColor = isLight ? 'text-gray-800' : 'text-white';
  const closeButtonColor = isLight ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-white';
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity z-40" 
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="relative z-50 flex items-center justify-center min-h-screen px-4 py-4">
        <div 
          className={`relative ${bgColor} rounded-lg text-left overflow-hidden shadow-2xl border ${borderColor} transform transition-all ${sizes[size]} w-full max-h-[90vh] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${bgColor} px-4 pt-5 pb-4 sm:p-6`}>
            <div className="flex justify-between items-center mb-4">
              {title && <h3 className={`text-lg font-medium ${titleColor}`}>{title}</h3>}
              <button
                onClick={onClose}
                className={`${closeButtonColor} focus:outline-none transition-colors`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className={textColor}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

