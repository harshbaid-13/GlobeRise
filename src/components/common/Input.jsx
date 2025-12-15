const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          {label} {required && <span className="text-[#ef4444]">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2.5 bg-[var(--input-bg)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] touch-target transition-colors duration-200 ${error ? 'border-[#ef4444]' : 'border-[var(--border-color)]'
          } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
};

export default Input;
