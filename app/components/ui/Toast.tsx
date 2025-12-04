'use client'

import React from 'react'
import { ToastProps } from '@/app/lib/types'

/**
 * Toast notification component with accessibility
 */
export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    React.useEffect(() => {
        if (type !== 'error') {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [type, duration, onClose])

    const bgColor = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    }[type]

    const textColor = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
    }[type]

    const roleAttribute = type === 'error' ? 'alert' : 'status'

    return (
        <div
            className={`${bgColor} border rounded-lg p-4 flex items-start justify-between gap-4`}
            role={roleAttribute}
            aria-live="polite"
            aria-atomic="true"
        >
            <p className={`${textColor} font-medium`}>{message}</p>
            {type === 'error' && (
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    aria-label="Dismiss notification"
                >
                    ✕
                </button>
            )}
        </div>
    )
}
