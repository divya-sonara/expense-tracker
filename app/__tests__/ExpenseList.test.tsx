import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpenseList } from '@/app/components/features/ExpenseList'
import { Expense } from '@/app/lib/types'

const mockExpenses: Expense[] = [
    {
        id: '1',
        amount: 50.00,
        category: 'Food',
        description: 'Lunch at cafe',
        date: '2024-01-15',
        createdAt: '2024-01-15T12:00:00Z',
    },
    {
        id: '2',
        amount: 25.50,
        category: 'Transport',
        description: 'Taxi to airport',
        date: '2024-01-14',
        createdAt: '2024-01-14T08:00:00Z',
    },
    {
        id: '3',
        amount: 100.00,
        category: 'Entertainment',
        description: 'Concert tickets',
        date: '2024-01-16',
        createdAt: '2024-01-16T19:00:00Z',
    },
]

describe('ExpenseList', () => {
    const mockOnDelete = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders empty state when no expenses', () => {
        render(<ExpenseList expenses={[]} onDelete={mockOnDelete} />)

        expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument()
        expect(screen.getByText(/add your first expense/i)).toBeInTheDocument()
    })

    it('renders loading state', () => {
        render(<ExpenseList expenses={[]} onDelete={mockOnDelete} isLoading={true} />)

        expect(screen.queryByText(/no expenses yet/i)).not.toBeInTheDocument()
        // Loading indicator should be present (animate-pulse)
        expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('renders expense list with all columns', () => {
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Check headers
        expect(screen.getByRole('button', { name: /sort by date/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sort by amount/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sort by category/i })).toBeInTheDocument()
        expect(screen.getByText(/description/i)).toBeInTheDocument()
        expect(screen.getByText(/actions/i)).toBeInTheDocument()

        // Check expense data
        expect(screen.getByText('$50.00')).toBeInTheDocument()
        expect(screen.getByText('$25.50')).toBeInTheDocument()
        expect(screen.getByText('$100.00')).toBeInTheDocument()

        expect(screen.getByText('Food')).toBeInTheDocument()
        expect(screen.getByText('Transport')).toBeInTheDocument()
        expect(screen.getByText('Entertainment')).toBeInTheDocument()
    })

    it('sorts by date descending by default (newest first)', () => {
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        const rows = screen.getAllByRole('row')
        // Skip header row (index 0)
        // First expense should be Jan 16 (newest)
        expect(rows[1]).toHaveTextContent('Jan 16')
        expect(rows[1]).toHaveTextContent('$100.00')
    })

    it('toggles sort direction when clicking same column header', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Get all rows before sort
        let rows = screen.getAllByRole('row')
        // First data row should be Jan 16 (newest, descending)
        expect(rows[1]).toHaveTextContent('Jan 16')

        // Click date header to toggle to ascending
        const dateButton = screen.getByRole('button', { name: /sort by date/i })
        await user.click(dateButton)

        // Re-query rows after sort
        rows = screen.getAllByRole('row')
        // First data row should now be Jan 14 (oldest, ascending)
        expect(rows[1]).toHaveTextContent('Jan 14')
        expect(rows[1]).toHaveTextContent('$25.50')
    })

    it('changes sort field when clicking different column header', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        const amountButton = screen.getByRole('button', { name: /sort by amount/i })

        // Click to sort by amount (descending by default)
        await user.click(amountButton)

        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // First expense should be $100.00 (highest amount)
            expect(rows[1]).toHaveTextContent('$100.00')
        })
    })

    it('displays sort indicator on active column', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Check for descending arrow indicator (↓)
        const dateButton = screen.getByRole('button', { name: /sort by date/i })
        expect(dateButton.textContent).toContain('↓')

        // Click to toggle to ascending
        await user.click(dateButton)

        // Check for ascending arrow indicator (↑)
        expect(dateButton.textContent).toContain('↑')
    })

    it('opens DeleteConfirmDialog when delete button clicked', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        const tableDeleteButtons = screen.getAllByRole('button', { name: /delete expense:/i })
        await user.click(tableDeleteButtons[0])

        // Dialog should open
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
        expect(screen.getByText('Delete Expense?')).toBeInTheDocument()

        // Dialog should be visible with warning message
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveTextContent('Are you sure you want to delete this expense')
    })

    it('calls onDelete when confirm button clicked in dialog', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Click delete button in table to open dialog
        const tableDeleteButtons = screen.getAllByRole('button', { name: /delete expense:/i })
        await user.click(tableDeleteButtons[0])

        // Wait for dialog to appear
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        // Click confirm button in dialog (exact match for "Delete Expense")
        const confirmButton = screen.getByRole('button', { name: 'Delete Expense' })
        await user.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalledWith('3') // ID of first expense (sorted by date desc)
    })

    it('does not call onDelete when user cancels in dialog', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Click delete button in table to open dialog
        const tableDeleteButtons = screen.getAllByRole('button', { name: /delete expense:/i })
        await user.click(tableDeleteButtons[0])

        // Wait for dialog to appear
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        // Click cancel button in dialog
        const cancelButton = screen.getByRole('button', { name: /cancel/i })
        await user.click(cancelButton)

        expect(mockOnDelete).not.toHaveBeenCalled()
    })

    it('closes dialog when Escape key pressed', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Click delete button in table to open dialog
        const tableDeleteButtons = screen.getAllByRole('button', { name: /delete expense:/i })
        await user.click(tableDeleteButtons[0])

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        // Press Escape
        await user.keyboard('{Escape}')

        // Dialog should close
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
        expect(mockOnDelete).not.toHaveBeenCalled()
    })

    it('displays expense count and total', () => {
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // The text is in aria-live region
        const statusContainer = screen.getByText(/showing/i)
        expect(statusContainer).toBeInTheDocument()

        // Check for count and total in the parent container
        const parentText = statusContainer.textContent || ''
        expect(parentText).toContain('3')
        expect(parentText).toContain('Total')
        expect(parentText).toContain('$175.50')
    })

    it('truncates long descriptions', () => {
        const longDescExpense: Expense = {
            id: '4',
            amount: 10.00,
            category: 'Other',
            description: 'This is a very long description that should be truncated at 50 characters to fit in the table cell',
            date: '2024-01-01',
            createdAt: '2024-01-01T00:00:00Z',
        }

        render(<ExpenseList expenses={[longDescExpense]} onDelete={mockOnDelete} />)

        // Should show truncated version with ellipsis
        const descriptionCell = screen.getByText(/this is a very long description/i)
        expect(descriptionCell.textContent?.length).toBeLessThanOrEqual(53) // 50 chars + "..."
    })

    it('has proper semantic HTML table structure', () => {
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()

        // Check for thead, tbody
        expect(table.querySelector('thead')).toBeInTheDocument()
        expect(table.querySelector('tbody')).toBeInTheDocument()

        // Check column headers have scope
        const headers = screen.getAllByRole('columnheader')
        headers.forEach(header => {
            expect(header).toHaveAttribute('scope', 'col')
        })
    })

    it('is keyboard accessible', async () => {
        const user = userEvent.setup()
        render(<ExpenseList expenses={mockExpenses} onDelete={mockOnDelete} />)

        // Tab to first sort button
        await user.tab()
        const dateButton = screen.getByRole('button', { name: /sort by date/i })
        expect(dateButton).toHaveFocus()

        // Check initial sort indicator
        expect(dateButton.textContent).toContain('↓')

        // Press Enter to toggle sort
        await user.keyboard('{Enter}')

        // Sort indicator should change to ascending
        expect(dateButton.textContent).toContain('↑')
    })
})
