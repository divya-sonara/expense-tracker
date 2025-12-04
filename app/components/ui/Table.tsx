import React from 'react'
import { TableProps } from '@/app/lib/types'

/**
 * Table component with semantic HTML and accessibility
 */
export const Table: React.FC<TableProps> = ({ data, columns, onRowClick }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                        {columns.map(column => (
                            <th
                                key={column.key}
                                scope="col"
                                className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                    }`}
                            >
                                {column.header}
                                {column.sortable && <span className="ml-2">⟷</span>}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            onClick={() => onRowClick?.(row)}
                            role={onRowClick ? 'button' : undefined}
                            tabIndex={onRowClick ? 0 : undefined}
                        >
                            {columns.map(column => (
                                <td
                                    key={`${rowIndex}-${column.key}`}
                                    className="px-6 py-4 text-sm text-gray-700"
                                >
                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No data available</p>
                </div>
            )}
        </div>
    )
}
