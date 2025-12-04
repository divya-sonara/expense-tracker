'use client'

import { z } from 'zod'
import { ExpenseCategory } from './types'
import { MAX_DESCRIPTION_LENGTH, MAX_AMOUNT, MIN_AMOUNT } from './constants'

// Schema for adding an expense
export const AddExpenseSchema = z.object({
  amount: z
    .number()
    .min(MIN_AMOUNT, `Amount must be at least $${MIN_AMOUNT}`)
    .max(MAX_AMOUNT, `Amount cannot exceed $${MAX_AMOUNT}`)
    .refine(
      amount => {
        const decimals = amount.toString().split('.')[1]
        return !decimals || decimals.length <= 2
      },
      { message: 'Amount must have at most 2 decimal places' }
    ),
  category: z.string().refine(
    (val): val is ExpenseCategory => {
      return ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'].includes(val)
    },
    { message: 'Invalid category' }
  ) as z.ZodType<ExpenseCategory>,
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`)
    .optional()
    .or(z.literal('')),
  date: z
    .string()
    .refine(
      date => {
        const dateObj = new Date(date)
        return !isNaN(dateObj.getTime())
      },
      { message: 'Invalid date format' }
    ),
})

export type AddExpenseSchemaType = z.infer<typeof AddExpenseSchema>

// Schema for deleting an expense
export const DeleteExpenseSchema = z.object({
  id: z.string().uuid('Invalid expense ID'),
})

export type DeleteExpenseSchemaType = z.infer<typeof DeleteExpenseSchema>

// Schema for filtering
export const FilterSchema = z.object({
  category: z
    .string()
    .optional()
    .or(z.literal(null))
    .refine(
      (val): val is ExpenseCategory | null => {
        if (val === null || val === undefined) return true
        return ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'].includes(val)
      },
      { message: 'Invalid category' }
    ) as z.ZodType<ExpenseCategory | null>,
})

export type FilterSchemaType = z.infer<typeof FilterSchema>
