# Todo List Website — Design Spec

**Date:** 2026-03-16

## Overview

A single self-contained `index.html` file implementing a todo list app. No dependencies, no build step, no persistence (state resets on page reload).

## Visual Style

Dark & Bold: dark background with vivid priority-colored accents. High contrast, modern feel.

## Architecture

### File

Single file: `index.html` containing all HTML, CSS, and JavaScript inline.

### Data Model

Each todo is a plain object:

```js
{ id, text, priority, createdAt }
```

- `id` — unique identifier (incrementing integer)
- `text` — the todo string
- `priority` — one of `'now'`, `'this-week'`, `'later'`
- `createdAt` — insertion timestamp (used for stable ordering when sort is off)

### State

Two variables drive all rendering:

- `todos` — array of todo objects
- `sortByPriority` — boolean, default `false`

Every mutation calls a single `render()` function that rebuilds the list from these two variables.

## UI Structure

### Header

- App title
- "Sort by Priority" toggle button — flips `sortByPriority`. Label reflects current state (e.g., "Sort by Priority" when off, "Remove Sort" when on).

### Add Form

- Text input for the todo
- Priority selector: three options — **Now**, **This Week**, **Later** (default: Now)
- Add button

### Todo List

Each item contains:

- **Todo text** — clicking enters inline edit mode (text becomes an `<input>` pre-filled with current text)
- **Priority badge** — clicking cycles: Now → This Week → Later → Now
- **Delete button** — removes the item immediately, no confirmation

### Empty State

When no todos exist: display a subtle message — "No todos yet — add one above."

## Interactions & Edge Cases

| Action | Behavior |
|---|---|
| Add with empty input | No-op (button/enter does nothing) |
| Add with whitespace-only input | Trimmed — treated as empty, no-op |
| Inline edit — save empty text | Cancels edit, keeps original text |
| Inline edit — press Enter | Saves and exits edit mode |
| Inline edit — press Escape | Cancels edit, keeps original text |
| Inline edit — blur (click away) | Saves and exits edit mode |
| Delete | Immediate removal, no confirmation |
| Priority badge click | Cycles Now → This Week → Later → Now |
| Sort toggle on | List renders: Now → This Week → Later |
| Sort toggle off | List renders in original insertion order |

## Priority Color Coding

| Priority | Color |
|---|---|
| Now | Red/pink accent |
| This Week | Yellow/amber accent |
| Later | Green accent |
