'use client'

import React from 'react'
import { ExpenseCategory } from '@/app/lib/types'
import { EXPENSE_CATEGORIES } from '@/app/lib/constants'

interface CategoryFilterProps {
    selected: ExpenseCategory | null
    onSelect: (category: ExpenseCategory | null) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, category: ExpenseCategory | null) => {
        // Handle arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            const buttons = Array.from(e.currentTarget.parentElement?.querySelectorAll('button') || [])
            const currentIndex = buttons.indexOf(e.currentTarget)

            if (currentIndex === -1) return

            const nextIndex = e.key === 'ArrowRight'
                ? (currentIndex + 1) % buttons.length
                : (currentIndex - 1 + buttons.length) % buttons.length

                ; (buttons[nextIndex] as HTMLButtonElement).focus()
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(category)
        }
    }

    return (
        <div className="space-y-4">
            {/* Filter heading */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Filter by Category
                </h2>
                <p className="text-sm text-gray-600">
                    Select a category to filter your expenses
                </p>
            </div>

            {/* Button group */}
            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter expenses by category"
            >
                {/* All button */}
                <button
                    type="button"
                    onClick={() => onSelect(null)}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                    aria-pressed={selected === null}
                    className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            min-w-[44px] min-h-[44px]
            ${selected === null
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
          `}
                >
                    <span className="flex items-center gap-2">
                        <span aria-hidden="true">📊</span>
                        <span>All</span>
                    </span>
                </button>

                {/* Category buttons */}
                {EXPENSE_CATEGORIES.map((categoryConfig) => {
                    const isSelected = selected === categoryConfig.name

                    return (
                        <button
                            key={categoryConfig.name}
                            type="button"
                            onClick={() => onSelect(categoryConfig.name)}
                            onKeyDown={(e) => handleKeyDown(e, categoryConfig.name)}
                            aria-pressed={isSelected}
                            className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                min-w-[44px] min-h-[44px]
                ${isSelected
                                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
              `}
                        >
                            <span className="flex items-center gap-2">
                                <span aria-hidden="true">{categoryConfig.icon}</span>
                                <span>{categoryConfig.name}</span>
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Instructions for screen readers */}
            <p className="sr-only">
                Use Tab or arrow keys to navigate between category filters.
                Press Enter or Space to select a category.
                {selected ? ` Currently filtering by ${selected}.` : ' Currently showing all expenses.'}
            </p>
        </div>
    )
}
