import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetForm } from '@/app/components/features/BudgetForm'

describe('BudgetForm', () => {
    it('should render the form with all fields', () => {
        const mockOnSubmit = jest.fn()
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        expect(screen.getByRole('heading', { name: 'Set Budget' })).toBeInTheDocument()
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Period/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Budget Limit/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Set Budget/i })).toBeInTheDocument()
    })

    it('should submit form with valid data', async () => {
        const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
        const user = userEvent.setup()
        
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        const categorySelect = screen.getByLabelText(/Category/i)
        const periodSelect = screen.getByLabelText(/Period/i)
        const limitInput = screen.getByLabelText(/Budget Limit/i)
        const submitButton = screen.getByRole('button', { name: /Set Budget/i })

        await user.selectOptions(categorySelect, 'Food')
        await user.selectOptions(periodSelect, 'monthly')
        await user.type(limitInput, '500')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Food', 500, 'monthly')
        })
    })

    it('should submit form with overall budget', async () => {
        const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
        const user = userEvent.setup()
        
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        const categorySelect = screen.getByLabelText(/Category/i)
        const limitInput = screen.getByLabelText(/Budget Limit/i)
        const submitButton = screen.getByRole('button', { name: /Set Budget/i })

        await user.selectOptions(categorySelect, 'overall')
        await user.type(limitInput, '1000')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('overall', 1000, 'monthly')
        })
    })

    it('should show error for invalid amount', async () => {
        const mockOnSubmit = jest.fn()
        const user = userEvent.setup()
        
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        const limitInput = screen.getByLabelText(/Budget Limit/i)
        const submitButton = screen.getByRole('button', { name: /Set Budget/i })

        // Clear the input and type invalid value
        await user.clear(limitInput)
        await user.type(limitInput, 'abc')
        
        // Form submit will trigger validation
        fireEvent.submit(submitButton.closest('form')!)

        // mockOnSubmit should not be called for invalid input
        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show error for zero amount', async () => {
        const mockOnSubmit = jest.fn()
        const user = userEvent.setup()
        
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        const limitInput = screen.getByLabelText(/Budget Limit/i)

        // Type 0 and submit
        await user.clear(limitInput)
        await user.type(limitInput, '0')
        
        const form = limitInput.closest('form')!
        fireEvent.submit(form)

        await waitFor(() => {
            expect(screen.getByText(/Please enter a valid amount greater than 0/i)).toBeInTheDocument()
        })

        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear form after successful submission', async () => {
        const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
        const user = userEvent.setup()
        
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        const limitInput = screen.getByLabelText(/Budget Limit/i) as HTMLInputElement
        const submitButton = screen.getByRole('button', { name: /Set Budget/i })

        await user.type(limitInput, '500')
        await user.click(submitButton)

        await waitFor(() => {
            expect(limitInput.value).toBe('')
        })
    })

    it('should disable submit button when loading', () => {
        const mockOnSubmit = jest.fn()
        
        render(<BudgetForm onSubmit={mockOnSubmit} isLoading={true} />)

        const submitButton = screen.getByRole('button', { name: /Setting Budget/i })
        expect(submitButton).toBeDisabled()
    })

    it('should have proper form accessibility', () => {
        const mockOnSubmit = jest.fn()
        
        render(<BudgetForm onSubmit={mockOnSubmit} />)

        const categorySelect = screen.getByLabelText(/Category/i)
        const periodSelect = screen.getByLabelText(/Period/i)
        const limitInput = screen.getByLabelText(/Budget Limit/i)

        expect(categorySelect).toHaveAttribute('required')
        expect(periodSelect).toHaveAttribute('required')
        expect(limitInput).toHaveAttribute('required')
    })
})
