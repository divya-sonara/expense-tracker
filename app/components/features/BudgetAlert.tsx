'use client'

import { BudgetStatus } from '@/app/lib/types'
import { formatCurrency } from '@/app/lib/constants'
import { getCategoryConfig } from '@/app/lib/constants'

interface BudgetAlertProps {
    statuses: BudgetStatus[]
    onDismiss?: (budgetId: string) => void
}

/**
 * BudgetAlert component displays budget status warnings
 * Shows alerts when budgets are near limit (80%+) or exceeded (100%+)
 */
export function BudgetAlert({ statuses }: BudgetAlertProps) {
    // Only show alerts for budgets that are near limit or exceeded
    const alertStatuses = statuses.filter(s => s.isNearLimit || s.isExceeded)

    if (alertStatuses.length === 0) {
        return null
    }

    return (
        <div 
            className="space-y-3" 
            role="alert" 
            aria-live="polite"
        >
            {alertStatuses.map(status => {
                const { budget, spent, remaining, percentage, isExceeded } = status
                const categoryConfig = budget.category !== 'overall' 
                    ? getCategoryConfig(budget.category)
                    : { name: 'Overall', icon: '💰', color: 'bg-gray-100 text-gray-700' }

                const alertColor = isExceeded 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-yellow-50 border-yellow-200'

                const textColor = isExceeded
                    ? 'text-red-800'
                    : 'text-yellow-800'

                const iconColor = isExceeded
                    ? 'text-red-600'
                    : 'text-yellow-600'

                return (
                    <div 
                        key={budget.id}
                        className={`${alertColor} border rounded-lg p-4`}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`flex-shrink-0 ${iconColor}`} aria-hidden="true">
                                {isExceeded ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className={`text-sm font-medium ${textColor}`}>
                                    {isExceeded ? 'Budget Exceeded' : 'Budget Warning'}
                                </h3>
                                <div className={`mt-1 text-sm ${textColor}`}>
                                    <p>
                                        {categoryConfig.icon} <strong>{budget.category === 'overall' ? 'Overall' : budget.category}</strong> budget for {budget.period}:
                                    </p>
                                    <p className="mt-1">
                                        Spent <strong>{formatCurrency(spent)}</strong> of <strong>{formatCurrency(budget.limit)}</strong>
                                        {' '}({percentage.toFixed(0)}%)
                                    </p>
                                    {!isExceeded && remaining > 0 && (
                                        <p className="mt-1">
                                            <strong>{formatCurrency(remaining)}</strong> remaining
                                        </p>
                                    )}
                                    {isExceeded && (
                                        <p className="mt-1">
                                            Over budget by <strong>{formatCurrency(Math.abs(remaining))}</strong>
                                        </p>
                                    )}
                                </div>

                                {/* Progress bar */}
                                <div className="mt-3">
                                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all ${isExceeded ? 'bg-red-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${Math.max(0, Math.min(percentage, 100))}%` }}
                                            role="progressbar"
                                            aria-valuenow={Math.max(0, Math.min(percentage, 100))}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`Budget usage: ${percentage.toFixed(0)}%`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
