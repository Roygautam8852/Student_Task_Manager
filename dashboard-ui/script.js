// ================= SELECTORS =================
const addTaskBtn = document.querySelector(".add-btn");
const taskGrid = document.querySelector(".task-grid");
const body = document.body;

// Stats
const backlogCount = document.querySelector(".stat-card.backlog h3");
const progressCount = document.querySelector(".stat-card.progress h3");
const completedCount = document.querySelector(".stat-card.completed h3");

// Menu & sidebar
const menuItems = document.querySelectorAll(".menu-item");
const sidebarDots = document.querySelectorAll(".side-nav .dot");

// ================= LOCAL STORAGE KEY =================
const STORAGE_KEY = "task_dashboard_tasks";

// ================= MODAL HTML =================
const modalHTML = `
<div class="modal">
  <div class="modal-box">
    <h2>Add New Task</h2>

    <input type="text" id="taskTitle" placeholder="Task title" />
    <textarea id="taskDesc" rows="3" placeholder="Task description"></textarea>

    <select id="taskStatus">
      <option value="backlog">Backlog</option>
      <option value="progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>

    <select id="taskTag">
      <option value="Personal">Personal</option>
      <option value="Business">Business</option>
      <option value="Design">Design</option>
      <option value="Team">Team</option>
    </select>

    <div class="modal-actions">
      <button class="add-btn" id="saveTask">Add Task</button>
      <button class="add-btn cancel" id="closeModal">Cancel</button>
    </div>
  </div>
</div>
`;

// ================= OPEN MODAL =================
addTaskBtn.addEventListener("click", () => {
  body.insertAdjacentHTML("beforeend", modalHTML);
});

// ================= CLOSE MODAL =================
body.addEventListener("click", (e) => {
  if (e.target.id === "closeModal" || e.target.classList.contains("modal")) {
    document.querySelector(".modal")?.remove();
  }
});

// ================= ADD TASK =================
body.addEventListener("click", (e) => {
  if (e.target.id === "saveTask") {
    const title = document.getElementById("taskTitle").value.trim();
    const desc = document.getElementById("taskDesc").value.trim();
    const status = document.getElementById("taskStatus").value;
    const tag = document.getElementById("taskTag").value;

    if (!title || !desc) {
      alert("Please fill all fields");
      return;
    }

    const task = {
      id: Date.now(),
      title,
      desc,
      status,
      tag
    };

    saveTaskToStorage(task);
    renderTask(task);
    updateStats();

    document.querySelector(".modal").remove();
  }
});

// ================= RENDER TASK =================
function renderTask(task) {
  const taskCard = `
    <div class="task-card" data-id="${task.id}">
      <span class="badge ${task.status}">
        ${task.status === "backlog" ? "Backlog" :
          task.status === "progress" ? "In Progress" : "Completed"}
      </span>
      <h3>${task.title}</h3>
      <p>${task.desc}</p>

      <div class="task-footer">
        <span class="tag">${task.tag}</span>
        <div class="assignee"></div>
      </div>
    </div>
  `;

  taskGrid.insertAdjacentHTML("beforeend", taskCard);
}

// ================= LOCAL STORAGE FUNCTIONS =================
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTaskToStorage(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasksFromStorage();
  tasks.forEach(task => renderTask(task));
  updateStats();
}

// ================= UPDATE STATS =================
function updateStats() {
  backlogCount.innerHTML =
    `${document.querySelectorAll(".badge.backlog").length} <span>Task</span>`;

  progressCount.innerHTML =
    `${document.querySelectorAll(".badge.progress").length} <span>Task</span>`;

  completedCount.innerHTML =
    `${document.querySelectorAll(".badge.completed").length} <span>Task</span>`;
}

// ================= MENU ACTIVE =================
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// ================= SIDEBAR ACTIVE DOT =================
sidebarDots.forEach(dot => {
  dot.addEventListener("click", () => {
    sidebarDots.forEach(d => d.classList.remove("active-dot"));
    dot.classList.add("active-dot");
  });
});

// ================= INIT =================
loadTasks();
sidebarDots[0].classList.add("active-dot");
