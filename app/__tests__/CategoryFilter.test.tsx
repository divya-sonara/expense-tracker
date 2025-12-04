import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryFilter from '@/app/components/features/CategoryFilter'
import { ExpenseCategory } from '@/app/lib/types'
import { EXPENSE_CATEGORIES } from '@/app/lib/constants'

describe('CategoryFilter', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('Rendering', () => {
    it('renders all category buttons', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      // Check for "All" button
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()

      // Check for all 7 category buttons
      EXPENSE_CATEGORIES.forEach((categoryConfig) => {
        expect(screen.getByRole('button', { name: new RegExp(categoryConfig.name, 'i') })).toBeInTheDocument()
      })
    })

    it('renders filter heading and description', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      expect(screen.getByText('Filter by Category')).toBeInTheDocument()
      expect(screen.getByText('Select a category to filter your expenses')).toBeInTheDocument()
    })

    it('displays category icons', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      // Check that emoji icons are present (they're in aria-hidden spans)
      EXPENSE_CATEGORIES.forEach((categoryConfig) => {
        const button = screen.getByRole('button', { name: new RegExp(categoryConfig.name, 'i') })
        expect(button).toHaveTextContent(categoryConfig.icon)
      })
    })
  })

  describe('Selection State', () => {
    it('shows "All" button as selected when selected is null', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      expect(allButton).toHaveAttribute('aria-pressed', 'true')
      expect(allButton).toHaveClass('bg-blue-600')
    })

    it('shows selected category button as active', () => {
      const selectedCategory: ExpenseCategory = 'Food'
      render(<CategoryFilter selected={selectedCategory} onSelect={mockOnSelect} />)

      const foodButton = screen.getByRole('button', { name: /food/i })
      expect(foodButton).toHaveAttribute('aria-pressed', 'true')
      expect(foodButton).toHaveClass('bg-blue-600')

      // All button should not be selected
      const allButton = screen.getByRole('button', { name: /all/i })
      expect(allButton).toHaveAttribute('aria-pressed', 'false')
    })

    it('shows non-selected buttons with default styling', () => {
      render(<CategoryFilter selected="Food" onSelect={mockOnSelect} />)

      const transportButton = screen.getByRole('button', { name: /transport/i })
      expect(transportButton).toHaveAttribute('aria-pressed', 'false')
      expect(transportButton).toHaveClass('bg-gray-100')
    })
  })

  describe('Click Interactions', () => {
    it('calls onSelect with null when "All" button is clicked', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected="Food" onSelect={mockOnSelect} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      await user.click(allButton)

      expect(mockOnSelect).toHaveBeenCalledWith(null)
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('calls onSelect with category name when category button is clicked', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const foodButton = screen.getByRole('button', { name: /food/i })
      await user.click(foodButton)

      expect(mockOnSelect).toHaveBeenCalledWith('Food')
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('can switch between categories', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      // Click Food
      const foodButton = screen.getByRole('button', { name: /food/i })
      await user.click(foodButton)
      expect(mockOnSelect).toHaveBeenCalledWith('Food')

      // Click Transport
      const transportButton = screen.getByRole('button', { name: /transport/i })
      await user.click(transportButton)
      expect(mockOnSelect).toHaveBeenCalledWith('Transport')

      expect(mockOnSelect).toHaveBeenCalledTimes(2)
    })
  })

  describe('Keyboard Navigation', () => {
    it('is keyboard accessible via Tab', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      
      // Tab to first button
      await user.tab()
      expect(allButton).toHaveFocus()
    })

    it('activates button with Enter key', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      allButton.focus()

      await user.keyboard('{Enter}')

      expect(mockOnSelect).toHaveBeenCalledWith(null)
    })

    it('activates button with Space key', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const foodButton = screen.getByRole('button', { name: /food/i })
      foodButton.focus()

      await user.keyboard(' ')

      expect(mockOnSelect).toHaveBeenCalledWith('Food')
    })

    it('navigates to next button with ArrowRight', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      const foodButton = screen.getByRole('button', { name: /food/i })

      allButton.focus()
      await user.keyboard('{ArrowRight}')

      expect(foodButton).toHaveFocus()
    })

    it('navigates to previous button with ArrowLeft', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const allButton = screen.getByRole('button', { name: /all/i })
      const foodButton = screen.getByRole('button', { name: /food/i })

      foodButton.focus()
      await user.keyboard('{ArrowLeft}')

      expect(allButton).toHaveFocus()
    })

    it('wraps navigation at the end with ArrowRight', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const buttons = screen.getAllByRole('button')
      const lastButton = buttons[buttons.length - 1]
      const firstButton = buttons[0]

      lastButton.focus()
      await user.keyboard('{ArrowRight}')

      expect(firstButton).toHaveFocus()
    })

    it('wraps navigation at the start with ArrowLeft', async () => {
      const user = userEvent.setup()
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const buttons = screen.getAllByRole('button')
      const firstButton = buttons[0]
      const lastButton = buttons[buttons.length - 1]

      firstButton.focus()
      await user.keyboard('{ArrowLeft}')

      expect(lastButton).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      // Check for group role
      const group = screen.getByRole('group', { name: /filter expenses by category/i })
      expect(group).toBeInTheDocument()

      // Check aria-pressed on all buttons
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed')
      })
    })

    it('provides screen reader instructions', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      // Check for sr-only instructions
      const instructions = screen.getByText(/use tab or arrow keys/i)
      expect(instructions).toHaveClass('sr-only')
    })

    it('announces current selection to screen readers', () => {
      render(<CategoryFilter selected="Food" onSelect={mockOnSelect} />)

      const instructions = screen.getByText(/currently filtering by food/i)
      expect(instructions).toBeInTheDocument()
    })

    it('has minimum touch target size (44x44px)', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('min-w-[44px]')
        expect(button).toHaveClass('min-h-[44px]')
      })
    })

    it('has visible focus indicators', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('focus:ring-2')
      })
    })
  })

  describe('Visual States', () => {
    it('applies hover styles on non-selected buttons', () => {
      render(<CategoryFilter selected="Food" onSelect={mockOnSelect} />)

      const transportButton = screen.getByRole('button', { name: /transport/i })
      expect(transportButton).toHaveClass('hover:bg-gray-200')
    })

    it('shows shadow on selected button', () => {
      render(<CategoryFilter selected="Food" onSelect={mockOnSelect} />)

      const foodButton = screen.getByRole('button', { name: /food/i })
      expect(foodButton).toHaveClass('shadow-md')
    })

    it('has transition animations', () => {
      render(<CategoryFilter selected={null} onSelect={mockOnSelect} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('transition-all')
      })
    })
  })
})
