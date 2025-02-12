import React from "react";

interface Column<T> {
  header: string;
  accessor: (row: T, index?: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage: string;
}

const Table = <T,>({ data, columns, emptyMessage }: TableProps<T>) => {
  return (
    <table className="min-w-full bg-gray-700 text-white text-center">
      <thead>
        <tr className="bg-gray-800">
          {columns.map((col, i) => (
            <th key={i} className="py-3 px-5">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 ? (
          data.map((row, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-2">
                  {col.accessor(row, index)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
