import React from 'react'
import { ButtonProps } from '@/app/lib/types'

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

/**
 * Button component with accessibility support
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', disabled = false, children, ...props }, ref) => {
    const baseStyles =
      'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyle = variantStyles[variant]
    const sizeStyle = sizeStyles[size]

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
