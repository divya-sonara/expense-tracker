import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteConfirmDialog from '@/app/components/ui/DeleteConfirmDialog'
import { Expense } from '@/app/lib/types'

describe('DeleteConfirmDialog', () => {
    const mockExpense: Expense = {
        id: '123',
        amount: 42.50,
        category: 'Food',
        description: 'Lunch at restaurant',
        date: '2024-01-15',
        createdAt: '2024-01-15T12:00:00Z',
    }

    const mockOnConfirm = jest.fn()
    const mockOnCancel = jest.fn()

    beforeEach(() => {
        mockOnConfirm.mockClear()
        mockOnCancel.mockClear()
    })

    describe('Rendering', () => {
        it('does not render when isOpen is false', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={false}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })

        it('renders dialog when isOpen is true', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.getByRole('dialog')).toBeInTheDocument()
            expect(screen.getByText('Delete Expense?')).toBeInTheDocument()
        })

        it('displays expense details', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.getByText('$42.50')).toBeInTheDocument()
            expect(screen.getByText('Food')).toBeInTheDocument()
            expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
            expect(screen.getByText('Lunch at restaurant')).toBeInTheDocument()
        })

        it('displays warning message', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(
                screen.getByText(/are you sure you want to delete this expense/i)
            ).toBeInTheDocument()
            expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
        })

        it('displays Cancel and Delete buttons', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /delete expense/i })).toBeInTheDocument()
        })

        it('does not display description when expense has no description', () => {
            const expenseWithoutDescription = { ...mockExpense, description: undefined }

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={expenseWithoutDescription}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.queryByText('Description')).not.toBeInTheDocument()
        })
    })

    describe('Button Interactions', () => {
        it('calls onConfirm when Delete button is clicked', async () => {
            const user = userEvent.setup()

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const deleteButton = screen.getByRole('button', { name: /delete expense/i })
            await user.click(deleteButton)

            expect(mockOnConfirm).toHaveBeenCalledTimes(1)
            expect(mockOnCancel).not.toHaveBeenCalled()
        })

        it('calls onCancel when Cancel button is clicked', async () => {
            const user = userEvent.setup()

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const cancelButton = screen.getByRole('button', { name: /cancel/i })
            await user.click(cancelButton)

            expect(mockOnCancel).toHaveBeenCalledTimes(1)
            expect(mockOnConfirm).not.toHaveBeenCalled()
        })
    })

    describe('Keyboard Interaction', () => {
        it('calls onCancel when Escape key is pressed', async () => {
            const user = userEvent.setup()

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            await user.keyboard('{Escape}')

            await waitFor(() => {
                expect(mockOnCancel).toHaveBeenCalledTimes(1)
            })
        })

        it('has focus on first button when dialog opens', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const cancelButton = screen.getByRole('button', { name: /cancel/i })
            expect(cancelButton).toHaveFocus()
        })

        it('traps focus within dialog', async () => {
            const user = userEvent.setup()

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const cancelButton = screen.getByRole('button', { name: /cancel/i })
            const deleteButton = screen.getByRole('button', { name: /delete expense/i })

            // First button should have focus initially
            expect(cancelButton).toHaveFocus()

            // Tab to second button
            await user.tab()
            expect(deleteButton).toHaveFocus()

            // Tab should wrap back to first button
            await user.tab()
            expect(cancelButton).toHaveFocus()
        })

        it('handles Shift+Tab for reverse focus trap', async () => {
            const user = userEvent.setup()

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const cancelButton = screen.getByRole('button', { name: /cancel/i })
            const deleteButton = screen.getByRole('button', { name: /delete expense/i })

            // Shift+Tab from first button should go to last button
            await user.tab({ shift: true })
            expect(deleteButton).toHaveFocus()
        })
    })

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const dialog = screen.getByRole('dialog')
            expect(dialog).toHaveAttribute('aria-modal', 'true')
            expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
        })

        it('has delete button styled as destructive action', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const deleteButton = screen.getByRole('button', { name: /delete expense/i })
            expect(deleteButton).toHaveClass('bg-red-600')
        })

        it('has cancel button with clear visual distinction', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            const cancelButton = screen.getByRole('button', { name: /cancel/i })
            expect(cancelButton).toHaveClass('bg-white')
            expect(cancelButton).toHaveClass('border-gray-300')
        })
    })

    describe('Edge Cases', () => {
        it('handles null expense gracefully', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={null}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })

        it('displays category icon', () => {
            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={mockExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            // Food category should have 🍔 icon
            const categoryBadge = screen.getByText('Food').parentElement
            expect(categoryBadge).toHaveTextContent('🍔')
        })

        it('handles expenses with very long descriptions', () => {
            const longDescExpense = {
                ...mockExpense,
                description: 'A'.repeat(300),
            }

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={longDescExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.getByText('A'.repeat(300))).toBeInTheDocument()
        })

        it('handles different expense categories', () => {
            const transportExpense = {
                ...mockExpense,
                category: 'Transport' as const,
            }

            render(
                <DeleteConfirmDialog
                    isOpen={true}
                    expense={transportExpense}
                    onConfirm={mockOnConfirm}
                    onCancel={mockOnCancel}
                />
            )

            expect(screen.getByText('Transport')).toBeInTheDocument()
            const categoryBadge = screen.getByText('Transport').parentElement
            expect(categoryBadge).toHaveTextContent('🚗')
        })
    })
})
