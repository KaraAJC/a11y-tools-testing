const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const priorityInput = document.getElementById("priority-input");
const todoList = document.getElementById("todo-list");
const sortButton = document.getElementById("sort-priority");
const todoCount = document.getElementById("todo-count");

const priorityOrder = {
  now: 0,
  "this week": 1,
  later: 2,
};

/** @type {{ id: string, text: string, priority: "now" | "this week" | "later" }[]} */
let todos = [];

function updateCount() {
  const count = todos.length;
  todoCount.textContent = `${count} todo${count === 1 ? "" : "s"}`;
}

function getPriorityClass(priority) {
  if (priority === "now") return "priority-now";
  if (priority === "this week") return "priority-this-week";
  return "priority-later";
}

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.dataset.id = todo.id;

  const main = document.createElement("div");
  main.className = "todo-main";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "todo-text";
  textInput.value = todo.text;
  textInput.readOnly = true;
  textInput.setAttribute("aria-label", "Todo text");

  const chip = document.createElement("span");
  chip.className = `priority-chip ${getPriorityClass(todo.priority)}`;
  chip.textContent = todo.priority;

  main.append(textInput, chip);

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const prioritySelect = document.createElement("select");
  prioritySelect.className = "btn small ghost";
  prioritySelect.setAttribute("aria-label", "Change todo priority");

  ["now", "this week", "later"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    if (priority === todo.priority) option.selected = true;
    prioritySelect.appendChild(option);
  });

  prioritySelect.addEventListener("change", (event) => {
    todo.priority = event.target.value;
    chip.className = `priority-chip ${getPriorityClass(todo.priority)}`;
    chip.textContent = todo.priority;
  });

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "btn small ghost";
  editButton.textContent = "Edit";

  editButton.addEventListener("click", () => {
    if (textInput.readOnly) {
      textInput.readOnly = false;
      textInput.focus();
      textInput.setSelectionRange(textInput.value.length, textInput.value.length);
      editButton.textContent = "Save";
      return;
    }

    const updatedText = textInput.value.trim();
    if (!updatedText) {
      textInput.value = todo.text;
    } else {
      todo.text = updatedText;
      textInput.value = updatedText;
    }

    textInput.readOnly = true;
    editButton.textContent = "Edit";
  });

  textInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || textInput.readOnly) return;
    event.preventDefault();
    editButton.click();
  });

  textInput.addEventListener("blur", () => {
    if (!textInput.readOnly) editButton.click();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn small warn";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", () => {
    todos = todos.filter((entry) => entry.id !== todo.id);
    item.remove();
    updateCount();
  });

  actions.append(prioritySelect, editButton, deleteButton);
  item.append(main, actions);
  return item;
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    todoList.appendChild(createTodoItem(todo));
  });
  updateCount();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  const todo = {
    id: crypto.randomUUID(),
    text,
    priority: priorityInput.value,
  };

  todos.push(todo);
  todoList.appendChild(createTodoItem(todo));
  updateCount();

  form.reset();
  priorityInput.value = "now";
  todoInput.focus();
});

sortButton.addEventListener("click", () => {
  todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTodos();
});

updateCount();
