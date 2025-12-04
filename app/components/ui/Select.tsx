import React from 'react'
import { SelectProps } from '@/app/lib/types'

/**
 * Select component with accessibility support
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, required = false, id, className = '', ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
        const errorId = error ? `${selectId}-error` : undefined

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } ${className}`}
                    aria-invalid={!!error}
                    aria-describedby={errorId}
                    required={required}
                    {...props}
                >
                    <option value="">Select an option</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p id={errorId} className="text-red-500 text-sm mt-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'
