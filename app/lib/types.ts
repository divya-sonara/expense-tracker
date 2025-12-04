'use client'

// Expense category type
export type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Bills' | 'Health' | 'Other'

// Main expense entity
export interface Expense {
    id: string
    amount: number
    category: ExpenseCategory
    description?: string
    date: string // ISO date format: YYYY-MM-DD
    createdAt: string // ISO timestamp
}

// Storage format
export interface ExpenseStorage {
    version: number
    expenses: Expense[]
    lastUpdated: string // ISO timestamp
}

// Category configuration
export interface CategoryConfig {
    name: ExpenseCategory
    icon: string
    color: string
}

// Form data
export interface AddExpenseFormData {
    amount: string
    category: ExpenseCategory
    description: string
    date: string
}

// Server action types
export interface AddExpensePayload {
    amount: number
    category: ExpenseCategory
    description?: string
    date: string
}

export interface AddExpenseResult {
    success: boolean
    expense?: Expense
    error?: string
}

export interface DeleteExpenseRequest {
    id: string
}

export interface DeleteExpenseResult {
    success: boolean
    error?: string
}

// Hook return types
export interface UseLocalStorageReturn<T> {
    value: T
    setValue: (value: T | ((prev: T) => T)) => void
    isLoaded: boolean
    error?: string
}

export interface UseExpensesReturn {
    expenses: Expense[]
    addExpense: (data: AddExpensePayload) => Promise<Expense | null>
    deleteExpense: (id: string) => Promise<boolean>
    filterByCategory: (category: ExpenseCategory | null) => Expense[]
    error?: string
    isLoaded: boolean
}

export interface UseToastReturn {
    toasts: ToastMessage[]
    addToast: (message: string, type: ToastType) => string
    removeToast: (id: string) => void
}

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
    id: string
    message: string
    type: ToastType
}

export interface UseFormReturn {
    values: AddExpenseFormData
    errors: Record<string, string>
    isSubmitting: boolean
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleSubmit: (e: React.FormEvent) => Promise<void>
    reset: () => void
}

// Component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    required?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    options: Array<{ value: string; label: string }>
    error?: string
    required?: boolean
}

export interface DialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    actions?: React.ReactNode
    onEscapeClose?: boolean
}

export interface TableProps {
    data: any[]
    columns: TableColumn[]
    onRowClick?: (row: any) => void
}

export interface TableColumn {
    key: string
    header: string
    render?: (value: any, row: any) => React.ReactNode
    sortable?: boolean
}

export interface ToastProps {
    message: string
    type: ToastType
    onClose: () => void
    duration?: number
}

export interface ExpenseFormProps {
    onSubmit: (expense: Expense) => Promise<void>
    isLoading?: boolean
}

export interface ExpenseListProps {
    expenses: Expense[]
    onDelete: (id: string) => Promise<void>
    onFilter: (category: ExpenseCategory | null) => void
    isLoading?: boolean
}

export interface CategoryFilterProps {
    categories: ExpenseCategory[]
    selected: ExpenseCategory | null
    onSelect: (category: ExpenseCategory | null) => void
}

export interface DeleteConfirmDialogProps {
    isOpen: boolean
    expense: Expense | null
    onConfirm: () => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}
