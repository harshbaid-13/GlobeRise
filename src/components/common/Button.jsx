const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#00d4ff] text-[#0d1421] hover:bg-[#3b82f6] focus:ring-[#00d4ff] font-semibold',
    secondary: 'bg-[#252a3a] text-gray-300 hover:bg-[#374151] focus:ring-gray-500',
    success: 'bg-[#10b981] text-white hover:bg-[#059669] focus:ring-[#10b981]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]',
    warning: 'bg-[#f59e0b] text-white hover:bg-[#d97706] focus:ring-[#f59e0b]',
    outline: 'border-2 border-[#00d4ff] text-[#00d4ff] hover:bg-[#252a3a] focus:ring-[#00d4ff]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

