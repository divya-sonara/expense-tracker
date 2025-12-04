'use client'

import React, { useState, useMemo } from 'react'
import { Expense, ExpenseCategory } from '@/app/lib/types'
import { formatCurrency, formatDate, getCategoryConfig } from '@/app/lib/constants'
import { Table } from '@/app/components/ui'
import { Button } from '@/app/components/ui'
import DeleteConfirmDialog from '@/app/components/ui/DeleteConfirmDialog'

export interface ExpenseListProps {
    expenses: Expense[]
    onDelete: (id: string) => Promise<void>
    onFilter?: (category: ExpenseCategory | null) => void
    isLoading?: boolean
}

type SortField = 'date' | 'amount' | 'category'
type SortDirection = 'asc' | 'desc'

/**
 * ExpenseList component displays expenses in a responsive, sortable table
 * 
 * Features:
 * - Semantic HTML table structure with proper headers
 * - Sortable by date (default), amount, or category
 * - Delete button with confirmation dialog (Phase 5)
 * - Empty state when no expenses
 * - Responsive layout (horizontal scroll on mobile)
 * - Accessibility: Proper ARIA labels, semantic HTML, keyboard navigation
 * 
 * @param props Component props
 * @param props.expenses Array of Expense objects to display
 * @param props.onDelete Async callback when user confirms deletion
 * @param props.onFilter Optional callback when filter changes (for future use)
 * @param props.isLoading Optional loading state
 * 
 * @example
 * ```tsx
 * <ExpenseList
 *   expenses={expenses}
 *   onDelete={handleDelete}
 *   isLoading={isLoading}
 * />
 * ```
 * 
 * @accessibility
 * - Uses semantic <table> with <thead> and <tbody>
 * - Table headers have scope="col"
 * - Delete button has aria-label with expense details
 * - Sortable headers announce sort direction
 */
export const ExpenseList: React.FC<ExpenseListProps> = ({
    expenses,
    onDelete,
    onFilter,
    isLoading = false,
}) => {
    const [sortField, setSortField] = useState<SortField>('date')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

    // Sort expenses
    const sortedExpenses = useMemo(() => {
        const sorted = [...expenses].sort((a, b) => {
            let aVal: string | number
            let bVal: string | number

            switch (sortField) {
                case 'date':
                    aVal = new Date(a.date).getTime()
                    bVal = new Date(b.date).getTime()
                    break
                case 'amount':
                    aVal = a.amount
                    bVal = b.amount
                    break
                case 'category':
                    aVal = a.category
                    bVal = b.category
                    break
                default:
                    aVal = new Date(a.date).getTime()
                    bVal = new Date(b.date).getTime()
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

        return sorted
    }, [expenses, sortField, sortDirection])

    // Handle column header click for sorting
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            // New field, default to descending
            setSortField(field)
            setSortDirection('desc')
        }
    }

    // Render sort indicator
    const renderSortIndicator = (field: SortField) => {
        if (sortField !== field) return null
        return (
            <span className="ml-1" aria-hidden="true">
                {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
        )
    }

    // Truncate description
    const truncateDescription = (text: string | undefined, maxLength: number = 50): string => {
        if (!text) return ''
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
    }

    // Handle delete click
    const handleDeleteClick = (expense: Expense) => {
        setExpenseToDelete(expense)
    }

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (expenseToDelete) {
            await onDelete(expenseToDelete.id)
            setExpenseToDelete(null)
        }
    }

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setExpenseToDelete(null)
    }

    // Empty state
    if (expenses.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No expenses yet
                </h3>
                <p className="text-gray-600">
                    Add your first expense to get started tracking your spending!
                </p>
            </div>
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table container with horizontal scroll on mobile */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Date column */}
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('date')}
                                aria-sort={sortField === 'date' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                            >
                                <button
                                    className="flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    aria-label={`Sort by date ${sortField === 'date' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'descending'}`}
                                >
                                    Date
                                    {renderSortIndicator('date')}
                                </button>
                            </th>

                            {/* Amount column */}
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('amount')}
                                aria-sort={sortField === 'amount' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                            >
                                <button
                                    className="flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    aria-label={`Sort by amount ${sortField === 'amount' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'descending'}`}
                                >
                                    Amount
                                    {renderSortIndicator('amount')}
                                </button>
                            </th>

                            {/* Category column */}
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('category')}
                                aria-sort={sortField === 'category' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                            >
                                <button
                                    className="flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    aria-label={`Sort by category ${sortField === 'category' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'descending'}`}
                                >
                                    Category
                                    {renderSortIndicator('category')}
                                </button>
                            </th>

                            {/* Description column */}
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                            >
                                Description
                            </th>

                            {/* Actions column */}
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedExpenses.map((expense) => {
                            const categoryConfig = getCategoryConfig(expense.category)
                            return (
                                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Date */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(expense.date)}
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(expense.amount)}
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
                                            <span className="mr-1" aria-hidden="true">{categoryConfig.icon}</span>
                                            {expense.category}
                                        </span>
                                    </td>

                                    {/* Description (hidden on mobile) */}
                                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                                        <span title={expense.description || ''}>
                                            {truncateDescription(expense.description)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(expense)}
                                            aria-label={`Delete expense: ${formatCurrency(expense.amount)} for ${expense.category} on ${formatDate(expense.date)}`}
                                            className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Expense count */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600" aria-live="polite">
                    Showing <span className="font-medium text-gray-900">{sortedExpenses.length}</span> expense{sortedExpenses.length !== 1 ? 's' : ''}
                    {sortedExpenses.length > 0 && (
                        <>
                            {' · '}
                            <span className="font-medium text-gray-900">
                                Total: {formatCurrency(sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                            </span>
                        </>
                    )}
                </p>
            </div>

            {/* Delete confirmation dialog */}
            <DeleteConfirmDialog
                isOpen={expenseToDelete !== null}
                expense={expenseToDelete}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    )
}
