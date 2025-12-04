'use server'

import { v4 as uuidv4 } from 'uuid'
import { Expense, AddExpensePayload, AddExpenseResult } from '@/app/lib/types'
import { AddExpenseSchema } from '@/app/lib/schemas'
import { STORAGE_KEY } from '@/app/lib/constants'

/**
 * Server action to add a new expense
 * Validates input and persists to storage
 * 
 * Note: In a real application, this would:
 * 1. Validate user authentication
 * 2. Persist to a database
 * 3. Return properly typed response
 * 
 * For this MVP, we're using client-side localStorage
 * This function demonstrates proper server action pattern
 */
export async function addExpense(payload: AddExpensePayload): Promise<AddExpenseResult> {
  try {
    // Validate input with Zod schema
    const validatedData = AddExpenseSchema.parse(payload)

    // Create expense object with generated ID
    const expense: Expense = {
      id: uuidv4(),
      amount: validatedData.amount,
      category: validatedData.category,
      description: validatedData.description,
      date: validatedData.date,
      createdAt: new Date().toISOString(),
    }

    // In a real app, persist to database here
    // For now, return the created expense
    // The client will handle localStorage persistence via useExpenses hook

    return {
      success: true,
      expense,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add expense'
    console.error('Error adding expense:', errorMessage)

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Server action to delete an expense
 * In a real application, this would verify ownership and database permissions
 */
export async function deleteExpense(expenseId: string): Promise<AddExpenseResult> {
  try {
    if (!expenseId || typeof expenseId !== 'string') {
      return {
        success: false,
        error: 'Invalid expense ID',
      }
    }

    // In a real app, delete from database here
    // The client will handle localStorage cleanup via useExpenses hook

    return {
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete expense'
    console.error('Error deleting expense:', errorMessage)

    return {
      success: false,
      error: errorMessage,
    }
  }
}
