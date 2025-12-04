import React from 'react'
import { InputProps } from '@/app/lib/types'

/**
 * Input component with accessibility support
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required = false, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
