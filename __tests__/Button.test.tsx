import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/app/components/ui/Button'
import '@testing-library/jest-dom'

describe('Button Component', () => {
    test('renders button with text', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    test('renders with different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>)
        let button = screen.getByRole('button')
        expect(button).toHaveClass('bg-blue-600')

        rerender(<Button variant="secondary">Secondary</Button>)
        button = screen.getByRole('button')
        expect(button).toHaveClass('bg-gray-200')

        rerender(<Button variant="danger">Danger</Button>)
        button = screen.getByRole('button')
        expect(button).toHaveClass('bg-red-600')
    })

    test('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        let button = screen.getByRole('button')
        expect(button).toHaveClass('text-sm')

        rerender(<Button size="md">Medium</Button>)
        button = screen.getByRole('button')
        expect(button).toHaveClass('text-base')

        rerender(<Button size="lg">Large</Button>)
        button = screen.getByRole('button')
        expect(button).toHaveClass('text-lg')
    })

    test('calls onClick handler', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        const button = screen.getByRole('button', { name: /click me/i })
        await user.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('disables button when disabled prop is true', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(
            <Button disabled onClick={handleClick}>
                Click me
            </Button>
        )

        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeDisabled()

        await user.click(button)
        expect(handleClick).not.toHaveBeenCalled()
    })

    test('has focus visible indicator', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('focus:ring-2')
    })

    test('is keyboard accessible', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        const button = screen.getByRole('button')
        button.focus()
        expect(button).toHaveFocus()

        await user.keyboard('{Enter}')
        expect(handleClick).toHaveBeenCalled()
    })
})
