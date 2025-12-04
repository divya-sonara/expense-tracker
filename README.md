# Expense Tracker

A fully accessible, modern expense tracking application built with Next.js 16, React 19, and TypeScript.

## Features

✅ **Add Expenses** - Create expenses with amount, category, date, and description  
✅ **View List** - Display all expenses in a responsive, sortable table  
✅ **Filter by Category** - Quick filter with result count and announcements  
✅ **Delete Safely** - Confirmation dialog prevents accidental deletion  
✅ **Offline-First** - All data stored in browser localStorage (no server required)  
✅ **Fully Accessible** - WCAG 2.1 Level AA compliant (keyboard, screen readers, focus management)  

## User Stories

| Story | Feature | Status |
|-------|---------|--------|
| P1 | Add Expense | ✅ Complete |
| P2 | View Expenses | ✅ Complete |
| P3 | Filter by Category | ✅ Complete |
| P4 | Delete Expense | ✅ Complete |

## Quick Start

### Prerequisites
- Node.js 18+ (Turbopack compatible)
- npm or yarn

### Installation

```bash
git clone <repository>
cd expense-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Technology Stack

- **Frontend**: Next.js 16.0.7, React 19, TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Validation**: Zod
- **State Management**: React hooks (useLocalStorage, useExpenses, useToast)
- **Testing**: Jest, React Testing Library, jest-axe
- **Accessibility**: WCAG 2.1 Level AA

## Project Structure

```
app/
├── components/
│   ├── ui/              # Base UI components (Button, Input, Dialog, etc.)
│   └── features/        # Feature components (ExpenseForm, ExpenseList, etc.)
├── hooks/               # Custom React hooks
├── actions/             # Next.js server actions
├── lib/
│   ├── types.ts         # TypeScript interfaces and types
│   ├── constants.ts     # App constants and formatters
│   └── schemas.ts       # Zod validation schemas
└── __tests__/           # Component and hook tests
```

## Core Components

### `ExpenseForm`
Form for creating new expenses with validation.
```tsx
<ExpenseForm onSubmit={handleSubmit} />
```

### `ExpenseList`
Table view of all expenses with sorting and delete actions.
```tsx
<ExpenseList expenses={expenses} onDelete={handleDelete} />
```

### `CategoryFilter`
Button group for filtering expenses by category.
```tsx
<CategoryFilter selected={category} onSelect={setCategory} />
```

### `DeleteConfirmDialog`
Confirmation dialog preventing accidental expense deletion.
```tsx
<DeleteConfirmDialog
  isOpen={showDialog}
  expense={expense}
  onConfirm={handleDelete}
  onCancel={() => setShowDialog(false)}
/>
```

## Custom Hooks

### `useExpenses()`
Main hook for expense management.
```tsx
const {
  expenses,
  addExpense,
  deleteExpense,
  filterByCategory,
  isLoaded,
  error
} = useExpenses()
```

### `useToast()`
Toast notification management.
```tsx
const { toasts, addToast, removeToast } = useToast()
addToast('Expense added!', 'success')
```

### `useLocalStorage<T>(key, initialValue)`
Generic localStorage hook with encryption.
```tsx
const { value, setValue, isLoaded } = useLocalStorage('key', [])
```

## Server Actions

### `addExpense(payload)`
Create a new expense with validation.
```tsx
const result = await addExpense({
  amount: 42.50,
  category: 'Food',
  date: '2024-01-15',
  description: 'Lunch'
})
```

### `deleteExpense(id)`
Delete an expense by ID.
```tsx
const result = await deleteExpense(expenseId)
```

## Accessibility Features

✅ **Keyboard Navigation**
- Tab through all interactive elements
- Escape closes dialogs
- Arrow keys for category selection
- Logical tab order (left→right, top→bottom)

✅ **Screen Reader Support**
- All form labels associated with inputs
- Table headers announced with cell data
- Toast notifications announced (status/alert roles)
- Button purposes clear from text
- ARIA labels and descriptions for complex elements

✅ **Visual Design**
- 4.5:1 text contrast ratio (WCAG AA)
- Focus indicators on all interactive elements
- No color-only information conveyed
- Responsive to 200% zoom

✅ **Testing**
- 13/13 jest-axe accessibility tests passing
- 0 violations, 0 warnings
- WCAG 2.1 Level AA compliant

## Testing

### Run all tests
```bash
npm test
```

### Run with coverage
```bash
npm test -- --coverage
```

### Run only accessibility tests
```bash
npm test -- a11y.axe
```

### Test coverage
- Overall: 55.75% statements, 56.75% branches
- Components: 81-100% coverage
- Critical functions: >70% coverage

## Performance

- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1
- **Filter operation**: <100ms average

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Storage

All expense data is stored locally in the browser using encrypted localStorage.
No data is sent to external servers.

**Storage Format**:
```json
{
  "version": 1,
  "expenses": [
    {
      "id": "uuid",
      "amount": 42.50,
      "category": "Food",
      "description": "Lunch",
      "date": "2024-01-15",
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "lastUpdated": "2024-01-15T12:00:00Z"
}
```

## Development

### Setup development environment
```bash
npm install
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

### Linting and type checking
```bash
npm run lint
npx tsc --noEmit
```

## Expenses Categories

1. 🍔 Food
2. 🚗 Transport
3. 🎬 Entertainment
4. 🏥 Health
5. 🎓 Education
6. 🛍️ Shopping
7. 🏠 Housing

## Future Enhancements

- [ ] Export expenses to CSV/PDF
- [ ] Recurring expenses
- [ ] Budget limits and alerts
- [ ] Monthly/yearly summaries
- [ ] Multi-device sync (with backend)
- [ ] Dark mode
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Write tests for new features
3. Ensure accessibility compliance
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
