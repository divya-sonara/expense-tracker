'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { DialogProps } from '@/app/lib/types'

/**
 * Dialog/Modal component with accessibility support
 * Includes focus trap and Escape key handler
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
    ({ isOpen, onClose, title, children, actions, onEscapeClose = true }, ref) => {
        const dialogRef = useRef<HTMLDivElement>(null)
        const firstFocusableRef = useRef<HTMLElement>(null)
        const lastFocusableRef = useRef<HTMLElement>(null)

        // Handle Escape key
        useEffect(() => {
            if (!isOpen) return

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && onEscapeClose) {
                    onClose()
                }
            }

            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }, [isOpen, onClose, onEscapeClose])

        // Focus management and trap
        useEffect(() => {
            if (!isOpen || !dialogRef.current) return

            // Store the element that had focus before opening dialog
            const previousActiveElement = document.activeElement as HTMLElement

            // Find focusable elements
            const focusableElements = dialogRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )

            if (focusableElements.length > 0) {
                firstFocusableRef.current = focusableElements[0] as HTMLElement
                lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement
                firstFocusableRef.current.focus()
            }

            // Handle Tab key for focus trap
            const handleTab = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return

                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusableRef.current) {
                        e.preventDefault()
                        lastFocusableRef.current?.focus()
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusableRef.current) {
                        e.preventDefault()
                        firstFocusableRef.current?.focus()
                    }
                }
            }

            document.addEventListener('keydown', handleTab)

            // Restore focus when dialog closes
            return () => {
                document.removeEventListener('keydown', handleTab)
                previousActiveElement?.focus()
            }
        }, [isOpen])

        if (!isOpen) return null

        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Dialog */}
                <div
                    ref={dialogRef}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-labelledby="dialog-title"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="border-b border-gray-200 p-6">
                            <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">{children}</div>

                        {/* Actions */}
                        {actions && <div className="border-t border-gray-200 p-6 flex gap-3 justify-end">{actions}</div>}
                    </div>
                </div>
            </>
        )
    }
)

Dialog.displayName = 'Dialog'
