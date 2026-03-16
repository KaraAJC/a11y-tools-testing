# Claude Chat with frontend-a11y skill

the frontend-a11y skill is created by mikemai2awesome, along a set of skills he uses to do his daily work. I had to download the collection from , then upload the skill, then ask claude's skill creator to help me add the references folderset of files...

## Instructions given

### Build

Using my "frontend-a11y" skill,  Build a Todo list website that allows a person to add todos one at a time, edit their todos inline, and delete their todos. A todo can also have a priority status of now, this week, or later. todos can be sorted by priority status (now to this week, to later)

### response

Here's your accessible todo list! Here's what's built in, following the a11y skill:
Native semantics, no ARIA theater — uses a real <ol> for the task list, native <button> elements (not divs), and a live region (role="alert") that announces adds, edits, and deletes to screen readers.
Features:

Add a task with a name and priority (Now / This week / Later), then press Enter or click Add
Inline edit — click the pencil icon to edit both the text and priority without leaving the list; save with the checkmark or Enter, cancel with Escape
Delete — trash icon with a hover danger state; screen readers hear the task name in the label
Sort — toggle between date added and priority order (Now → This week → Later)
Color-coded priority badges that adapt to dark mode automatically

Focus management is handled natively — the edit input receives focus automatically, and the add input returns focus after submission.
### Export Code

export the code for this todo list website

### Response

Saved! The file is a fully self-contained HTML page — no external dependencies — with light and dark mode support baked in. You can open it directly in any browser.
