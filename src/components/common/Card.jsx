const Card = ({
  children,
  className = '',
  title,
  action,
  ...props
}) => {
  return (
    <div className={`bg-[var(--card-bg)] rounded-lg shadow-md border border-[var(--border-color)] p-4 md:p-6 transition-colors duration-200 ${className}`} {...props}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
          {title && <h3 className="text-base md:text-lg font-semibold text-[var(--text-primary)]">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
