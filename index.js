document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let draggedItem = null;
  
    // Load tasks from localStorage
    const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
        task.addEventListener('dragstart', (e) => {
            e.target.style.opacity='0.5';
            draggedItem=e.target;
        });

        task.addEventListener('dragend', (e) => {
            e.target.style.opacity='1';
            draggedItem=null;
        })
    })
    };
  
    const saveTasks = () => {
      const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('.task-text').textContent,
        completed: task.classList.contains('completed'),
      }));
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    const createTaskElement = (text, completed = false) => {
      const li = document.createElement('li');
      li.setAttribute('draggable',"true");
      if (completed) li.classList.add('completed');

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = completed;
      check.className = 'check-box';
      li.appendChild(check);
  
      const span = document.createElement('span');
      span.textContent = text;
      span.className = 'task-text';
      li.appendChild(span);

      const div = document.createElement('div');
      div.className = 'task-change';
      
  
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';
      div.appendChild(editBtn);
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      div.appendChild(deleteBtn);
      li.appendChild(div);
  
      // Mark task as completed
      check.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
      });

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (editBtn.textContent === "Edit"){
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'task-text';
            input.value = li.childNodes[1].textContent;
            li.childNodes[1].replaceWith(input);
            editBtn.textContent = "Apply";
        } else {
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = li.childNodes[1].value;
            li.childNodes[1].replaceWith(span);
            editBtn.textContent = "Edit";
            saveTasks();
        }
      });
  
      // Delete task
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        li.remove();
        saveTasks();
      });
  
      taskList.appendChild(li);
    };
  
    // Add new task
    addTaskBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text) {
        createTaskElement(text);
        saveTasks();
        taskInput.value = '';
      }
    });

    
  
    // Initial load
    loadTasks();
  });
  