// Expense Management System - TypeScript Contracts
// Define all interfaces, types, and server action signatures

/**
 * DOMAIN ENTITIES
 */

// Expense Category enumeration
export type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Bills' | 'Health' | 'Other';

// Core Expense entity
export interface Expense {
    id: string;                    // UUID v4
    amount: number;                // Positive, max 2 decimals
    category: ExpenseCategory;     // Required
    description?: string;          // Optional, max 200 chars
    date: Date;                    // Required, defaults to today
    createdAt: Date;               // Auto-set on creation
    updatedAt?: Date;              // Optional, for future edit feature
}

// Storage format in localStorage
export interface ExpenseStorage {
    version: number;               // Schema version (1)
    expenses: Expense[];           // Array of expenses
    lastUpdated: string;           // ISO timestamp
}

// Category configuration (for UI display)
export interface CategoryConfig {
    name: ExpenseCategory;
    icon: string;                  // Emoji or icon identifier
    color: string;                 // Tailwind CSS color class
    description: string;           // User-friendly label
}

/**
 * FORM & INPUT
 */

// Add expense form data (before validation/transformation)
export interface AddExpenseFormData {
    amount: string;                // User input (will be parsed)
    category: ExpenseCategory;     // From select
    description?: string;          // Optional text input
    date?: string;                 // ISO date string or empty for today
}

// Add expense form submission payload
export interface AddExpensePayload {
    amount: number;                // Validated & parsed
    category: ExpenseCategory;
    description?: string;
    date?: Date;
}

// Add expense result
export interface AddExpenseResult {
    success: boolean;
    expense?: Expense;
    error?: string;
    errorField?: keyof AddExpenseFormData;  // Which field had error
}

// Delete expense request
export interface DeleteExpenseRequest {
    id: string;                    // Expense ID to delete
}

// Delete expense result
export interface DeleteExpenseResult {
    success: boolean;
    deletedId?: string;
    error?: string;
}

/**
 * SERVER ACTIONS
 */

// Server action: Add expense
export interface AddExpenseAction {
    (data: AddExpensePayload): Promise<AddExpenseResult>;
}

// Server action: Delete expense
export interface DeleteExpenseAction {
    (request: DeleteExpenseRequest): Promise<DeleteExpenseResult>;
}

// Server action: Validate amount
export interface ValidateAmountAction {
    (amount: string): Promise<{ valid: boolean; error?: string }>;
}

/**
 * HOOKS & STATE MANAGEMENT
 */

// useExpenses hook state and methods
export interface UseExpensesReturn {
    // State
    expenses: Expense[];           // All expenses
    loading: boolean;              // Initial load state
    error?: string;                // Error message if any

    // Methods
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<Expense>;
    deleteExpense: (id: string) => Promise<void>;
    getExpenses: () => Expense[];
    getExpenseById: (id: string) => Expense | undefined;
    filterByCategory: (category: ExpenseCategory) => Expense[];
    getSorted: (by: 'date' | 'amount') => Expense[];
    clear: () => Promise<void>;    // Clear all (for testing)
}

// useLocalStorage hook
export interface UseLocalStorageReturn {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
}

// useToast hook for notifications
export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;             // ms (default 3000)
}

export interface UseToastReturn {
    toasts: ToastMessage[];
    addToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

// useForm hook for form state
export interface UseFormReturn<T> {
    formData: T;
    errors: Partial<Record<keyof T, string>>;
    isSubmitting: boolean;
    updateField: <K extends keyof T>(field: K, value: T[K]) => void;
    resetForm: () => void;
    setErrors: (errors: Partial<Record<keyof T, string>>) => void;
}

// useFilter hook for category filtering
export interface UseFilterReturn {
    selectedCategory: ExpenseCategory | null;
    setCategory: (category: ExpenseCategory | null) => void;
    clearFilter: () => void;
}

/**
 * COMPONENT PROPS
 */

// ExpenseForm component props
export interface ExpenseFormProps {
    onSuccess?: (expense: Expense) => void;
    onError?: (error: string) => void;
    initialData?: Partial<AddExpenseFormData>;
    disabled?: boolean;
}

// ExpenseList component props
export interface ExpenseListProps {
    expenses: Expense[];
    onDelete?: (expense: Expense) => Promise<void>;
    isLoading?: boolean;
    onFilter?: (category: ExpenseCategory | null) => void;
    selectedCategory?: ExpenseCategory | null;
}

// CategoryFilter component props
export interface CategoryFilterProps {
    selectedCategory: ExpenseCategory | null;
    onSelect: (category: ExpenseCategory | null) => void;
    disabled?: boolean;
    showCounts?: boolean;          // Show count of expenses per category
    counts?: Record<ExpenseCategory, number>;
}

// DeleteConfirmDialog component props
export interface DeleteConfirmDialogProps {
    isOpen: boolean;
    expense: Expense;
    onConfirm: (expense: Expense) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

// Toast component props
export interface ToastProps {
    message: ToastMessage;
    onDismiss?: (id: string) => void;
}

// Button component props
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

// Input component props
export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

// Select component props
export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Array<{ value: string; label: string }>;
    error?: string;
}

/**
 * VALIDATION SCHEMAS (Zod)
 */

// Validation result
export interface ValidationResult<T = unknown> {
    valid: boolean;
    errors?: Record<string, string[]>;
    data?: T;
}

/**
 * API RESPONSE TYPES (Future, for backend integration)
 */

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
        field?: string;
    };
    timestamp: string;
}

/**
 * UTILITY TYPES
 */

// Readonly version of Expense (immutable)
export type ReadonlyExpense = Readonly<Expense>;

// Expense without ID (for creation)
export type ExpenseInput = Omit<Expense, 'id' | 'createdAt'>;

// Partial expense for updates (future)
export type ExpenseUpdate = Partial<Omit<Expense, 'id' | 'createdAt'>>;

// Expense list filter options (future)
export interface ExpenseFilterOptions {
    category?: ExpenseCategory;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    searchText?: string;           // Future: search in description
}

/**
 * ERROR TYPES
 */

export class ValidationError extends Error {
    constructor(
        public field: string,
        public message: string
    ) {
        super(`Validation error on ${field}: ${message}`);
    }
}

export class StorageError extends Error {
    constructor(message: string) {
        super(`Storage error: ${message}`);
    }
}

/**
 * CONSTANTS
 */

export const EXPENSE_CATEGORIES_LIST: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Health',
    'Other'
];

export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_AMOUNT = 9999999.99;
export const MIN_AMOUNT = 0.01;
export const STORAGE_KEY = 'expenses-v1';
export const TOAST_DURATION_MS = 3000;
export const FORM_SUBMIT_TIMEOUT_MS = 5000;
