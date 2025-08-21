import React from "react";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface ResponsiveTableProps {
  data: TableData;
  className?: string;
  caption?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  className = "",
  caption,
}) => {
  return (
    <div className={`blog_table_wrapper ${className}`}>
      <table className="blog_table">
        {caption && (
          <caption className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="blog_table_row">
            {data.headers.map((header, index) => (
              <th key={index} className="blog_table_header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="blog_table_row">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="blog_table_cell"
                  data-label={data.headers[cellIndex]}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
