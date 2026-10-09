
const STORAGE_KEY = 'todo-app-tasks';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('todo-empty');
const countLabel = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('todo-clear-completed');

let tasks = loadTasks();

// Load saved tasks from localStorage
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Display all tasks
function render() {
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    if (task.completed) {
      li.classList.add('completed');
    }

    // Checkbox to mark tasks complete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Task text
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = task.text;

    // NEW FEATURE: Edit task button
    const editBtn = document.createElement('button');
    editBtn.className = 'todo-edit';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.addEventListener('click', () => editTask(task.id));

    // Delete task button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '\u00d7';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, text, editBtn, deleteBtn);
    list.appendChild(li);
  });

  // Show message when there are no tasks
  emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';

  // Update remaining task count
  const remaining = tasks.filter(task => !task.completed).length;
  countLabel.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
}

// Add a new task
function addTask(text) {
  tasks.push({
    id: Date.now().toString(),
    text,
    completed: false
  });

  saveTasks();
  render();
}

// Mark task as complete or incomplete
function toggleTask(id) {
  const task = tasks.find(task => task.id === id);

  if (task) {
    task.completed = !task.completed;
  }

  saveTasks();
  render();
}

// NEW FEATURE: Edit an existing task
function editTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  const updatedText = prompt('Edit your task:', task.text);

  // Cancel editing if user clicks Cancel
  if (updatedText === null) return;

  const trimmedText = updatedText.trim();

  // Prevent empty task names
  if (!trimmedText) {
    alert('Task cannot be empty.');
    return;
  }

  task.text = trimmedText;

  saveTasks();
  render();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  render();
}

// Remove all completed tasks
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  render();
}

// Handle adding tasks through the form
form.addEventListener('submit', event => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  addTask(text);

  input.value = '';
  input.focus();
});

// Handle clearing completed tasks
clearCompletedBtn.addEventListener('click', clearCompleted);

// Display tasks when the page loads
render();
