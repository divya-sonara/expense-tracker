'use client'

import { useState, useMemo } from 'react'
import { ExpenseForm, ExpenseList, CategoryFilter } from '@/app/components/features'
import { useExpenses } from '@/app/hooks/useExpenses'
import { useToast } from '@/app/hooks/useToast'
import { Expense, ExpenseCategory } from '@/app/lib/types'
import { ToastContainer } from '@/app/components/ui/ToastContainer'

export default function Home() {
  const { expenses, addExpense, deleteExpense, filterByCategory, isLoaded, error } = useExpenses()
  const { toasts, addToast, removeToast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null)

  // Get filtered expenses
  const filteredExpenses = useMemo(() => {
    return filterByCategory(selectedCategory)
  }, [selectedCategory, filterByCategory])

  const handleExpenseAdded = (expense: Expense) => {
    // The server action already created the expense object with ID
    // Now we need to add it to our local state
    addExpense({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description,
    })
  }

  const handleDelete = async (id: string) => {
    deleteExpense(id)
    addToast('Expense deleted successfully', 'success')
  }

  const handleCategorySelect = (category: ExpenseCategory | null) => {
    setSelectedCategory(category)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Expense Tracker</h1>
          <p className="text-lg text-gray-600">
            Track your daily expenses and monitor your spending habits
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Expense Form - Left column on desktop */}
          <div className="lg:col-span-1">
            <ExpenseForm onSuccess={handleExpenseAdded} />
          </div>

          {/* Filter and Expense List - Right columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <CategoryFilter
                selected={selectedCategory}
                onSelect={handleCategorySelect}
              />

              {/* Filter result feedback */}
              <div
                className="mt-4 text-sm text-gray-600"
                aria-live="polite"
                aria-atomic="true"
              >
                {selectedCategory ? (
                  <p>
                    Showing <strong>{filteredExpenses.length}</strong> of{' '}
                    <strong>{expenses.length}</strong> expenses in category{' '}
                    <strong>{selectedCategory}</strong>
                  </p>
                ) : (
                  <p>
                    Showing <strong>all {expenses.length}</strong> expenses
                  </p>
                )}
              </div>
            </div>

            {/* Expense List */}
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={handleDelete}
              isLoading={!isLoaded}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>Phase 5: Delete with Confirmation - Data saved to browser local storage</p>
        </footer>

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </main>
  )
}
