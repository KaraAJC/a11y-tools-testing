# Todo List Website — Design Spec

**Date:** 2026-03-16
**Status:** Approved (v2 — spec review fixes applied)

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
let todos = [];          // [{ id: number, text: string, priority: 'now' | 'this-week' | 'later' }]
let sortEnabled = false;
let editingId = null;    // number | null — the id of the todo currently being edited, or null
let nextId = 1;          // incrementing counter for new todo ids
```

- `id`: integer, assigned from `nextId` at creation time
- `priority`: one of `"now"`, `"this-week"`, `"later"`
- Sort order (when enabled): `now → this-week → later`
- Underlying array stays in insertion order; sort is applied only during render
- `editingId` is set when the pencil button is clicked and cleared after save or cancel

---

## HTML Structure

```
<body>                          ← gradient background
  <main>                        ← centered glass-morphism card
    <h1>My Todos</h1>

    <form id="add-form">
      <label for="new-todo-input">New todo</label>
      <input id="new-todo-input" type="text" required>
      <label for="new-todo-priority">Priority</label>
      <select id="new-todo-priority">
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
- Browser `required` validation blocks empty submission — no custom error UI needed
- Duplicate text is allowed (todos are distinguished by `id`, not text)
- Todo text is trimmed of leading/trailing whitespace before saving
- New todo pushed to `todos`, `render()` called
- Live region announces "Added: [text]"
- Input cleared, focus stays on text input

### Edit
- Click pencil button → `editingId` set, `render()` called; focus moves to the inline input
- `<span>` replaced with a pre-filled `<input>` + explicit **Save** and **Cancel** buttons
- **Save** button click or Enter keypress → saves, clears `editingId`, re-renders, announces "Updated: [text]"
- **Cancel** button click or Escape keypress → cancels, clears `editingId`, re-renders, focus returns to pencil button
- **Blur does NOT save** — blur is ignored so that clicking Cancel works without triggering a save first
- If the user clears the input and attempts to save (Enter or Save button), the edit is rejected and the input receives focus with an `aria-describedby` error message: "Todo text cannot be empty." The edit field stays open.
- No character limit; long text wraps within the `<li>`; `aria-label` values use the full text (acceptable for typical todo lengths)

### Change Priority
- Click priority badge → badge replaced with inline `<select>` at current value; focus moves to the `<select>`
- `change` event → saves immediately, re-renders, announces "Priority changed to [label]" (using human-readable label, not the value key)
- Escape → cancels without saving; focus returns to the priority badge button
- Blur (tab away without changing value) → cancels without saving; treated the same as Escape

### Delete
- Click ✕ → item removed from `todos`, re-renders
- Focus moves to: next item's delete button → previous item's delete button → add input (if list is empty)
- Announces "Deleted: [text]"

### Sort Toggle
- `aria-pressed` toggled between `"true"` and `"false"`
- When enabled: list rendered in `now → this-week → later` order; announces "Sorted by priority"
- When disabled: original insertion order restored; announces "Original order restored"

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
- Priority badge `aria-label` includes the **current priority value**: "Change priority for [text], currently [priority]"
- Icon-only buttons (`✏`, `✕`) wrap their text in `<span aria-hidden="true">` for AT robustness
- After a successful edit save, focus returns to the pencil button of the saved todo item (same as cancel)
- `role="status"` live region announces all state changes (add, edit, delete, priority change, sort toggle)
- Focus managed explicitly on delete (returns to next/previous item or add input)
- Focus set to inline edit input when edit mode activates; returns to pencil button on cancel
- Sort button uses `aria-pressed` for toggle state
- `sr-only` class for visually-hidden live region
- Visible `<label>` elements for all form inputs in the add form (not aria-label-only)
- Inline edit empty-text error message associated via `aria-describedby`

---

## Visual Style

- `<body>`: gradient background (`#667eea → #764ba2`)
- `<main>`: glass-morphism card (`rgba(255,255,255,0.15)`, `backdrop-filter: blur`)
- Priority badge colors (text on badge background must meet 4.5:1):
  - Now: `#ff6b6b` background, white text (`#ffffff`) — verify contrast at implementation
  - This Week: `#ffd93d` background — **use dark text `#1a1a00`** (not white; yellow + white fails 4.5:1)
  - Later: `#6bcb77` background, white text (`#ffffff`) — verify contrast at implementation
- Badge text is also the label (e.g., "NOW", "THIS WEEK", "LATER") — never color alone
- The glass-morphism card background is semi-transparent; badges must be verified against their actual rendered background, not just the badge color in isolation
- All colors must be verified against WCAG AA (4.5:1 for text, 3:1 for UI components) at implementation time using a contrast checker

---

## Out of Scope

- Persistence (localStorage, server)
- Completed/done state on todos
- Multiple lists or categories
- Drag-and-drop reordering
- Due dates
