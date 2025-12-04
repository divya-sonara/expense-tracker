#!/bin/bash
# Quick Phase 1 Update Script

cd "$(dirname "$0")" || exit 1

# Backup original file
cp specs/001-expense-management/tasks.md specs/001-expense-management/tasks.md.bak

# Mark all Phase 1 tasks as complete
sed -i 's/^- \[ \] (\*\*T1\.\([0-9]*\)\*\*)/- [x] **T1.\1** ✅/g' specs/001-expense-management/tasks.md

# Mark T1.21 sub-tasks as complete
sed -i '/^  - \[ \] Component-Driven/s/\[ \]/[x]/' specs/001-expense-management/tasks.md
sed -i '/^  - \[ \] Accessibility-First/s/\[ \]/[x]/' specs/001-expense-management/tasks.md
sed -i '/^  - \[ \] Type Safety/s/\[ \]/[x]/' specs/001-expense-management/tasks.md
sed -i '/^  - \[ \] Performance:/s/\[ \]/[x]/' specs/001-expense-management/tasks.md
sed -i '/^  - \[ \] Test Coverage/s/\[ \]/[x]/' specs/001-expense-management/tasks.md
sed -i '/^  - \[ \] UX Excellence/s/\[ \]/[x]/' specs/001-expense-management/tasks.md
sed -i '/^  - \[ \] Security:/s/\[ \]/[x]/' specs/001-expense-management/tasks.md

echo "✅ Phase 1 tasks marked as complete"
