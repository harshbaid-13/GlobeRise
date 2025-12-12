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
      {/* Blurred backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity z-40"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
        <div
          className={`relative bg-[var(--card-bg)] rounded-lg text-left overflow-hidden shadow-2xl border border-[var(--border-color)] transform transition-all w-full ${sizes[size]} md:max-h-[90vh] max-h-screen overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[var(--card-bg)] px-4 pt-4 pb-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              {title && <h3 className="text-base md:text-lg font-medium text-[var(--text-primary)]">{title}</h3>}
              <button
                onClick={onClose}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] focus:outline-none transition-colors touch-target p-1"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[var(--text-primary)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
