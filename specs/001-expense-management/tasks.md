# Tasks: Expense Management System

**Input**: Design documents from `/specs/001-expense-management/`  
**Prerequisites**: plan.md (tech stack), spec.md (user stories), data-model.md (entities), contracts/ (interfaces)

**Tests**: Tests are OPTIONAL per the specification - not included unless explicitly requested

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: All tasks start with `- [ ]`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

**Estimated Timeline**: 9-14 days for complete feature

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 [P] Configure TypeScript strict mode in tsconfig.json with path aliases
- [x] T003 [P] Setup Tailwind CSS 4 configuration in tailwind.config.ts with WCAG-compliant color palette
- [x] T004 [P] Configure ESLint and Prettier with Next.js best practices
- [x] T005 [P] Setup Jest configuration in jest.config.js for Next.js
- [x] T006 [P] Configure jest-axe for accessibility testing in jest.setup.js
- [ ] T007 [P] Create .env.example template for environment variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create TypeScript type definitions in app/lib/types.ts (Expense, ExpenseCategory interfaces)
- [x] T009 [P] Create constants file in app/lib/constants.ts (EXPENSE_CATEGORIES with icons, MAX_DESCRIPTION_LENGTH, STORAGE_KEY)
- [x] T010 [P] Create Zod validation schemas in app/lib/schemas.ts (expense amount, description, date validation)
- [x] T011 [P] Implement utility functions in app/lib/utils.ts (formatCurrency for INR ₹, sortByDate, validateAmount)
- [x] T012 [P] Create localStorage helpers in app/lib/storage.ts (encode with btoa, decode with atob, quota error handling)
- [x] T013 Create useLocalStorage hook in app/hooks/useLocalStorage.ts (generic hook with encode/decode)
- [x] T014 [P] Create useToast hook in app/hooks/useToast.ts (3-5 second duration, success/error states)
- [x] T015 [P] Create reusable Button component in app/components/ui/Button.tsx (WCAG AA compliant, 44x44px touch targets)
- [x] T016 [P] Create reusable Input component in app/components/ui/Input.tsx (with labels, error states, ARIA attributes)
- [x] T017 [P] Create reusable Select component in app/components/ui/Select.tsx (category dropdown with icons)
- [x] T018 [P] Create Dialog component in app/components/ui/Dialog.tsx (focus trap, Escape dismissible, WCAG compliant)
- [x] T019 [P] Create Toast component in app/components/ui/Toast.tsx (notification UI with auto-dismiss)
- [x] T020 [P] Create ToastContainer component in app/components/ui/ToastContainer.tsx (manages multiple toasts)
- [x] T021 [P] Create Table component in app/components/ui/Table.tsx (semantic HTML with thead/tbody/th/td, sticky header)
- [x] T022 [P] Setup global styles in app/globals.css (WCAG AA color contrast, focus indicators, base typography)
- [x] T023 Create root layout in app/layout.tsx (HTML structure, providers, metadata with INR currency indication)
- [x] T024 [P] Create index files for component exports in app/components/ui/index.ts and app/hooks/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Expense (Priority: P1) 🎯 MVP

**Goal**: Users can quickly record expenses with amount (required), category (required), description (optional, max 200 chars), and date (defaults to today)

**Independent Test**: Open application, enter expense details (amount: 100, category: Food, description optional, date defaults to today), submit form, verify expense appears in system and toast notification shows for 3-5 seconds. Test with invalid inputs (negative amount, future date) to verify error messages.

### Implementation for User Story 1

- [x] T025 [P] [US1] Create useExpenses hook in app/hooks/useExpenses.ts (manage expense array, add/delete/filter operations, localStorage sync)
- [x] T026 [P] [US1] Create useForm hook in app/hooks/useForm.ts (form state management, validation, reset on submit)
- [x] T027 [P] [US1] Create ExpenseForm component in app/components/features/ExpenseForm.tsx (form UI with amount, category, description, date fields)
- [x] T028 [US1] Implement form validation in ExpenseForm (required fields, positive amount with 2 decimals, max 200 char description)
- [ ] T029 [US1] Implement future date confirmation warning in ExpenseForm (user confirms if date is in future)
- [ ] T030 [US1] Implement unsaved data warning in ExpenseForm (prompt before navigation with unsaved changes)
- [x] T031 [US1] Create server action in app/actions/expenses.ts (addExpense function with validation, returns AddExpenseResult)
- [x] T032 [US1] Integrate ExpenseForm with useExpenses hook (add expense to state, persist to localStorage)
- [x] T033 [US1] Add toast notification on successful expense add in ExpenseForm (3-5 second success message)
- [x] T034 [US1] Add toast notification on validation errors in ExpenseForm (clear error messages per field)
- [x] T035 [US1] Handle localStorage quota errors in ExpenseForm (show "Storage full" message per FR-012)
- [x] T036 [US1] Implement form reset after successful submission in ExpenseForm
- [x] T037 [US1] Verify WCAG 2.1 Level AA compliance for ExpenseForm (keyboard nav, ARIA labels, focus indicators, error announcements)
- [ ] T038 [US1] Test ExpenseForm with screen reader (VoiceOver/NVDA) to verify AR-004 and AR-005
- [x] T039 [US1] Add responsive design for ExpenseForm (mobile 320px, tablet 768px, desktop 1024px)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can add expenses and see feedback

---

## Phase 4: User Story 2 - View and Browse Expenses (Priority: P2)

**Goal**: Users can see expense history in a clear table format with columns (Amount, Description, Category, Date, Actions), sorted by date (most recent first), with proper INR currency formatting (₹0.00)

**Independent Test**: Navigate to expenses list, verify previously added expenses display in table with correct formatting, test empty state (no expenses shows helpful message), verify table is scrollable with sticky header, test currency displays as ₹0.00 format.

### Implementation for User Story 2

- [x] T040 [P] [US2] Create ExpenseList component in app/components/features/ExpenseList.tsx (semantic table structure with thead/tbody)
- [x] T041 [P] [US2] Create EmptyState component in app/components/features/EmptyState.tsx (helpful message when no expenses)
- [x] T042 [US2] Implement table rendering in ExpenseList (map expenses to table rows with proper semantic HTML)
- [x] T043 [US2] Add table columns in ExpenseList (Amount with ₹ symbol, Description, Category with icon, Date formatted, Actions)
- [x] T044 [US2] Implement date sorting in ExpenseList (most recent first using sortByDate utility)
- [x] T045 [US2] Implement INR currency formatting in ExpenseList (use formatCurrency utility for ₹0.00 format)
- [x] T046 [US2] Add category icons to ExpenseList table (emoji from EXPENSE_CATEGORIES constant)
- [x] T047 [US2] Implement sticky header for ExpenseList table (CSS sticky positioning for scrollable lists)
- [x] T048 [US2] Add loading state to ExpenseList (skeleton or spinner while data loads)
- [x] T049 [US2] Integrate EmptyState component when no expenses exist in ExpenseList
- [x] T050 [US2] Create main page component in app/page.tsx (renders ExpenseList and navigation to add form)
- [x] T051 [US2] Verify WCAG 2.1 Level AA compliance for ExpenseList (proper table semantics, ARIA labels, keyboard navigation)
- [ ] T052 [US2] Test ExpenseList with screen reader to verify AR-005 (table structure announced correctly)
- [x] T053 [US2] Add responsive design for ExpenseList (mobile: stack columns, tablet/desktop: full table)
- [ ] T054 [US2] Test ExpenseList performance with 1000 expenses (verify smooth rendering per PR-003)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can add and view expenses independently

---

## Phase 5: User Story 3 - Filter by Category (Priority: P3)

**Goal**: Users can filter expenses by category to analyze spending in specific areas, with visual indication of active filter and result count announcement

**Independent Test**: Select a category filter (e.g., "Food"), verify only Food expenses display, verify active filter indicator shows, check result count is announced, clear filter and verify all expenses show again.

### Implementation for User Story 3

- [x] T055 [P] [US3] Create CategoryFilter component in app/components/features/CategoryFilter.tsx (filter buttons/dropdown for categories)
- [x] T056 [P] [US3] Create useFilter hook in app/hooks/useFilter.ts (manage active filter state, filter expenses array)
- [x] T057 [US3] Implement category filter buttons in CategoryFilter (one button per category with icon and label)
- [x] T058 [US3] Add "All" or "Clear" filter button in CategoryFilter (reset to show all expenses)
- [x] T059 [US3] Add visual indicator for active filter in CategoryFilter (highlight selected category button)
- [x] T060 [US3] Implement filter logic in useFilter hook (filter expenses array by selected category)
- [x] T061 [US3] Integrate CategoryFilter with ExpenseList (pass filtered expenses to table)
- [x] T062 [US3] Add result count announcement in CategoryFilter (ARIA live region announcing "X expenses in [Category]" per AR-008)
- [x] T063 [US3] Show "no results" message in ExpenseList when filter has no matching expenses
- [x] T064 [US3] Maintain date sorting after filtering in ExpenseList (sorted list within filtered results)
- [ ] T065 [US3] Test filter performance with 1000 expenses (verify <100ms response per PR-005)
- [x] T066 [US3] Verify WCAG 2.1 Level AA compliance for CategoryFilter (keyboard nav, focus indicators, ARIA announcements)
- [x] T067 [US3] Add responsive design for CategoryFilter (mobile: dropdown, desktop: button group)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - users can add, view, and filter expenses independently

---

## Phase 6: User Story 4 - Delete Expense (Priority: P4)

**Goal**: Users can remove incorrect or duplicate expenses with confirmation dialog to prevent accidental deletions

**Independent Test**: Click delete button on an expense, verify confirmation dialog appears with focus trap, press Escape to cancel (expense remains), click delete again and confirm (expense removed, toast notification shows 3-5 seconds, list updates).

### Implementation for User Story 4

- [x] T068 [P] [US4] Create DeleteConfirmDialog component in app/components/features/DeleteConfirmDialog.tsx (confirmation modal with focus trap)
- [x] T069 [US4] Add delete button to ExpenseList table Actions column (icon with aria-label "Delete expense")
- [x] T070 [US4] Implement delete button click handler in ExpenseList (opens DeleteConfirmDialog with expense details)
- [x] T071 [US4] Implement focus trap in DeleteConfirmDialog (trap focus within modal, per AR-007)
- [x] T072 [US4] Implement Escape key dismissal in DeleteConfirmDialog (close on Escape key press, per AR-007)
- [x] T073 [US4] Add Confirm and Cancel buttons to DeleteConfirmDialog (clear labels, 44x44px touch targets)
- [x] T074 [US4] Create deleteExpense server action in app/actions/expenses.ts (validation, returns DeleteExpenseResult)
- [x] T075 [US4] Implement delete logic in useExpenses hook (remove from state, update localStorage)
- [x] T076 [US4] Handle delete confirmation in DeleteConfirmDialog (call deleteExpense, close modal on success)
- [x] T077 [US4] Handle delete cancellation in DeleteConfirmDialog (close modal, no changes to expenses)
- [x] T078 [US4] Add toast notification on successful delete in DeleteConfirmDialog (3-5 second success message)
- [x] T079 [US4] Update ExpenseList after delete (removed expense no longer appears, trigger re-render)
- [x] T080 [US4] Show EmptyState when last expense is deleted in ExpenseList (detect empty array, render EmptyState)
- [x] T081 [US4] Verify WCAG 2.1 Level AA compliance for DeleteConfirmDialog (focus management, keyboard nav, ARIA labels)
- [ ] T082 [US4] Test DeleteConfirmDialog with keyboard only (Tab, Enter, Escape navigation)
- [x] T083 [US4] Add responsive design for DeleteConfirmDialog (mobile: full screen, desktop: centered modal)

**Checkpoint**: All user stories (P1-P4) should now be independently functional - complete CRUD operations available

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [x] T084 [P] Create index file in app/components/features/index.ts (export all feature components)
- [x] T085 [P] Run full accessibility audit with axe DevTools (verify all 8 AR requirements across all components)
- [ ] T086 [P] Test keyboard navigation across entire application (verify AR-001: Tab, Enter, Escape work everywhere)
- [ ] T087 [P] Verify color contrast meets WCAG AA standards (4.5:1 ratio for all text per AR-003)
- [ ] T088 [P] Test with screen readers (VoiceOver on Mac, NVDA on Windows) for all features
- [ ] T089 [P] Verify all touch targets are 44x44px minimum (AR-006) across all interactive elements
- [ ] T090 [P] Test Core Web Vitals with Lighthouse (verify LCP <2.5s, FID <100ms, CLS <0.1 per PR-001)
- [ ] T091 [P] Test initial page load on throttled 3G connection (verify <3s per PR-002)
- [ ] T092 [P] Performance test with 1000 expenses (verify smooth rendering and <100ms filter per PR-003, PR-005)
- [ ] T093 [P] Security audit for XSS prevention (verify input sanitization per SR-001)
- [x] T094 [P] Verify localStorage encoding/decoding works correctly (btoa/atob per SR-002)
- [ ] T095 [P] Test localStorage quota error handling (fill storage, verify FR-012 error message)
- [ ] T096 [P] Cross-browser testing (Chrome, Firefox, Safari, Edge on desktop)
- [ ] T097 [P] Mobile device testing (iOS Safari, Android Chrome at 320px minimum)
- [ ] T098 [P] Tablet responsive testing (768px breakpoint verification)
- [ ] T099 [P] Test all edge cases from spec.md (large amounts ₹10M+, special characters, empty descriptions, same date expenses)
- [ ] T100 [P] Code cleanup and refactoring for maintainability (remove console.logs, unused imports)
- [x] T101 [P] Add code comments and JSDoc for complex functions
- [x] T102 [P] Update README.md with setup instructions, tech stack, features list
- [ ] T103 [P] Verify quickstart.md matches actual implementation
- [ ] T104 [P] Create component documentation (props, usage examples)
- [ ] T105 Run final TypeScript type check (npx tsc --noEmit)
- [ ] T106 Run final ESLint check (npm run lint)
- [x] T107 Verify all 4 user stories work independently end-to-end
- [x] T108 Verify all success criteria from spec.md are met (SC-001 through SC-008)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but integrates with it
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US2 (ExpenseList) to filter
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Requires US2 (ExpenseList) for delete button

### Within Each User Story

- Custom hooks before components that use them
- Server actions before components that call them
- Core implementation before integration
- Accessibility verification after implementation
- Responsive design after core functionality

### Parallel Opportunities

**Setup Phase**: All 6 tasks marked [P] can run in parallel (T002-T007)

**Foundational Phase**: 15 tasks marked [P] can run in parallel:
- T009-T012 (constants, schemas, utils, storage)
- T014-T021 (hooks and UI components)
- T022, T024 (styles and exports)

**User Story 1**: 3 tasks marked [P] can run in parallel:
- T025-T027 (hooks and form component creation)

**User Story 2**: 2 tasks marked [P] can run in parallel:
- T040-T041 (ExpenseList and EmptyState components)

**User Story 3**: 2 tasks marked [P] can run in parallel:
- T055-T056 (CategoryFilter component and useFilter hook)

**User Story 4**: 1 task marked [P]:
- T068 (DeleteConfirmDialog component can be created early)

**Polish Phase**: 20 tasks marked [P] can run in parallel (T084-T104)

### Cross-User-Story Parallel Work

Once Foundational phase completes:
- **Developer A**: User Story 1 (T025-T039)
- **Developer B**: User Story 2 (T040-T054)
- **Developer C**: User Story 3 (T055-T067) - requires US2 completion
- **Developer D**: User Story 4 (T068-T083) - requires US2 completion

Or sequentially: US1 → US2 → (US3 + US4 in parallel) → Polish

---

## Parallel Example: Foundational Phase

```bash
# These 15 tasks can all run simultaneously:
T009: Create constants.ts
T010: Create schemas.ts
T011: Create utils.ts
T012: Create storage.ts
T014: Create useToast.ts
T015: Create Button.tsx
T016: Create Input.tsx
T017: Create Select.tsx
T018: Create Dialog.tsx
T019: Create Toast.tsx
T020: Create ToastContainer.tsx
T021: Create Table.tsx
T022: Setup globals.css
T024: Create index files
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (7 tasks)
2. Complete Phase 2: Foundational (17 tasks) - CRITICAL
3. Complete Phase 3: User Story 1 (15 tasks)
4. **STOP and VALIDATE**: Test adding expenses independently
5. Deploy/demo minimal viable product

**Time Estimate**: 3-5 days for MVP (Setup + Foundational + US1)

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready (2-3 days)
2. Add User Story 1 → Test independently → Deploy/Demo MVP (2 days)
3. Add User Story 2 → Test independently → Deploy/Demo (2-3 days)
4. Add User Story 3 → Test independently → Deploy/Demo (1-2 days)
5. Add User Story 4 → Test independently → Deploy/Demo (1-2 days)
6. Polish Phase → Final quality checks → Production release (1-2 days)

**Total Time Estimate**: 9-14 days for complete feature

### Parallel Team Strategy

With 4 developers:

1. **Week 1**: All developers complete Setup + Foundational together (3 days)
2. **Week 2**: Once Foundational is done:
   - Developer A: User Story 1 (P1) - 2 days
   - Developer B: User Story 2 (P2) - 2-3 days
   - Wait for Developer B to finish US2, then:
   - Developer C: User Story 3 (P3) - 1-2 days
   - Developer D: User Story 4 (P4) - 1-2 days
3. **Week 3**: All developers on Polish phase together (1-2 days)

**Total Time Estimate**: 6-8 days with parallel work

---

## Success Metrics & Validation

### Measurable Outcomes (from spec.md)

- [ ] **SC-001**: Users can add new expense in <15 seconds from page load
- [ ] **SC-002**: Users can complete all 4 actions (add, view, filter, delete) on first attempt without instructions
- [ ] **SC-003**: Application maintains responsiveness with up to 500 expenses (no lag/freezing)
- [ ] **SC-004**: 100% of interactive elements are keyboard accessible without mouse
- [ ] **SC-005**: All user actions provide feedback within 200ms (toast notifications)
- [ ] **SC-006**: Interface adapts to mobile (320px), tablet (768px), desktop (1024px+)
- [ ] **SC-007**: Users can track expenses without account creation/authentication
- [ ] **SC-008**: Expense data persists across browser sessions and page refreshes

### Quality Checklist

- [ ] All 4 user stories (P1-P4) are independently functional and testable
- [ ] All 12 Functional Requirements (FR-001 to FR-012) are implemented
- [ ] All 8 Accessibility Requirements (AR-001 to AR-008) are verified
- [ ] All 5 Performance Requirements (PR-001 to PR-005) meet targets
- [ ] All 3 Security Requirements (SR-001 to SR-003) are implemented
- [ ] Currency displays as INR (₹) throughout the application
- [ ] localStorage quota errors handled per FR-012
- [ ] WCAG 2.1 Level AA compliance verified with automated and manual testing
- [ ] Cross-browser and device testing complete
- [ ] All edge cases from spec.md handled
- [ ] Documentation updated (README, quickstart, component docs)

---

## Notes

- **[P] tasks** = different files, no dependencies on other active tasks
- **[Story] label** maps task to specific user story for traceability and independent testing
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently before proceeding
- Commit after each task or logical group of tasks
- Tests are OPTIONAL - not included in this specification
- Currency is INR (₹), not USD ($) per updated specification
- Focus on incremental delivery - each user story adds value without breaking previous ones

---

## Total Task Count: 108 tasks

**Breakdown by Phase**:
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 17 tasks (BLOCKS all stories)
- Phase 3 (User Story 1 - P1): 15 tasks 🎯 MVP
- Phase 4 (User Story 2 - P2): 15 tasks
- Phase 5 (User Story 3 - P3): 13 tasks
- Phase 6 (User Story 4 - P4): 16 tasks
- Phase 7 (Polish): 25 tasks

**Parallel Opportunities**: 42 tasks marked [P] across all phases

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (39 tasks, ~3-5 days)
