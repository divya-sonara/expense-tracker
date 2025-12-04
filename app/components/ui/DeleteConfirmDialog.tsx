'use client'

import React from 'react'
import { Dialog } from './Dialog'
import { Expense } from '@/app/lib/types'
import { formatCurrency, formatDate, getCategoryConfig } from '@/app/lib/constants'

interface DeleteConfirmDialogProps {
    isOpen: boolean
    expense: Expense | null
    onConfirm: () => void
    onCancel: () => void
}

/**
 * DeleteConfirmDialog - Confirmation dialog for safe expense deletion
 * 
 * Displays expense details (amount, category, date, description) with
 * a clear warning message. Requires explicit user confirmation.
 * 
 * Features:
 * - Shows full expense details for verification
 * - Focus trap (Tab cycles within dialog)
 * - Escape key to dismiss without deleting
 * - Color-coded buttons (gray Cancel, red Delete)
 * - Clear warning message about irreversible action
 * 
 * @param props Component props
 * @param props.isOpen Whether dialog is visible
 * @param props.expense Expense object to delete (null returns null component)
 * @param props.onConfirm Callback when user clicks Delete button
 * @param props.onCancel Callback when user clicks Cancel or Escape
 * 
 * @example
 * ```tsx
 * <DeleteConfirmDialog
 *   isOpen={showDialog}
 *   expense={expenseToDelete}
 *   onConfirm={() => handleDelete(expenseToDelete.id)}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 * 
 * @accessibility
 * - role="dialog" with aria-labelledby="dialog-title"
 * - Focus trap: Tab stays within dialog
 * - Escape key closes without action
 * - Button labels clearly indicate action (Delete vs Cancel)
 * - High contrast: red for destructive action
 */
export default function DeleteConfirmDialog({
    isOpen,
    expense,
    onConfirm,
    onCancel,
}: DeleteConfirmDialogProps) {
    if (!expense) return null

    const categoryConfig = getCategoryConfig(expense.category)

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onCancel}
            title="Delete Expense?"
            actions={
                <>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete Expense
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete this expense? This action cannot be undone.
                </p>

                {/* Expense details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Amount</span>
                        <span className="text-lg font-semibold text-gray-900">
                            {formatCurrency(expense.amount)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Category</span>
                        <span className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryConfig.color}`}
                            >
                                <span aria-hidden="true">{categoryConfig.icon}</span>
                                <span>{expense.category}</span>
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Date</span>
                        <span className="text-sm text-gray-900">{formatDate(expense.date)}</span>
                    </div>

                    {expense.description && (
                        <div className="pt-3 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-700 block mb-1">Description</span>
                            <p className="text-sm text-gray-900">{expense.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
