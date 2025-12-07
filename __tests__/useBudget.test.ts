import { renderHook, act } from '@testing-library/react'
import { useBudget } from '@/app/hooks/useBudget'
import { Expense } from '@/app/lib/types'

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9))
}))

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
})

describe('useBudget', () => {
    beforeEach(() => {
        mockLocalStorage.clear()
    })

    it('should initialize with empty budgets', () => {
        const { result } = renderHook(() => useBudget())
        
        expect(result.current.budgets).toEqual([])
        expect(result.current.isLoaded).toBe(true)
    })

    it('should add a new budget', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            const budget = await result.current.addBudget('Food', 500, 'monthly')
            expect(budget).not.toBeNull()
            expect(budget?.category).toBe('Food')
            expect(budget?.limit).toBe(500)
            expect(budget?.period).toBe('monthly')
        })

        expect(result.current.budgets.length).toBe(1)
        expect(result.current.budgets[0].category).toBe('Food')
    })

    it('should update existing budget when adding duplicate', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            await result.current.addBudget('Food', 500, 'monthly')
            await result.current.addBudget('Food', 600, 'monthly')
        })

        expect(result.current.budgets.length).toBe(1)
        expect(result.current.budgets[0].limit).toBe(600)
    })

    it('should delete a budget', async () => {
        const { result } = renderHook(() => useBudget())

        let budgetId: string = ''
        await act(async () => {
            const budget = await result.current.addBudget('Food', 500, 'monthly')
            budgetId = budget?.id || ''
        })

        expect(result.current.budgets.length).toBe(1)

        await act(async () => {
            const success = await result.current.deleteBudget(budgetId)
            expect(success).toBe(true)
        })

        expect(result.current.budgets.length).toBe(0)
    })

    it('should calculate budget status correctly', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            await result.current.addBudget('Food', 500, 'monthly')
        })

        const expenses: Expense[] = [
            {
                id: '1',
                amount: 100,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                amount: 200,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
        ]

        const status = result.current.getBudgetStatus('Food', expenses)
        expect(status).not.toBeNull()
        expect(status?.spent).toBe(300)
        expect(status?.remaining).toBe(200)
        expect(status?.percentage).toBe(60)
        expect(status?.isExceeded).toBe(false)
        expect(status?.isNearLimit).toBe(false)
    })

    it('should detect when budget is exceeded', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            await result.current.addBudget('Food', 100, 'monthly')
        })

        const expenses: Expense[] = [
            {
                id: '1',
                amount: 150,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
        ]

        const status = result.current.getBudgetStatus('Food', expenses)
        expect(status?.isExceeded).toBe(true)
        expect(status?.remaining).toBe(-50)
    })

    it('should detect when budget is near limit', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            await result.current.addBudget('Food', 100, 'monthly')
        })

        const expenses: Expense[] = [
            {
                id: '1',
                amount: 85,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
        ]

        const status = result.current.getBudgetStatus('Food', expenses)
        expect(status?.isNearLimit).toBe(true)
        expect(status?.isExceeded).toBe(false)
    })

    it('should get all budget statuses', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            await result.current.addBudget('Food', 500, 'monthly')
        })

        await act(async () => {
            await result.current.addBudget('Transport', 300, 'monthly')
        })

        // Debug: check what budgets were created
        expect(result.current.budgets.length).toBe(2)

        const expenses: Expense[] = [
            {
                id: '1',
                amount: 100,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                amount: 50,
                category: 'Transport',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
        ]

        const statuses = result.current.getAllBudgetStatuses(expenses)
        expect(statuses.length).toBe(2)
        expect(statuses[0].spent).toBe(100)
        expect(statuses[1].spent).toBe(50)
    })

    it('should handle overall budget', async () => {
        const { result } = renderHook(() => useBudget())

        await act(async () => {
            await result.current.addBudget('overall', 1000, 'monthly')
        })

        const expenses: Expense[] = [
            {
                id: '1',
                amount: 100,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                amount: 200,
                category: 'Transport',
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
            },
        ]

        const status = result.current.getBudgetStatus('overall', expenses)
        expect(status?.spent).toBe(300)
        expect(status?.remaining).toBe(700)
    })
})
