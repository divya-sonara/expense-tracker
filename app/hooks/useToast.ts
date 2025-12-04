'use client'

import { useState, useCallback, useEffect } from 'react'
import { UseToastReturn, ToastMessage, ToastType } from '@/app/lib/types'
import { TOAST_DURATION_MS } from '@/app/lib/constants'

/**
 * Custom hook for managing toast notifications
 */
export function useToast(): UseToastReturn {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    // Add a toast message
    const addToast = useCallback(
        (message: string, type: ToastType = 'info'): string => {
            const id = Math.random().toString(36).substr(2, 9)
            const newToast: ToastMessage = { id, message, type }

            setToasts(prev => [...prev, newToast])

            // Auto-remove after duration (unless it's an error)
            if (type !== 'error') {
                setTimeout(() => {
                    removeToast(id)
                }, TOAST_DURATION_MS)
            }

            return id
        },
        []
    )

    // Remove a toast message
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return { toasts, addToast, removeToast }
}
