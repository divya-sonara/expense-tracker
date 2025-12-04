'use client'

import { useState, useCallback } from 'react'
import { AddExpenseFormData, UseFormReturn } from '@/app/lib/types'
import { getTodayDate, isValidAmount } from '@/app/lib/constants'
import { AddExpenseSchema } from '@/app/lib/schemas'

/**
 * Custom hook for managing form state and validation
 */
export function useForm(
    initialValues?: Partial<AddExpenseFormData>,
    onSubmit?: (values: AddExpenseFormData) => Promise<void>
): UseFormReturn {
    const defaultValues: AddExpenseFormData = {
        amount: '',
        category: 'Other',
        description: '',
        date: getTodayDate(),
        ...initialValues,
    }

    const [values, setValues] = useState<AddExpenseFormData>(defaultValues)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handle input change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setValues(prev => {
            if (name === 'category') {
                // Ensure category is properly typed
                return {
                    ...prev,
                    category: value as any, // Will be validated on submit
                }
            }
            return {
                ...prev,
                [name]: value,
            }
        })
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }, [errors])

    // Validate and submit
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            setIsSubmitting(true)
            setErrors({})

            try {
                // Parse amount as number
                const amount = parseFloat(values.amount)
                if (isNaN(amount)) {
                    setErrors({ amount: 'Please enter a valid amount' })
                    setIsSubmitting(false)
                    return
                }

                // Validate with Zod
                const validated = AddExpenseSchema.parse({
                    amount,
                    category: values.category,
                    description: values.description || undefined,
                    date: values.date,
                })

                // Call submit callback if provided
                if (onSubmit) {
                    await onSubmit({
                        amount: validated.amount.toString(),
                        category: validated.category,
                        description: validated.description || '',
                        date: validated.date,
                    })
                }

                // Reset form on success
                reset()
            } catch (err: any) {
                if (err.errors) {
                    // Zod validation error
                    const newErrors: Record<string, string> = {}
                    err.errors.forEach((error: any) => {
                        if (error.path && error.path.length > 0) {
                            newErrors[error.path[0]] = error.message
                        }
                    })
                    setErrors(newErrors)
                } else {
                    console.error('Form submission error:', err)
                }
            } finally {
                setIsSubmitting(false)
            }
        },
        [values, onSubmit]
    )

    // Reset form
    const reset = useCallback(() => {
        setValues(defaultValues)
        setErrors({})
    }, [])

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
    }
}
