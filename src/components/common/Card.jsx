const Card = ({ 
  children, 
  className = '', 
  title,
  action,
  ...props 
}) => {
  return (
    <div className={`bg-[#1a1f2e] rounded-lg shadow-md border border-[#374151] p-6 ${className}`} {...props}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

