'use client'

import React from 'react'
import { ToastProps } from '@/app/lib/types'
import { Toast } from './Toast'

export interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string
}

export interface ToastContainerProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * Container component for rendering multiple toast notifications
 * Manages positioning and layout of toast messages
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right',
}) => {
  // Position CSS classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 space-y-2 pointer-events-none`}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
