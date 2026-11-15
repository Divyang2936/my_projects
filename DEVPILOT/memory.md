# Project Change Log

This file keeps a chronological, easy-to-scan record of project changes.

## Contents

- [2026-11-14](#2026-11-14)
- [Adding future entries](#adding-future-entries)

## 2026-11-14

### Theme-toggle hydration error

**Problem:** The dropdown trigger and its nested `Button` both rendered a `<button>`, resulting in invalid HTML and a hydration error.

**Change:** Used `DropdownMenuTrigger`'s `render` prop to compose the `Button` without nesting buttons.

**Files:** `client/components/ui/mode-toggle.tsx`

**Checks:** ESLint and TypeScript checks passed.

### Theme provider not applied to the page

**Problem:** `ThemeProvider` had no children, so the page and theme toggle rendered outside it.

**Change:** Rendered the app content inside `ThemeProvider`, nested within `QueryProvider`.

**Files:** `client/app/layout.tsx`

**Checks:** ESLint and TypeScript checks passed.

## Adding future entries

Add each project change under its date, using the same structure:

1. **Problem** — what was wrong or requested.
2. **Change** — what was updated.
3. **Files** — the affected project files.
4. **Checks** — tests, builds, or other validation performed.
