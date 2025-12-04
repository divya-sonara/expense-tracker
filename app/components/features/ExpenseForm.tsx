'use client'

import React, { useState } from 'react'
import { Expense } from '@/app/lib/types'
import { useForm } from '@/app/hooks/useForm'
import { useToast } from '@/app/hooks/useToast'
import { EXPENSE_CATEGORIES_LIST, getTodayDate } from '@/app/lib/constants'
import { Button, Input, Select, Toast } from '@/app/components/ui'
import { addExpense } from '@/app/actions/expenses'

export interface ExpenseFormProps {
  onSuccess?: (expense: Expense) => void
  isLoading?: boolean
}

/**
 * Form component for adding a new expense
 * Handles validation, submission, and user feedback
 */
export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, isLoading = false }) => {
  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } = useForm(
    {
      amount: '',
      category: 'Other',
      description: '',
      date: getTodayDate(),
    },
    undefined // Will handle submission in form onSubmit
  )

  const { toasts, addToast, removeToast } = useToast()
  const [formError, setFormError] = useState<string>()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(undefined)

    // Validate amount
    if (!values.amount) {
      setFormError('Amount is required')
      addToast('Please enter an amount', 'error')
      return
    }

    const amount = parseFloat(values.amount)
    if (isNaN(amount) || amount <= 0) {
      setFormError('Amount must be greater than 0')
      addToast('Amount must be greater than 0', 'error')
      return
    }

    try {
      // Call server action to add expense
      const result = await addExpense({
        amount,
        category: values.category as any,
        date: values.date,
        description: values.description || undefined,
      })

      if (result.success && result.expense) {
        addToast('Expense added successfully', 'success')
        reset()
        onSuccess?.(result.expense)
      } else {
        const errorMsg = result.error || 'Failed to add expense'
        setFormError(errorMsg)
        addToast(errorMsg, 'error')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred'
      setFormError(errorMsg)
      addToast(errorMsg, 'error')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Expense</h2>

        {/* Form-level error */}
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
            <p className="text-red-800 font-medium">{formError}</p>
          </div>
        )}

        {/* Amount */}
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={values.amount}
          onChange={handleChange}
          error={errors.amount}
          required
          disabled={isSubmitting || isLoading}
          aria-label="Expense amount in dollars"
        />

        {/* Category */}
        <Select
          label="Category"
          name="category"
          value={values.category}
          onChange={handleChange}
          options={EXPENSE_CATEGORIES_LIST.map(cat => ({ value: cat, label: cat }))}
          error={errors.category}
          required
          disabled={isSubmitting || isLoading}
        />

        {/* Description */}
        <Input
          label="Description (optional)"
          name="description"
          type="text"
          placeholder="What was this expense for?"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
          disabled={isSubmitting || isLoading}
          maxLength={200}
          aria-label="Expense description (optional, max 200 characters)"
        />

        {/* Date */}
        <Input
          label="Date"
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange}
          error={errors.date}
          required
          disabled={isSubmitting || isLoading}
        />

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting || isLoading ? 'Adding...' : 'Add Expense'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={reset}
            disabled={isSubmitting || isLoading}
          >
            Clear
          </Button>
        </div>

        {/* Character count for description */}
        {values.description && (
          <p className="text-sm text-gray-600">
            {values.description.length}/200 characters
          </p>
        )}
      </form>

      {/* Helper text */}
      <p className="text-sm text-gray-600 mt-4">
        All fields are required except description. The expense will be saved to your local storage.
      </p>
    </div>
  )
}
