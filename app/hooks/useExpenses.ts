'use client'

import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Expense, ExpenseCategory, AddExpensePayload, UseExpensesReturn } from '@/app/lib/types'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEY, STORAGE_VERSION } from '@/app/lib/constants'
import { AddExpenseSchema } from '@/app/lib/schemas'

interface ExpenseStorageData {
    version: number
    expenses: Expense[]
    lastUpdated: string
}

/**
 * Custom hook for managing expenses with localStorage persistence
 * 
 * Provides complete CRUD operations for expenses with localStorage integration.
 * All expenses are stored in an encrypted format using btoa/atob encoding.
 * 
 * @returns {UseExpensesReturn} Object containing:
 *   - expenses: Array of Expense objects
 *   - addExpense: Async function to add new expense
 *   - deleteExpense: Async function to delete expense by ID
 *   - filterByCategory: Function to filter expenses by category
 *   - isLoaded: Boolean indicating if localStorage data is loaded
 *   - error: Error message if localStorage fails
 * 
 * @example
 * ```tsx
 * const { expenses, addExpense, deleteExpense, filterByCategory } = useExpenses()
 * 
 * // Add expense
 * await addExpense({
 *   amount: 42.50,
 *   category: 'Food',
 *   date: '2024-01-15',
 *   description: 'Lunch'
 * })
 * 
 * // Delete expense
 * await deleteExpense('expense-id')
 * 
 * // Filter by category
 * const foodExpenses = filterByCategory('Food')
 * ```
 */
export function useExpenses(): UseExpensesReturn {
    const defaultValue: ExpenseStorageData = {
        version: STORAGE_VERSION,
        expenses: [],
        lastUpdated: new Date().toISOString(),
    }

    const { value: storage, setValue: setStorage, isLoaded, error } = useLocalStorage<ExpenseStorageData>(
        STORAGE_KEY,
        defaultValue
    )

    // Add expense
    const addExpense = useCallback(
        async (data: AddExpensePayload): Promise<Expense | null> => {
            try {
                // Validate with Zod
                const validated = AddExpenseSchema.parse(data)

                const newExpense: Expense = {
                    id: uuidv4(),
                    amount: validated.amount,
                    category: validated.category,
                    description: validated.description || undefined,
                    date: validated.date,
                    createdAt: new Date().toISOString(),
                }

                setStorage(prev => ({
                    ...prev,
                    expenses: [newExpense, ...prev.expenses],
                    lastUpdated: new Date().toISOString(),
                }))

                return newExpense
            } catch (err) {
                console.error('Error adding expense:', err)
                return null
            }
        },
        [setStorage]
    )

    // Delete expense
    const deleteExpense = useCallback(
        async (id: string): Promise<boolean> => {
            try {
                const found = storage.expenses.some(e => e.id === id)
                if (!found) {
                    console.warn(`Expense with id ${id} not found`)
                    return false
                }

                setStorage(prev => ({
                    ...prev,
                    expenses: prev.expenses.filter(e => e.id !== id),
                    lastUpdated: new Date().toISOString(),
                }))

                return true
            } catch (err) {
                console.error('Error deleting expense:', err)
                return false
            }
        },
        [storage.expenses, setStorage]
    )

    // Filter by category
    const filterByCategory = useCallback(
        (category: ExpenseCategory | null): Expense[] => {
            if (!category) return storage.expenses
            return storage.expenses.filter(e => e.category === category)
        },
        [storage.expenses]
    )

    // Sort expenses by date (newest first)
    const sortedExpenses = useMemo(() => {
        return [...storage.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [storage.expenses])

    return {
        expenses: sortedExpenses,
        addExpense,
        deleteExpense,
        filterByCategory,
        error,
        isLoaded,
    }
}
