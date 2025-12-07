'use client'

import { useState } from 'react'
import { ExpenseCategory } from '@/app/lib/types'
import { EXPENSE_CATEGORIES_LIST, getCategoryConfig } from '@/app/lib/constants'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'

interface BudgetFormProps {
    onSubmit: (category: ExpenseCategory | 'overall', limit: number, period: 'monthly' | 'weekly' | 'daily') => Promise<void>
    isLoading?: boolean
}

/**
 * BudgetForm component for setting budget limits
 */
export function BudgetForm({ onSubmit, isLoading = false }: BudgetFormProps) {
    const [category, setCategory] = useState<ExpenseCategory | 'overall'>('overall')
    const [limit, setLimit] = useState('')
    const [period, setPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const limitNum = parseFloat(limit)
        if (isNaN(limitNum) || limitNum <= 0) {
            setError('Please enter a valid amount greater than 0')
            return
        }

        try {
            await onSubmit(category, limitNum, period)
            setLimit('')
            setError('')
        } catch (err) {
            setError('Failed to set budget. Please try again.')
        }
    }

    const categoryOptions = [
        { value: 'overall', label: '💰 Overall Budget' },
        ...EXPENSE_CATEGORIES_LIST.map(cat => {
            const config = getCategoryConfig(cat)
            return { value: cat, label: `${config.icon} ${cat}` }
        })
    ]

    const periodOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ]

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Set Budget</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Select */}
                <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory | 'overall')}
                    options={categoryOptions}
                    required
                    aria-label="Select budget category"
                />

                {/* Period Select */}
                <Select
                    label="Period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'monthly' | 'weekly' | 'daily')}
                    options={periodOptions}
                    required
                    aria-label="Select budget period"
                />

                {/* Limit Input */}
                <Input
                    label="Budget Limit"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Enter amount"
                    required
                    error={error}
                    aria-label="Enter budget limit amount"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Setting Budget...' : 'Set Budget'}
                </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Set budget limits to track your spending and get alerts when approaching or exceeding limits.
            </p>
        </div>
    )
}
