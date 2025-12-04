import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Dialog } from '@/app/components/ui/Dialog'
import { Toast } from '@/app/components/ui/Toast'
import DeleteConfirmDialog from '@/app/components/ui/DeleteConfirmDialog'
import CategoryFilter from '@/app/components/features/CategoryFilter'
import { ExpenseList } from '@/app/components/features/ExpenseList'
import { Expense } from '@/app/lib/types'

expect.extend(toHaveNoViolations)

describe('Accessibility - jest-axe Tests', () => {
  describe('Button Component', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<Button variant="primary">Click me</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have violations with all variants', async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Input Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Input label="Email" type="email" placeholder="Enter email" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have violations with error state', async () => {
      const { container } = render(
        <Input label="Email" type="email" error="Email is required" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Select Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Select
          label="Category"
          options={[
            { value: 'food', label: 'Food' },
            { value: 'transport', label: 'Transport' },
          ]}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Dialog Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Dialog isOpen={true} onClose={() => {}} title="Test Dialog">
          <p>Dialog content</p>
        </Dialog>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Toast Component', () => {
    it('should not have accessibility violations (success)', async () => {
      const { container } = render(
        <Toast message="Success message" type="success" onClose={() => {}} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations (error)', async () => {
      const { container } = render(
        <Toast message="Error message" type="error" onClose={() => {}} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('DeleteConfirmDialog Component', () => {
    const mockExpense: Expense = {
      id: '1',
      amount: 50.00,
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-15',
      createdAt: '2024-01-15T12:00:00Z',
    }

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <DeleteConfirmDialog
          isOpen={true}
          expense={mockExpense}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('CategoryFilter Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <CategoryFilter
          selected={null}
          onSelect={() => {}}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('CategoryFilter Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <CategoryFilter
          selected={null}
          onSelect={() => {}}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('ExpenseList Component', () => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 50.00,
        category: 'Food',
        description: 'Lunch',
        date: '2024-01-15',
        createdAt: '2024-01-15T12:00:00Z',
      },
    ]

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ExpenseList
          expenses={mockExpenses}
          onDelete={() => Promise.resolve()}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have violations with empty state', async () => {
      const { container } = render(
        <ExpenseList expenses={[]} onDelete={() => Promise.resolve()} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
