const taskGrid = document.querySelector(".task-grid");
const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("taskModal");

const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDesc");
const statusInput = document.getElementById("taskStatus");
const tagInput = document.getElementById("taskTag");
const saveBtn = document.getElementById("saveTask");

let currentUser = localStorage.getItem("currentUser") || "Guest";

let users = JSON.parse(localStorage.getItem("users")) || {
  Guest: { tasks: [] }
};

if (!users[currentUser]) users[currentUser] = { tasks: [] };

let tasks = users[currentUser].tasks;

/* ===== MODAL ===== */
addBtn.onclick = () => modal.classList.remove("hidden");
function closeModal() { modal.classList.add("hidden"); }

/* ===== SAVE TASK ===== */
saveBtn.onclick = () => {
  if (!titleInput.value) return;

  tasks.push({
    title: titleInput.value,
    desc: descInput.value,
    status: statusInput.value,
    tag: tagInput.value || "General"
  });

  titleInput.value = descInput.value = tagInput.value = "";
  statusInput.value = "backlog";

  saveData();
  closeModal();
  renderTasks();
};

/* ===== SAVE STORAGE ===== */
function saveData() {
  users[currentUser].tasks = tasks;
  localStorage.setItem("users", JSON.stringify(users));
}

/* ===== RENDER ===== */
function renderTasks() {
  taskGrid.innerHTML = "";

  tasks.forEach((t, i) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <span class="badge ${t.status}">${t.status}</span>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>

      <div class="task-footer">
        <span class="tag">${t.tag}</span>
        <div>
          <button onclick="changeStatus(${i})">↻</button>
          <button onclick="deleteTask(${i})">✖</button>
        </div>
      </div>
    `;

    taskGrid.appendChild(card);
  });
}

/* ===== ACTIONS ===== */
window.deleteTask = (i) => {
  tasks.splice(i, 1);
  saveData();
  renderTasks();
};

window.changeStatus = (i) => {
  const order = ["backlog", "progress", "completed"];
  let idx = order.indexOf(tasks[i].status);
  tasks[i].status = order[(idx + 1) % order.length];
  saveData();
  renderTasks();
};
const avatar = document.getElementById("userAvatar");
avatar.textContent = currentUser[0].toUpperCase();


renderTasks();
