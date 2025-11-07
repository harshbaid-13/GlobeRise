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
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label} {required && <span className="text-[#ef4444]">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2 bg-[#252a3a] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent text-white placeholder-gray-400 ${
          error ? 'border-[#ef4444]' : 'border-[#374151]'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
};

export default Input;

