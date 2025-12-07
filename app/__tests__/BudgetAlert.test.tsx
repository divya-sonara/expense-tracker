import { render, screen } from '@testing-library/react'
import { BudgetAlert } from '@/app/components/features/BudgetAlert'
import { BudgetStatus } from '@/app/lib/types'

describe('BudgetAlert', () => {
    it('should not render when there are no alerts', () => {
        const statuses: BudgetStatus[] = [
            {
                budget: {
                    id: '1',
                    category: 'Food',
                    limit: 500,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 200,
                remaining: 300,
                percentage: 40,
                isExceeded: false,
                isNearLimit: false,
            },
        ]

        const { container } = render(<BudgetAlert statuses={statuses} />)
        expect(container.firstChild).toBeNull()
    })

    it('should render warning alert when near limit', () => {
        const statuses: BudgetStatus[] = [
            {
                budget: {
                    id: '1',
                    category: 'Food',
                    limit: 500,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 450,
                remaining: 50,
                percentage: 90,
                isExceeded: false,
                isNearLimit: true,
            },
        ]

        render(<BudgetAlert statuses={statuses} />)
        
        expect(screen.getByText('Budget Warning')).toBeInTheDocument()
        expect(screen.getByText(/Food/i)).toBeInTheDocument()
        expect(screen.getByText(/\$50\.00/)).toBeInTheDocument()
        expect(screen.getByText(/remaining/i)).toBeInTheDocument()
    })

    it('should render exceeded alert when budget is exceeded', () => {
        const statuses: BudgetStatus[] = [
            {
                budget: {
                    id: '1',
                    category: 'Food',
                    limit: 500,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 600,
                remaining: -100,
                percentage: 120,
                isExceeded: true,
                isNearLimit: false,
            },
        ]

        render(<BudgetAlert statuses={statuses} />)
        
        expect(screen.getByText('Budget Exceeded')).toBeInTheDocument()
        expect(screen.getByText(/Over budget by/i)).toBeInTheDocument()
        expect(screen.getByText(/\$100\.00/)).toBeInTheDocument()
    })

    it('should render multiple alerts', () => {
        const statuses: BudgetStatus[] = [
            {
                budget: {
                    id: '1',
                    category: 'Food',
                    limit: 500,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 450,
                remaining: 50,
                percentage: 90,
                isExceeded: false,
                isNearLimit: true,
            },
            {
                budget: {
                    id: '2',
                    category: 'Transport',
                    limit: 300,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 350,
                remaining: -50,
                percentage: 117,
                isExceeded: true,
                isNearLimit: false,
            },
        ]

        render(<BudgetAlert statuses={statuses} />)
        
        expect(screen.getByText('Budget Warning')).toBeInTheDocument()
        expect(screen.getByText('Budget Exceeded')).toBeInTheDocument()
        expect(screen.getByText(/Food/i)).toBeInTheDocument()
        expect(screen.getByText(/Transport/i)).toBeInTheDocument()
    })

    it('should render overall budget alert', () => {
        const statuses: BudgetStatus[] = [
            {
                budget: {
                    id: '1',
                    category: 'overall',
                    limit: 1000,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 900,
                remaining: 100,
                percentage: 90,
                isExceeded: false,
                isNearLimit: true,
            },
        ]

        render(<BudgetAlert statuses={statuses} />)
        
        expect(screen.getByText(/Overall/i)).toBeInTheDocument()
        expect(screen.getByText('Budget Warning')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
        const statuses: BudgetStatus[] = [
            {
                budget: {
                    id: '1',
                    category: 'Food',
                    limit: 500,
                    period: 'monthly',
                    createdAt: new Date().toISOString(),
                },
                spent: 450,
                remaining: 50,
                percentage: 90,
                isExceeded: false,
                isNearLimit: true,
            },
        ]

        render(<BudgetAlert statuses={statuses} />)
        
        const alertContainer = screen.getByRole('alert')
        expect(alertContainer).toHaveAttribute('aria-live', 'polite')
        
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toHaveAttribute('aria-valuenow', '90')
        expect(progressBar).toHaveAttribute('aria-valuemin', '0')
        expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })
})
