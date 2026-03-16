# Todo List Website — Design Spec

**Date:** 2026-03-16
**Status:** Approved

---

## Overview

A single self-contained HTML file implementing a Todo list with add, inline-edit, delete, and priority management. Session-only (no persistence). Bold & Colorful visual style with a gradient background and glass-morphism card. Accessibility-first throughout.

---

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Persistence | Session only | Simpler; no localStorage needed |
| Tech stack | Single HTML file (vanilla JS) | No build step, self-contained, easy to audit |
| Visual style | Bold & Colorful | Gradient background, glass-morphism card, bright priority labels |
| Priority UX | Dropdown on add form; badge click reveals inline select | Explicit and accessible |
| Edit trigger | Pencil icon button | Natively keyboard-focusable; screen-reader-discoverable |
| State approach | `todos` array + `render()` function | Clean separation of state and UI without external dependencies |

---

## Data Model

```js
let todos = [];       // [{ id: number, text: string, priority: 'now' | 'this-week' | 'later' }]
let sortEnabled = false;
```

- `id`: incrementing integer
- `priority`: one of `"now"`, `"this-week"`, `"later"`
- Sort order (when enabled): `now → this-week → later`
- Underlying array stays in insertion order; sort is applied only during render

---

## HTML Structure

```
<body>                          ← gradient background
  <main>                        ← centered glass-morphism card
    <h1>My Todos</h1>

    <form id="add-form">
      <input type="text" aria-label="New todo text" required>
      <select aria-label="Priority">
        <option value="now">Now</option>
        <option value="this-week">This Week</option>
        <option value="later" selected>Later</option>
      </select>
      <button type="submit">Add</button>
    </form>

    <button id="sort-btn" aria-pressed="false">Sort by Priority</button>

    <div role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>

    <ul id="todo-list" aria-label="Todo items"></ul>
  </main>
</body>
```

### Each Todo Item (`<li>`)

```html
<li>
  <span class="todo-text">Buy groceries</span>
  <button aria-label="Change priority for Buy groceries">
    <span aria-hidden="true">NOW</span>
  </button>
  <button aria-label="Edit Buy groceries">✏</button>
  <button aria-label="Delete Buy groceries">✕</button>
</li>
```

When editing, the `<span>` is replaced with a pre-filled `<input>` + Save/Cancel buttons.
When changing priority, the badge button is replaced with an inline `<select>`.

---

## Interactions

### Add
- User types text, selects priority from dropdown, submits form
- New todo pushed to `todos`, `render()` called
- Live region announces "Added: [text]"
- Input cleared, focus stays on text input

### Edit
- Click pencil button → `editingId` set, `render()` called
- `<span>` replaced with pre-filled `<input>` + Save/Cancel buttons
- Enter or blur → saves, clears `editingId`, re-renders, announces "Updated: [text]"
- Escape → cancels, re-renders, focus returns to pencil button

### Change Priority
- Click priority badge → badge replaced with inline `<select>` at current value
- `change` event → saves immediately, re-renders, announces "Priority changed to [value]"
- Escape → cancels without saving

### Delete
- Click ✕ → item removed from `todos`, re-renders
- Focus moves to: next item's delete button → previous item's delete button → add input
- Announces "Deleted: [text]"

### Sort Toggle
- `aria-pressed` toggled between `"true"` and `"false"`
- When enabled: list rendered in `now → this-week → later` order
- When disabled: original insertion order

---

## Render Function

`render()`:
1. Clears `#todo-list` innerHTML
2. Applies sort if `sortEnabled`
3. For each todo, builds `<li>` with full button set
4. If `editingId` matches a todo, renders inline edit input instead of text span
5. All `aria-label` values include the current `todo.text`

---

## Accessibility Requirements

- Semantic HTML (`<ul>`, `<li>`, `<button>`, `<form>`, `<main>`, `<h1>`)
- One `<h1>` on the page; no skipped heading levels
- Every interactive element keyboard-accessible natively (no `tabindex` hacks)
- Priority badge conveys label in text AND color — never color alone
- All buttons have descriptive `aria-label` values that include todo text
- `role="status"` live region announces all state changes (add, edit, delete, priority change)
- Focus managed explicitly on delete (returns to next/previous item or add input)
- Focus set to inline edit input when edit mode activates
- Sort button uses `aria-pressed` for toggle state
- `sr-only` class for visually-hidden live region

---

## Visual Style

- `<body>`: gradient background (`#667eea → #764ba2`)
- `<main>`: glass-morphism card (`rgba(255,255,255,0.15)`, `backdrop-filter: blur`)
- Priority badge colors:
  - Now: `#ff6b6b` (red)
  - This Week: `#ffd93d` (yellow, dark text for contrast)
  - Later: `#6bcb77` (green)
- All colors meet WCAG AA contrast requirements (4.5:1 for text, 3:1 for UI components)

---

## Out of Scope

- Persistence (localStorage, server)
- Completed/done state on todos
- Multiple lists or categories
- Drag-and-drop reordering
- Due dates
