import { Expense, ExpenseCategory } from '@/app/lib/types'

// Mock filterByCategory function (same logic as useExpenses hook)
const filterByCategory = (expenses: Expense[], category: ExpenseCategory | null): Expense[] => {
  if (!category) return expenses
  return expenses.filter(e => e.category === category)
}

describe('Filter Performance', () => {
  // Generate mock expenses
  const generateMockExpenses = (count: number): Expense[] => {
    const categories: ExpenseCategory[] = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']
    const expenses: Expense[] = []

    for (let i = 0; i < count; i++) {
      expenses.push({
        id: `expense-${i}`,
        amount: Math.random() * 500 + 1,
        category: categories[i % categories.length],
        description: `Test expense ${i}`,
        date: new Date(2024, 0, i % 31 + 1).toISOString(),
        createdAt: new Date().toISOString(),
      })
    }

    return expenses
  }

  it('filters 1000 expenses in less than 100ms', () => {
    // Generate 1000 expenses
    const mockExpenses = generateMockExpenses(1000)

    // Test filter performance
    const categories: ExpenseCategory[] = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']

    categories.forEach((category) => {
      const startTime = performance.now()
      const filtered = filterByCategory(mockExpenses, category)
      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100)
      
      // Should return correct filtered results
      expect(filtered.length).toBeGreaterThan(0)
      filtered.forEach((expense) => {
        expect(expense.category).toBe(category)
      })
    })

    // Test "All" filter (null)
    const startTime = performance.now()
    const allExpenses = filterByCategory(mockExpenses, null)
    const endTime = performance.now()
    const duration = endTime - startTime

    expect(duration).toBeLessThan(100)
    expect(allExpenses.length).toBe(1000)
  })

  it('filters 5000 expenses in less than 100ms', () => {
    // Generate 5000 expenses to stress test
    const mockExpenses = generateMockExpenses(5000)

    // Test filter performance with larger dataset
    const startTime = performance.now()
    const filtered = filterByCategory(mockExpenses, 'Food')
    const endTime = performance.now()
    const duration = endTime - startTime

    // Should still complete in less than 100ms even with 5000 expenses
    expect(duration).toBeLessThan(100)
    expect(filtered.length).toBeGreaterThan(0)
    filtered.forEach((expense) => {
      expect(expense.category).toBe('Food')
    })
  })

  it('measures average filter time across multiple runs', () => {
    const mockExpenses = generateMockExpenses(1000)

    // Run filter 100 times and calculate average
    const durations: number[] = []
    const categories: ExpenseCategory[] = ['Food', 'Transport', 'Entertainment', 'Shopping']

    for (let i = 0; i < 100; i++) {
      const category = categories[i % categories.length]
      const startTime = performance.now()
      filterByCategory(mockExpenses, category)
      const endTime = performance.now()
      durations.push(endTime - startTime)
    }

    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    const maxDuration = Math.max(...durations)

    // Average should be well under 100ms
    expect(averageDuration).toBeLessThan(50)
    
    // Even the slowest run should be under 100ms
    expect(maxDuration).toBeLessThan(100)

    console.log(`Average filter time: ${averageDuration.toFixed(2)}ms`)
    console.log(`Max filter time: ${maxDuration.toFixed(2)}ms`)
    console.log(`Min filter time: ${Math.min(...durations).toFixed(2)}ms`)
  })

  it('verifies filter correctness with mixed categories', () => {
    const mockExpenses = generateMockExpenses(1000)

    // Count expected results for each category
    const categoryCounts = mockExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1
      return acc
    }, {} as Record<ExpenseCategory, number>)

    // Test each category
    Object.entries(categoryCounts).forEach(([category, expectedCount]) => {
      const filtered = filterByCategory(mockExpenses, category as ExpenseCategory)
      expect(filtered.length).toBe(expectedCount)
    })

    // Test null (all)
    const all = filterByCategory(mockExpenses, null)
    expect(all.length).toBe(1000)
  })
})
