import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          {label} {required && <span className="text-[#ef4444]">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`w-full px-3 py-2.5 bg-[var(--input-bg)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] touch-target transition-colors duration-200 ${error ? 'border-[#ef4444]' : 'border-[var(--border-color)]'
            } ${isPassword ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] rounded p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
};

export default Input;
