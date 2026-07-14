enum Status {
  Todo,
  InProgress,
  Done
}

type Task = {
  text: string;
  completed: boolean;
  currentStatus: Status
};

const saved_tasks = localStorage.getItem("tasks");
const tasks: Task[] = saved_tasks ? JSON.parse(saved_tasks) : [];

const form = document.getElementById("taskForm") as HTMLFormElement;
const taskInput = document.getElementById("taskInput") as HTMLInputElement;

const todoList = document.getElementById("todo-list") as HTMLUListElement;
const inProgressList = document.getElementById("in-progress-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;


if (tasks.length > 0) {
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let handler = (event: Event): void => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  const newTask: Task = {
    text: taskText,
    completed: false,
    currentStatus: Status.Todo
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveTasks();

  renderTasks();
}


form.addEventListener("submit", handler);

function renderTasks() {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.classList.add("task-text");

    if (task.completed) {
      span.style.textDecoration = "line-through";
    }

    const completeBtn = document.createElement("button");
    completeBtn.innerHTML = "<i class=\"fa-regular fa-square-check\"></i>Complete";
    completeBtn.classList.add("complete-btn");

    const inProgressBtn = document.createElement("button");
    inProgressBtn.innerHTML = "<i class=\"fa-solid fa-spinner\"></i>In Progress";
    inProgressBtn.classList.add("in-progress-btn");

    completeBtn.addEventListener("click", (e) => {
      task.completed = !task.completed;
      task.currentStatus = Status.Done;
      saveTasks();
      renderTasks();
    });

    inProgressBtn.addEventListener("click", (e) => {
      task.currentStatus = Status.InProgress;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    switch (task.currentStatus) {
      case Status.Todo:
        li.appendChild(inProgressBtn);
        todoList.appendChild(li);
        break;
      case Status.InProgress:
        li.appendChild(completeBtn);
        inProgressList.appendChild(li);
        break;
      case Status.Done:
        li.appendChild(deleteBtn);
        doneList.appendChild(li);
        break;
    }
  });
}