'use client'

import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Budget, BudgetStorage, BudgetStatus, UseBudgetReturn, Expense, ExpenseCategory } from '@/app/lib/types'
import { useLocalStorage } from './useLocalStorage'
import { BUDGET_STORAGE_KEY, STORAGE_VERSION, BUDGET_WARNING_THRESHOLD, BUDGET_DANGER_THRESHOLD } from '@/app/lib/constants'

/**
 * Custom hook for managing budgets with localStorage persistence
 * 
 * @returns {UseBudgetReturn} Object containing budget management functions
 */
export function useBudget(): UseBudgetReturn {
    const defaultValue: BudgetStorage = {
        version: STORAGE_VERSION,
        budgets: [],
        lastUpdated: new Date().toISOString(),
    }

    const { value: storage, setValue: setStorage, isLoaded, error } = useLocalStorage<BudgetStorage>(
        BUDGET_STORAGE_KEY,
        defaultValue
    )

    // Add budget
    const addBudget = useCallback(
        async (category: ExpenseCategory | 'overall', limit: number, period: 'monthly' | 'weekly' | 'daily'): Promise<Budget | null> => {
            try {
                // Check if budget already exists for this category
                const existingBudget = storage.budgets.find(b => b.category === category && b.period === period)
                if (existingBudget) {
                    // Update existing budget
                    setStorage(prev => ({
                        ...prev,
                        budgets: prev.budgets.map(b => 
                            b.id === existingBudget.id 
                                ? { ...b, limit, createdAt: new Date().toISOString() }
                                : b
                        ),
                        lastUpdated: new Date().toISOString(),
                    }))
                    return { ...existingBudget, limit }
                }

                const newBudget: Budget = {
                    id: uuidv4(),
                    category,
                    limit,
                    period,
                    createdAt: new Date().toISOString(),
                }

                setStorage(prev => ({
                    ...prev,
                    budgets: [...prev.budgets, newBudget],
                    lastUpdated: new Date().toISOString(),
                }))

                return newBudget
            } catch (err) {
                console.error('Error adding budget:', err)
                return null
            }
        },
        [storage.budgets, setStorage]
    )

    // Delete budget
    const deleteBudget = useCallback(
        async (id: string): Promise<boolean> => {
            try {
                const found = storage.budgets.some(b => b.id === id)
                if (!found) {
                    console.warn(`Budget with id ${id} not found`)
                    return false
                }

                setStorage(prev => ({
                    ...prev,
                    budgets: prev.budgets.filter(b => b.id !== id),
                    lastUpdated: new Date().toISOString(),
                }))

                return true
            } catch (err) {
                console.error('Error deleting budget:', err)
                return false
            }
        },
        [storage.budgets, setStorage]
    )

    // Calculate spent amount for a category in the current period
    const calculateSpent = useCallback(
        (category: ExpenseCategory | 'overall', expenses: Expense[], period: 'monthly' | 'weekly' | 'daily'): number => {
            const now = new Date()
            let startDate: Date

            if (period === 'monthly') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            } else if (period === 'weekly') {
                const dayOfWeek = now.getDay()
                startDate = new Date(now)
                startDate.setDate(now.getDate() - dayOfWeek)
                startDate.setHours(0, 0, 0, 0)
            } else { // daily
                startDate = new Date(now)
                startDate.setHours(0, 0, 0, 0)
            }

            const filteredExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date)
                const isInPeriod = expenseDate >= startDate && expenseDate <= now
                const isCategory = category === 'overall' || expense.category === category
                return isInPeriod && isCategory
            })

            return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        },
        []
    )

    // Get budget status for a specific category
    const getBudgetStatus = useCallback(
        (category: ExpenseCategory | 'overall', expenses: Expense[]): BudgetStatus | null => {
            const budget = storage.budgets.find(b => b.category === category)
            if (!budget) return null

            const spent = calculateSpent(category, expenses, budget.period)
            const remaining = budget.limit - spent
            const percentage = (spent / budget.limit) * 100

            return {
                budget,
                spent,
                remaining,
                percentage,
                isExceeded: spent >= budget.limit,
                isNearLimit: percentage >= BUDGET_WARNING_THRESHOLD * 100 && spent < budget.limit,
            }
        },
        [storage.budgets, calculateSpent]
    )

    // Get all budget statuses
    const getAllBudgetStatuses = useCallback(
        (expenses: Expense[]): BudgetStatus[] => {
            return storage.budgets.map(budget => {
                const spent = calculateSpent(budget.category, expenses, budget.period)
                const remaining = budget.limit - spent
                const percentage = (spent / budget.limit) * 100

                return {
                    budget,
                    spent,
                    remaining,
                    percentage,
                    isExceeded: spent >= budget.limit,
                    isNearLimit: percentage >= BUDGET_WARNING_THRESHOLD * 100 && spent < budget.limit,
                }
            })
        },
        [storage.budgets, calculateSpent]
    )

    return {
        budgets: storage.budgets,
        addBudget,
        deleteBudget,
        getBudgetStatus,
        getAllBudgetStatuses,
        isLoaded,
        error,
    }
}
