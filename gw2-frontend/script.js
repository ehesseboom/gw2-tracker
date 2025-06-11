const inputTask = document.getElementById("input-to-do-list");
const toDoList = document.getElementById("to-do-list");
const formatTask = document.getElementById("to-do-list-item");

inputTask.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
    inputTask.value = "";
  }
});

let addedTask;
let tasks = [];

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach((task) => {
      formatTask.style.display = "flex";
      const taskText = document.getElementById("task-text");
      taskText.textContent = task.text;
      addedTask = formatTask.cloneNode(true);

      const btnDelete = addedTask.querySelector("#btn-delete");
      btnDelete.addEventListener("click", deleteTask);

      const checkbox = addedTask.querySelector("#checkbox");
      checkbox.addEventListener("change", checkTask);
      checkbox.checked = task.completed;

      const taskTextElem = addedTask.querySelector("#task-text");
      taskTextElem.style.textDecoration = task.completed ? "line-through" : "";

      toDoList.appendChild(addedTask);
      formatTask.style.display = "none";
    });
  }
});

// Add a task
function addTask() {
  const userInput = inputTask.value.trim();
  if (!userInput) return;

  const newTask = { text: userInput, completed: false };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  formatTask.style.display = "flex";
  const taskText = document.getElementById("task-text");
  taskText.textContent = userInput;
  addedTask = formatTask.cloneNode(true);

  const btnDelete = addedTask.querySelector("#btn-delete");
  btnDelete.addEventListener("click", deleteTask);

  const checkbox = addedTask.querySelector("#checkbox");
  checkbox.addEventListener("change", checkTask);

  toDoList.appendChild(addedTask);
  formatTask.style.display = "none";
}

// Delete a task
function deleteTask(event) {
  const taskItem = event.target.closest("#to-do-list-item");
  if (taskItem) {
    const taskText = taskItem.querySelector("#task-text").textContent;

    const index = tasks.findIndex((task) => task.text === taskText);
    if (index !== -1) {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    taskItem.remove();
  }
}

// Check off task
function checkTask(event) {
  const taskItem = event.target.closest("#to-do-list-item");
  if (taskItem) {
    const taskTextElem = taskItem.querySelector("#task-text");
    const checked = event.target.checked;

    taskTextElem.style.textDecoration = checked ? "line-through" : "";

    const taskText = taskTextElem.textContent;
    const index = tasks.findIndex((task) => task.text === taskText);
    if (index !== -1) {
      tasks[index].completed = checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
}

//----------------------------------------------------------

const inputApikey = document.getElementById("input-apikey");

const displayAccountName = document.getElementById("display-account-name");
const displayAccountCreated = document.getElementById(
  "display-account-created"
);
const displayPlaytime = document.getElementById("display-playtime");
const displayAp = document.getElementById("display-ap");
const displayMr = document.getElementById("display-mr");
const displayWvw = document.getElementById("display-wvw-rank");
const displayPvp = document.getElementById("display-pvp-rank");

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}-${month}-${year}`;
}

inputApikey.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const apiKey = inputApikey.value.trim();
    inputApikey.value = "";

    try {
      const response = await fetch("http://localhost:3000/api/account", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      console.log(data);

      displayAccountName.textContent = data.name;
      displayAccountCreated.textContent = formatDate(data.created);
      displayPlaytime.textContent = `${Math.round(data.age / 3600)} hours`;
      console.log(data.totals);
      // displayAp.textContent = data.permanent_ap + data.daily_ap;
      displayMr.textContent = data.masSpent.reduce(
        (sum, region) => sum + region.spent,
        0
      );
      displayWvw.textContent = data.wvw_rank;
      displayPvp.textContent = data.pvp_rank;
    } catch (error) {
      console.error("Error fetching account data", error);
    }
  }
});
