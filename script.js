document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
});

let currentFilter = "all";

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  input.value = "";
  renderTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  const tasks = getTasks();

  const filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.onclick = () => toggleComplete(task.id);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.className = "edit";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function toggleComplete(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
  }
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

function editTask(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Edit your task:", task.text);
  if (newText && newText.trim()) {
    task.text = newText.trim();
    saveTasks(tasks);
    renderTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-group button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`filter-${filter}`).classList.add("active");
  renderTasks();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const themeBtn = document.getElementById("theme-toggle");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

function loadTasks() {
  if (!localStorage.getItem("tasks")) {
    saveTasks([]);
  }
}
