const Table = ({
  columns,
  data,
  className = '',
  onRowClick,
}) => {
  return (
    <div className="table-responsive">
      <table className={`min-w-full divide-y divide-[var(--border-color)] ${className}`}>
        <thead className="bg-[var(--bg-secondary)]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-[var(--text-tertiary)]">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={onRowClick ? 'cursor-pointer hover:bg-[var(--bg-hover)] transition-colors' : ''}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-[var(--text-secondary)]">
                    {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
