// script.js

const taskList = document.getElementById('taskList');
let draggedItem = null;

// Initialize drag-and-drop functionality
const enableDragAndDrop = () => {
  const taskItems = document.querySelectorAll('.task-item');

  taskItems.forEach(item => {
    // When dragging starts
    item.addEventListener('dragstart', (e) => {
      draggedItem = e.target;
      e.target.style.opacity = '0.5';
    });

    // When dragging ends
    item.addEventListener('dragend', (e) => {
      e.target.style.opacity = '1';
      draggedItem = null;
    });

    // When dragged over a valid target
    item.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessary to allow dropping
      const closestTask = getClosestTask(e.clientY, item);
      if (closestTask && closestTask !== draggedItem) {
        taskList.insertBefore(draggedItem, closestTask.nextSibling || closestTask);
      }
    });

    // When the item is dropped
    item.addEventListener('drop', () => {
      saveTaskOrder();
    });
  });
};

// Helper: Get the closest task to the dragged position
const getClosestTask = (y, currentTask) => {
  const tasks = Array.from(taskList.children);
  return tasks.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

// Save the new task order in localStorage
const saveTaskOrder = () => {
  const newOrder = Array.from(taskList.children).map(item => item.dataset.id);
  localStorage.setItem('taskOrder', JSON.stringify(newOrder));
};

// Load tasks and preserve order on page load
const loadTasks = () => {
  const savedOrder = JSON.parse(localStorage.getItem('taskOrder')) || [];
  const allTasks = Array.from(taskList.children);

  savedOrder.forEach(id => {
    const task = allTasks.find(item => item.dataset.id === id);
    if (task) taskList.appendChild(task);
  });
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  enableDragAndDrop();
});
