# Data Model: Expense Management System

**Created**: 2025-12-04  
**Status**: Final  
**Version**: 1.0.0

## Entity: Expense

Core domain entity representing a single expense transaction.

### TypeScript Interface

```typescript
interface Expense {
  id: string;                    // UUID v4, auto-generated on creation
  amount: number;                // Required. Positive number, max 2 decimal places. Example: 42.99
  category: ExpenseCategory;     // Required. One of predefined categories
  description?: string;          // Optional. Max 200 characters. Empty string if not provided
  date: Date;                    // Required. Timestamp of expense. Defaults to today's date
  createdAt: Date;               // Internal. Timestamp of record creation
  updatedAt?: Date;              // Internal. Timestamp of last modification (if editing added later)
}

type ExpenseCategory = 
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Other';
```

### Field Specifications

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | string | Yes | UUID format | Auto-generated, immutable |
| `amount` | number | Yes | >0, max 2 decimals | Examples: 5.99, 100.00, 1250.50 |
| `category` | enum | Yes | One of 7 values | Food, Transport, Entertainment, Shopping, Bills, Health, Other |
| `description` | string | No | Max 200 characters | Optional. Useful for notes. Examples: "Groceries at Whole Foods", "Taxi to airport" |
| `date` | Date | Yes | Valid timestamp | Can be past dates. Future dates require confirmation (UX requirement) |
| `createdAt` | Date | Yes | ISO timestamp | Automatic, set on creation |
| `updatedAt` | Date | No | ISO timestamp | For future edit functionality |

### Validation Rules

- **Amount**: Must be positive (>0), numeric, max 2 decimal places
  - ❌ Invalid: -10, "abc", 10.999
  - ✅ Valid: 0.01, 9.99, 100, 1250.50

- **Category**: Must match one of 7 predefined categories
  - Case-sensitive: "Food" not "food"
  - Cannot create custom categories in MVP
  - Cannot be empty or null

- **Description**: Optional but if provided must be ≤200 characters
  - Special characters allowed: emoji, symbols, multiple languages
  - Empty string treated as no description (valid)
  - Whitespace-only description invalid

- **Date**: Must be valid ISO timestamp
  - Can be today, past dates, or future dates (with confirmation)
  - Cannot be null or undefined (defaults to today)

### Example Instances

```typescript
// Minimal expense (required fields only)
{
  id: "uuid-1234",
  amount: 12.50,
  category: "Food",
  date: new Date("2025-12-04"),
  createdAt: new Date("2025-12-04T10:30:00Z")
}

// Complete expense (with optional description)
{
  id: "uuid-5678",
  amount: 45.99,
  category: "Transport",
  description: "Taxi to airport - 30 mins",
  date: new Date("2025-12-03"),
  createdAt: new Date("2025-12-04T14:22:00Z"),
  updatedAt: new Date("2025-12-04T14:25:00Z")
}

// Expense with special characters in description
{
  id: "uuid-9012",
  amount: 89.50,
  category: "Entertainment",
  description: "Concert 🎵 @ Madison Square Garden - $75 + fees",
  date: new Date("2025-12-02"),
  createdAt: new Date("2025-12-04T16:45:00Z")
}
```

## Entity: ExpenseCategory

Represents an expense classification. Supports future extensibility with visual identifiers.

### TypeScript Interface

```typescript
interface ExpenseCategory {
  name: 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Bills' | 'Health' | 'Other';
  icon?: string;                 // Optional: icon identifier (emoji or SVG class)
  color?: string;                // Optional: Tailwind color class (e.g., 'bg-blue-500')
  description?: string;          // Optional: User-friendly description
}
```

### Predefined Categories

```typescript
const EXPENSE_CATEGORIES = [
  {
    name: 'Food',
    icon: '🍔',
    color: 'bg-orange-500',
    description: 'Food & groceries'
  },
  {
    name: 'Transport',
    icon: '🚗',
    color: 'bg-blue-500',
    description: 'Travel & transportation'
  },
  {
    name: 'Entertainment',
    icon: '🎬',
    color: 'bg-purple-500',
    description: 'Movies, shows, games'
  },
  {
    name: 'Shopping',
    icon: '🛍️',
    color: 'bg-pink-500',
    description: 'Clothing, items'
  },
  {
    name: 'Bills',
    icon: '📄',
    color: 'bg-red-500',
    description: 'Utilities, subscriptions'
  },
  {
    name: 'Health',
    icon: '💊',
    color: 'bg-green-500',
    description: 'Medical, fitness'
  },
  {
    name: 'Other',
    icon: '📌',
    color: 'bg-gray-500',
    description: 'Miscellaneous'
  }
] as const;
```

## Collection: Expenses List

Entire expense history managed by application.

### Storage Structure (localStorage)

```typescript
interface ExpenseStorage {
  version: number;              // Schema version (currently 1)
  expenses: Expense[];          // Array of all expense records
  lastUpdated: string;          // ISO timestamp of last change
}

// Example stored data (after btoa encoding for security):
{
  version: 1,
  expenses: [
    { id: "uuid-1", amount: 12.50, category: "Food", date: "2025-12-04T...", createdAt: "2025-12-04T..." },
    { id: "uuid-2", amount: 45.99, category: "Transport", description: "Taxi", date: "2025-12-03T...", createdAt: "2025-12-04T..." }
  ],
  lastUpdated: "2025-12-04T16:45:00Z"
}
```

### Collection Operations

- **Create**: Add new Expense with auto-generated UUID
- **Read**: Load all expenses from localStorage on app start
- **Update**: Modify expense (optional future feature)
- **Delete**: Remove expense by ID from collection
- **Filter**: Query by category, date range (future feature)
- **Sort**: By date (newest first), by amount, by category (future)
- **Persist**: Write to localStorage after each operation

### Constraints

- **Maximum Size**: ~5-10MB localStorage quota (typical expense ~200 bytes, ~25k-50k max expenses)
- **No Duplication**: IDs are unique (UUID)
- **Immutable ID**: Expense ID never changes after creation
- **Encoding**: Data stored with btoa() encoding to prevent code injection
- **Concurrency**: Single-user, no multi-tab synchronization

## Relationships

```
┌─────────────┐
│  Expense    │
├─────────────┤
│ id (PK)     │ ◄────┐
│ amount      │      │ Many-to-One
│ category    ├──────┼────► ExpenseCategory
│ description │      │
│ date        │      │
└─────────────┘      │
                    └────── (7 predefined values)

Collection: Expenses
├── Expense (id: uuid-1)
├── Expense (id: uuid-2)
├── Expense (id: uuid-3)
└── ... (unlimited until localStorage full)
```

## State Transitions

```
CREATE
  ├─ Validate input (Zod schema)
  ├─ Generate UUID
  ├─ Set createdAt timestamp
  ├─ Add to expenses array
  └─ Persist to localStorage

READ
  ├─ Retrieve from localStorage key 'expenses-v1'
  ├─ Decode data (atob)
  ├─ Parse JSON
  └─ Load into app state (useExpenses hook)

DELETE
  ├─ Find expense by ID
  ├─ Remove from array (splice)
  ├─ Update lastUpdated timestamp
  ├─ Persist to localStorage
  └─ Show toast notification

FILTER (client-side, no state change)
  ├─ Receive category selection
  ├─ Filter expenses array by category
  └─ Display filtered results
```

## Validation Schema (Zod)

```typescript
import { z } from 'zod';

const categorySchema = z.enum(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']);

const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().multipleOf(0.01).max(9999999.99),
  category: categorySchema,
  description: z.string().max(200).optional(),
  date: z.coerce.date(),
  createdAt: z.coerce.date()
});

const expenseCreateSchema = expenseSchema.omit({
  id: true,
  createdAt: true
});

const expenseStorageSchema = z.object({
  version: z.literal(1),
  expenses: z.array(expenseSchema),
  lastUpdated: z.string().datetime()
});
```

## Migration Strategy

### Version 1 (Current)

```json
{
  "version": 1,
  "expenses": [ ... ],
  "lastUpdated": "2025-12-04T..."
}
```

Future versions can add fields or restructure without breaking existing data:
- Version 2 might add tags, receipts, custom categories
- Version 3 might add sync metadata for cloud support
- Migrations performed on app load via version check

## Edge Cases & Handling

| Scenario | Behavior |
|----------|----------|
| localStorage full | Show error: "Storage full. Delete old expenses" (prevents save) |
| Duplicate ID on create | Regenerate UUID (vanishingly rare with UUID v4) |
| Corrupted localStorage data | Reset to empty array, show warning |
| Amount > 2 decimals | Truncate to 2 decimals OR show validation error |
| Description > 200 chars | Validation error on form submit |
| Future date | Show warning, require confirmation |
| Invalid category | Validation error, show available categories |
| Missing required field | Form validation blocks submission |
| Special chars in description | Allow (emoji, symbols, Unicode supported) |

## Performance Considerations

- **In-Memory Storage**: All expenses loaded in memory (useExpenses hook)
- **Filter Operations**: <100ms even with 1000 expenses (O(n) filter, acceptable)
- **Search**: Not implemented in MVP, would require indexing for scale
- **Sorting**: By date (O(n log n) per sort, happens once on load)
- **Serialization**: btoa/atob adds ~30% size overhead (acceptable trade-off for security)
