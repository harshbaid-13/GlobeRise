import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>
        
        <div className={`inline-block align-bottom bg-[#1a1f2e] rounded-lg text-left overflow-hidden shadow-xl border border-[#374151] transform transition-all sm:my-8 sm:align-middle ${sizes[size]} w-full ${className}`}>
          <div className="bg-[#1a1f2e] px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white focus:outline-none transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

