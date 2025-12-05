# Implementation Plan: Expense Management System

**Branch**: `001-expense-management` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-expense-management/spec.md`

## Summary

Build a client-side expense tracker using Next.js App Router with local storage persistence. MVP includes add/view/delete expenses with category filtering. Focus on quick entry (<15s), WCAG 2.1 AA accessibility, and responsive design (mobile to desktop). No backend required. Uses server components by default with client-side state management for expense CRUD operations. Toast notifications for user feedback. Semantic table layout for expense list with keyboard navigation and screen reader support.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 16 (App Router), React 19

**Primary Dependencies**: 
- React 19 (client/server components)
- Next.js 16 (App Router, middleware)
- Tailwind CSS 4 (styling)
- Zod (form validation, optional)
- clsx/classnames (conditional CSS)

**Storage**: Browser localStorage only (no backend API required for MVP)

**Testing**: 
- Jest for unit tests
- React Testing Library for component tests
- jest-axe for accessibility testing
- Playwright for E2E tests (optional)

**Target Platform**: Web browsers (desktop, tablet, mobile 320px+)

**Project Type**: Web application (single Next.js app)

**Performance Goals**: 
- LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals)
- Add expense form submit < 200ms feedback
- Filter operations < 100ms with up to 1000 expenses
- Initial load < 3s on 3G

**Constraints**: 
- localStorage quota (typically 5-10MB)
- No backend dependencies required
- Client-side only data persistence
- Modern browser requirement (ES2020+, localStorage support)

**Scale/Scope**: 
- MVP: 4 user stories (P1-P4)
- ~500-1000 expenses typical before localStorage full
- Single user (personal expenses only)
- 7 predefined expense categories
- 2-3 main page views (add/list/filter)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Component-Driven Architecture**: Modular components for form, table, filters, dialogs with clear separation
- [x] **Accessibility-First**: 8 AR requirements (WCAG 2.1 AA) + semantic HTML table + keyboard navigation
- [x] **Type Safety**: TypeScript strict mode, Zod validation schemas, typed Expense/Category entities
- [x] **Performance**: LCP/FID/CLS targets, lazy loading, code splitting via Next.js dynamic imports
- [x] **Test Coverage**: Unit (utilities, hooks), component (React Testing Library), accessibility (jest-axe)
- [x] **User Experience**: Toast feedback, empty states, form validation, responsive breakpoints (320/768/1024px)
- [x] **Security & Privacy**: Input sanitization (Zod), localStorage encoding, XSS prevention via React

**Gate Status**: ✅ **PASS** - All constitutional requirements addressed in design

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-management/
├── spec.md                    # Feature specification
├── plan.md                    # This file
├── research.md                # Technical research (if needed)
├── data-model.md              # Data structure documentation
├── contracts/                 # API/interface contracts
│   └── expense-schema.ts      # Zod/TypeScript interfaces
├── quickstart.md              # Developer quickstart
└── checklists/
    └── requirements.md        # Quality checklist
```

### Source Code (Next.js App Router Structure)

```text
app/
├── layout.tsx                           # Root layout with providers
├── page.tsx                             # Home page (expense list view)
├── (expense-routes)/
│   ├── add/page.tsx                     # Add expense page
│   └── layout.tsx                       # Expense routes layout
├── components/
│   ├── ui/
│   │   ├── Button.tsx                   # Reusable button component
│   │   ├── Input.tsx                    # Form input component
│   │   ├── Select.tsx                   # Category select component
│   │   ├── Dialog.tsx                   # Confirmation dialog
│   │   ├── Toast.tsx                    # Toast notification
│   │   └── Table.tsx                    # Expense table component
│   ├── features/
│   │   ├── ExpenseForm.tsx              # Add expense form
│   │   ├── ExpenseList.tsx              # List view (table)
│   │   ├── CategoryFilter.tsx           # Filter controls
│   │   ├── DeleteConfirmDialog.tsx      # Delete confirmation
│   │   └── EmptyState.tsx               # Empty state messages
│   └── layout/
│       ├── Header.tsx                   # App header
│       ├── Navigation.tsx               # Nav menu (if needed)
│       └── Footer.tsx                   # Footer (optional)
├── hooks/
│   ├── useExpenses.ts                   # Main expense management hook
│   ├── useLocalStorage.ts               # localStorage wrapper hook
│   ├── useToast.ts                      # Toast notification hook
│   ├── useForm.ts                       # Form state management
│   └── useFilter.ts                     # Filter state hook
├── actions/
│   └── expense.actions.ts               # Server actions (form submission, validation)
├── lib/
│   ├── constants.ts                     # Expense categories, defaults
│   ├── types.ts                         # TypeScript interfaces (Expense, Category)
│   ├── schemas.ts                       # Zod validation schemas
│   ├── utils.ts                         # Utility functions (format currency, sort, etc)
│   ├── storage.ts                       # localStorage helpers (encode/decode)
│   └── validation.ts                    # Input validation helpers
├── styles/
│   ├── globals.css                      # Global styles
│   └── accessibility.css                # WCAG compliance styles
└── __tests__/
    ├── unit/
    │   ├── utils.test.ts                # Utils tests
    │   ├── validation.test.ts           # Validation logic tests
    │   └── storage.test.ts              # localStorage helpers tests
    ├── components/
    │   ├── ExpenseForm.test.tsx         # Form component tests
    │   ├── ExpenseList.test.tsx         # List/table component tests
    │   ├── CategoryFilter.test.tsx      # Filter component tests
    │   └── ExpenseForm.a11y.test.tsx    # Accessibility tests (jest-axe)
    └── integration/
        └── expense-workflow.test.tsx    # E2E user flow tests

public/
├── favicon.ico
└── icons/
    ├── category-*.svg                   # Category icons
    └── action-icons.svg                 # Delete, filter icons

.env.example                              # Environment variables template
tsconfig.json                             # TypeScript config (strict mode)
next.config.ts                            # Next.js config
postcss.config.mjs                        # Tailwind CSS config
tailwind.config.ts                        # Tailwind theme config
```

**Structure Decision**: Next.js App Router with server components as default. Uses:
- **App directory** for routing and layouts
- **Server Components** for data fetching and rendering
- **Client Components** only where necessary (forms, interactive filters, toast management)
- **Server Actions** for form submission and validation
- **Custom hooks** for client-side state (expenses, filter, toast)
- **Tailwind + custom CSS** for styling (WCAG AA compliant)
- **TypeScript strict mode** for type safety
- **localStorage** for data persistence with JSON encoding
- **Feature-based organization** in components/ folder

## Implementation Phases

### Phase 1: Setup & Foundational

**Duration**: 1-2 days | **Blocker**: Yes (blocks all user stories)

Tasks:
- Project structure initialization (app router, tailwind config)
- TypeScript configuration (strict mode, path aliases)
- Shared type definitions (Expense, Category, validation schemas)
- Custom hooks for localStorage and state management (useExpenses, useLocalStorage)
- UI component library (Button, Input, Select, Dialog, Toast, Table)
- Global styling and WCAG compliance baseline
- Testing infrastructure (Jest, React Testing Library, jest-axe)
- Environment setup and constants file

**Deliverables**:
- Fully typed, structured project with reusable components
- localStorage integration with encode/decode for security
- Foundation for all user stories
- Test suite structure ready

### Phase 2: User Story 1 - Add New Expense (P1)

**Duration**: 2-3 days | **Dependency**: Phase 1 complete

Components:
- ExpenseForm.tsx (form with validation, optional description)
- Form state via useForm hook
- Server action for form submission with validation
- Toast notification for success/error feedback

Features:
- Required fields: amount, category
- Optional fields: description (max 200 chars), date (defaults to today)
- Client-side validation (Zod)
- localStorage persistence via useExpenses hook
- Toast feedback (3-5 sec) on success
- Error handling with clear messages

Testing:
- Form validation tests (required/optional fields, max length)
- localStorage write tests
- Toast notification tests
- Keyboard navigation and accessibility tests (jest-axe)

**Deliverables**:
- Functional add expense form
- Form validation working
- Data persists to localStorage
- User feedback via toast notifications
- P1 user story independently testable

### Phase 3: User Story 2 - View and Browse Expenses (P2)

**Duration**: 2-3 days | **Dependency**: Phase 1 + Phase 2

Components:
- ExpenseList.tsx (semantic table with thead/tbody/tr/th/td)
- Table accessibility with proper ARIA labels
- Empty state component for no data
- Server component for initial data load (from localStorage)

Features:
- Table display with columns: Amount, Description, Category, Date, Actions
- Semantic HTML (proper table structure)
- Date sorting (most recent first)
- Currency formatting (₹0.00)
- Empty state message
- Scrollable table with sticky header
- Loading states during fetch

Testing:
- Table rendering tests
- Sort functionality tests
- Empty state tests
- Accessibility tests (screen reader, semantic HTML)
- Responsive table tests (mobile vs desktop)

**Deliverables**:
- Accessible table display
- Proper data formatting
- Responsive design verified
- Empty states handled
- P2 user story independently testable

### Phase 4: User Story 3 - Filter by Category (P3)

**Duration**: 1-2 days | **Dependency**: Phase 2 complete

Components:
- CategoryFilter.tsx (filter control buttons/dropdown)
- useFilter hook for filter state
- Integration with ExpenseList for filtered display

Features:
- Category selection controls
- Clear filter button
- Visual indication of active filter
- Result count announcement (AR-008)
- Filter state persistence (optional)
- Real-time filtering (<100ms)

Testing:
- Filter state management tests
- Filter effect on list tests
- Empty results tests
- Accessibility announcement tests
- Performance tests (>1000 expenses)

**Deliverables**:
- Working category filter
- Performance targets met
- Accessibility verified
- P3 user story independently testable

### Phase 5: User Story 4 - Delete Expense (P4)

**Duration**: 1-2 days | **Dependency**: Phase 2 + Phase 3

Components:
- DeleteConfirmDialog.tsx (confirmation modal)
- Delete button in table actions
- Server action for delete operation

Features:
- Delete button with icon and aria-label
- Confirmation dialog (focus trap, Escape dismissible)
- Toast feedback on successful delete
- localStorage update on delete
- Last item deletes triggers empty state

Testing:
- Delete confirmation flow tests
- localStorage removal tests
- Toast feedback tests
- Dialog focus management tests
- Keyboard navigation tests

**Deliverables**:
- Delete functionality working
- Confirmation UX verified
- All 4 user stories independently functional

### Phase 6: Polish & Cross-Cutting Concerns

**Duration**: 1-2 days | **Dependency**: All user stories complete

Tasks:
- Full accessibility audit (WCAG 2.1 AA compliance verification)
- Performance optimization (Core Web Vitals targets)
- Security hardening (input sanitization, localStorage encoding)
- Documentation (README, component stories, API)
- Test coverage increase (edge cases, error scenarios)
- Browser compatibility testing
- Mobile responsiveness final verification

**Deliverables**:
- Complete, production-ready feature
- All accessibility requirements verified
- Performance targets confirmed
- Full test coverage
- Documentation complete

## Data Model

### Expense Entity
```typescript
interface Expense {
  id: string;                      // UUID, auto-generated
  amount: number;                  // Positive, max 2 decimals
  category: ExpenseCategory;       // Enum: Food | Transport | Entertainment | Shopping | Bills | Health | Other
  description?: string;            // Optional, max 200 chars
  date: Date;                      // Timestamp, defaults to today
  createdAt: Date;                 // Timestamp for internal tracking
}

type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Bills' | 'Health' | 'Other';
```

### Storage Format (localStorage)
```typescript
// Stored as JSON string with key: 'expenses-v1'
interface StorageFormat {
  version: number;                 // For migration tracking
  expenses: Expense[];             // Array of expense objects
  lastUpdated: string;             // ISO timestamp
}

// Data encoded before storage (prevent code injection): btoa(JSON.stringify(data))
```

## Key Architectural Decisions

1. **No Backend Required**: All data in browser localStorage. Simpler MVP, faster development.

2. **Server Components Default**: Pages and data-fetching components use Server Components. Client Components only for interactivity (forms, filters, dialogs).

3. **Server Actions for Forms**: Form submissions use Next.js Server Actions for validation and error handling. Keeps validation logic on server.

4. **TypeScript Strict Mode**: All code fully typed. Catch errors at compile time.

5. **Semantic HTML**: Tables use proper semantic structure (table/thead/tbody/th/td) for accessibility.

6. **Accessible from Start**: WCAG 2.1 AA compliance built-in (keyboard nav, ARIA labels, focus management, contrast).

7. **Custom Hooks for State**: useExpenses, useFilter, useToast manage component state. Custom hook approach is simpler than Context/Zustand for this app size.

8. **localStorage Encoding**: Data encoded with btoa() to prevent injection, decoded with atob() on retrieval.

9. **Form Validation with Zod**: Schema-based validation for type safety and clear error messages.

10. **Tailwind CSS**: Utility-first styling for rapid development and consistent design system.

## Testing Strategy

- **Unit Tests** (40%): Utilities, validation, storage helpers
- **Component Tests** (35%): ExpenseForm, ExpenseList, CategoryFilter, Dialogs
- **Accessibility Tests** (15%): jest-axe for WCAG compliance, keyboard navigation
- **Integration Tests** (10%): Full user workflows (add → view → filter → delete)

**Target Coverage**: 70%+ for critical business logic (expense CRUD)

## Success Metrics

✓ Users can add expense in <15s  
✓ 100% keyboard accessible  
✓ All Core Web Vitals targets met  
✓ 8 WCAG 2.1 AA requirements verified  
✓ 4 user stories independently deployable  
✓ localStorage quota error handled gracefully  
✓ Form validation prevents invalid data  

## Next Steps

1. ✅ Specification complete (spec.md)
2. ✅ Clarifications resolved (5 decisions documented)
3. ✅ Implementation plan complete (this file)
4. → Run `/speckit.tasks` to generate prioritized task list
5. → Begin Phase 1 setup tasks
6. → Implement user stories P1-P4 sequentially or in parallel (after Phase 1)


| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
