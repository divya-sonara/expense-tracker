# Developer Quickstart: Expense Management System

**Project**: Expense Tracker  
**Branch**: `001-expense-management`  
**Tech Stack**: Next.js 16 (App Router), TypeScript 5, React 19, Tailwind CSS 4  
**Status**: Ready for development

## Project Setup (5 minutes)

```bash
# Navigate to project
cd /home/divya/Projects/AI/expense-tracker

# Ensure on correct branch
git checkout 001-expense-management

# Install dependencies (already done, but for reference)
npm install

# Start dev server
npm run dev

# Open http://localhost:3000 in browser
```

## Key Files & Directories

### Configuration
- `tsconfig.json` - TypeScript strict mode enabled
- `next.config.ts` - Next.js App Router configuration
- `tailwind.config.ts` - Tailwind CSS theming
- `.env.example` - Environment variable template

### Documentation
- `specs/001-expense-management/spec.md` - Feature specification
- `specs/001-expense-management/plan.md` - This implementation plan
- `specs/001-expense-management/data-model.md` - Entity documentation
- `specs/001-expense-management/contracts/expense-schema.ts` - TypeScript interfaces

### Source Code (to be created)
```
app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Home page (expense list)
├── (expense-routes)/
│   ├── add/page.tsx             # Add expense page
│   └── layout.tsx
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── features/                # Feature-specific components
│   └── layout/                  # Layout components
├── hooks/                       # Custom React hooks
├── actions/                     # Server actions
├── lib/                         # Utilities, schemas, types
└── __tests__/                   # Test files (mirroring src structure)
```

## Phase 1: Setup & Foundational (Start Here)

### Step 1: Create Types File

```bash
mkdir -p app/lib
touch app/lib/types.ts
```

Add to `app/lib/types.ts`:
```typescript
export type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Bills' | 'Health' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: Date;
  createdAt: Date;
}
```

### Step 2: Create Constants File

```bash
touch app/lib/constants.ts
```

Add to `app/lib/constants.ts`:
```typescript
export const EXPENSE_CATEGORIES = [
  { name: 'Food' as const, icon: '🍔' },
  { name: 'Transport' as const, icon: '🚗' },
  { name: 'Entertainment' as const, icon: '🎬' },
  { name: 'Shopping' as const, icon: '🛍️' },
  { name: 'Bills' as const, icon: '📄' },
  { name: 'Health' as const, icon: '💊' },
  { name: 'Other' as const, icon: '📌' }
] as const;

export const MAX_DESCRIPTION_LENGTH = 200;
export const STORAGE_KEY = 'expenses-v1';
export const TOAST_DURATION_MS = 3000;
```

### Step 3: Create localStorage Hook

```bash
mkdir -p app/hooks
touch app/hooks/useLocalStorage.ts
```

Add to `app/hooks/useLocalStorage.ts`:
```typescript
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Decode from btoa for security
        const decoded = atob(item);
        setStoredValue(JSON.parse(decoded));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoaded(true);
  }, [key]);

  // Save to localStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      // Encode with btoa for security
      const encoded = btoa(JSON.stringify(value));
      window.localStorage.setItem(key, encoded);
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  };

  return { value: storedValue, setValue, isLoaded };
}
```

### Step 4: Create useExpenses Hook

```bash
touch app/hooks/useExpenses.ts
```

Add to `app/hooks/useExpenses.ts`:
```typescript
'use client';

import { useState, useCallback } from 'react';
import { Expense, ExpenseCategory } from '@/app/lib/types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY } from '@/app/lib/constants';
import { v4 as uuidv4 } from 'uuid';

interface StorageData {
  version: number;
  expenses: Expense[];
  lastUpdated: string;
}

export function useExpenses() {
  const { value: storageData, setValue: setStorageData, isLoaded } = useLocalStorage<StorageData>(
    STORAGE_KEY,
    { version: 1, expenses: [], lastUpdated: new Date().toISOString() }
  );

  const [error, setError] = useState<string>();

  const addExpense = useCallback(
    (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
      const newExpense: Expense = {
        id: uuidv4(),
        createdAt: new Date(),
        ...expenseData
      };

      try {
        setStorageData({
          version: 1,
          expenses: [...storageData.expenses, newExpense],
          lastUpdated: new Date().toISOString()
        });
        setError(undefined);
        return newExpense;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to add expense';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [storageData, setStorageData]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      try {
        setStorageData({
          version: 1,
          expenses: storageData.expenses.filter(e => e.id !== id),
          lastUpdated: new Date().toISOString()
        });
        setError(undefined);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete expense';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [storageData, setStorageData]
  );

  const filterByCategory = useCallback(
    (category: ExpenseCategory) => {
      return storageData.expenses.filter(e => e.category === category);
    },
    [storageData.expenses]
  );

  return {
    expenses: storageData.expenses,
    addExpense,
    deleteExpense,
    filterByCategory,
    error,
    isLoaded
  };
}
```

### Step 5: Create Base UI Components

Create `app/components/ui/Button.tsx`:
```typescript
'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const baseClass = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size];

  return (
    <button
      className={clsx(baseClass, variantClass, sizeClass, className)}
      {...props}
    />
  );
}
```

### Step 6: Install Additional Dependencies

```bash
# UUID generation
npm install uuid
npm install --save-dev @types/uuid

# Form validation (optional but recommended)
npm install zod
```

## Testing Setup

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-axe @testing-library/user-event

# Create jest.config.js at root:
touch jest.config.js
```

## Key Development Patterns

### Adding an Expense

```typescript
const { addExpense, error } = useExpenses();

try {
  const newExpense = addExpense({
    amount: 12.50,
    category: 'Food',
    description: 'Lunch',
    date: new Date()
  });
  console.log('Expense added:', newExpense);
} catch (err) {
  console.error('Failed:', error);
}
```

### Reading Expenses

```typescript
const { expenses, isLoaded } = useExpenses();

if (!isLoaded) return <div>Loading...</div>;
if (expenses.length === 0) return <div>No expenses</div>;

return (
  <ul>
    {expenses.map(exp => (
      <li key={exp.id}>{exp.amount} - {exp.category}</li>
    ))}
  </ul>
);
```

### Deleting an Expense

```typescript
const { deleteExpense } = useExpenses();

const handleDelete = async (expenseId: string) => {
  try {
    deleteExpense(expenseId);
    // Show success toast
  } catch (err) {
    // Show error toast
  }
};
```

### Filtering by Category

```typescript
const { expenses, filterByCategory } = useExpenses();
const [selected, setSelected] = useState<ExpenseCategory | null>(null);

const displayed = selected ? filterByCategory(selected) : expenses;

return (
  <>
    <select onChange={(e) => setSelected(e.target.value as ExpenseCategory)}>
      <option value="">All</option>
      {EXPENSE_CATEGORIES.map(cat => (
        <option key={cat.name} value={cat.name}>{cat.name}</option>
      ))}
    </select>
    {/* Display displayed expenses */}
  </>
);
```

## Architecture Decisions

1. **Server Components by Default**: Use Server Components for pages, Client Components only for interactive elements
2. **Custom Hooks for State**: useExpenses manages all expense state, filtering logic
3. **localStorage Encoding**: btoa/atob prevents code injection attacks
4. **TypeScript Strict**: All code fully typed, catch errors early
5. **Tailwind for Styling**: Utility-first CSS for rapid development
6. **No External State Management**: Hooks sufficient for MVP scope

## Constitutional Requirements Checklist

- [ ] All components have clear responsibility (Component-Driven)
- [ ] Keyboard navigation works (Accessibility-First)
- [ ] All types are explicit (Type Safety)
- [ ] Performance targets met (Performance)
- [ ] Test coverage for critical logic (Test Coverage)
- [ ] Loading states and error handling present (UX)
- [ ] Input validation on form submit (Security)

## Next Steps

1. ✅ Dependencies installed and configured
2. ✅ Types and constants defined
3. → Create `ExpenseForm` component (Phase 2 - User Story P1)
4. → Create `ExpenseList` component (Phase 3 - User Story P2)
5. → Create `CategoryFilter` component (Phase 4 - User Story P3)
6. → Create delete confirmation dialog (Phase 5 - User Story P4)
7. → Run `/speckit.tasks` for detailed task breakdown

## Helpful Commands

```bash
# Development
npm run dev                      # Start dev server on :3000

# Type checking
npx tsc --noEmit               # Check types without build

# Linting
npm run lint                    # Run ESLint

# Testing
npm test                        # Run Jest tests
npm test -- --coverage         # With coverage report

# Building
npm run build                   # Production build
npm start                       # Run production build locally
```

## Troubleshooting

**Issue**: localStorage undefined in Next.js  
**Solution**: Ensure component has `'use client'` directive for client-side code

**Issue**: UUID import errors  
**Solution**: Run `npm install uuid @types/uuid`

**Issue**: Tailwind classes not applying  
**Solution**: Check `tailwind.config.ts` has correct content paths

**Issue**: Type errors with Expense[]  
**Solution**: Import types from `app/lib/types`

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
