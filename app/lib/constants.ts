'use client'

import { ExpenseCategory, CategoryConfig } from './types'

// Storage configuration
export const STORAGE_KEY = 'expenses-v1'
export const STORAGE_VERSION = 1
export const TOAST_DURATION_MS = 3000

// Form constraints
export const MAX_DESCRIPTION_LENGTH = 200
export const MAX_AMOUNT = 999999.99
export const MIN_AMOUNT = 0.01

// Expense categories with icons and colors
export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-700' },
  { name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-700' },
  { name: 'Entertainment', icon: '🎬', color: 'bg-purple-100 text-purple-700' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-700' },
  { name: 'Bills', icon: '📋', color: 'bg-red-100 text-red-700' },
  { name: 'Health', icon: '⚕️', color: 'bg-green-100 text-green-700' },
  { name: 'Other', icon: '📌', color: 'bg-gray-100 text-gray-700' },
]

export const EXPENSE_CATEGORIES_LIST: ExpenseCategory[] = EXPENSE_CATEGORIES.map(c => c.name)

// Get category config by name
export function getCategoryConfig(category: ExpenseCategory): CategoryConfig {
  return EXPENSE_CATEGORIES.find(c => c.name === category) || EXPENSE_CATEGORIES[6] // Default to 'Other'
}

// Currency formatter
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Date formatter
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

// Get today's date in YYYY-MM-DD format for date input
export function getTodayDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Truncate description
export function truncateDescription(description: string, maxLength: number = 50): string {
  if (!description) return ''
  return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description
}

// Validate amount (positive, max 2 decimals)
export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount)
  if (isNaN(num) || num <= 0 || num > MAX_AMOUNT) return false
  const decimals = amount.split('.')[1]
  return !decimals || decimals.length <= 2
}
