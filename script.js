const landingPage = document.getElementById("landingPage");
const authPage = document.getElementById("authPage");
const dashboard = document.getElementById("dashboard");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const userNameDisplay = document.getElementById("userNameDisplay");

const taskInput = document.getElementById("taskInput");
const taskGrid = document.getElementById("taskGrid");

let currentUser = null;

/* ===== Navigation ===== */
function showAuth() {
    landingPage.classList.add("hidden");
    authPage.classList.remove("hidden");
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

/* ===== Auth ===== */
document.getElementById("authBtn").onclick = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) return;

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[username]) {
        users[username] = { password, tasks: [] };
        localStorage.setItem("users", JSON.stringify(users));
    }

    currentUser = username;
    localStorage.setItem("currentUser", username);
    loadDashboard();
};

/* ===== Dashboard ===== */
function loadDashboard() {
    authPage.classList.add("hidden");
    landingPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    userNameDisplay.textContent = currentUser;
    renderTasks();
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.push({ text, done: false });
    localStorage.setItem("users", JSON.stringify(users));
    taskInput.value = "";
    renderTasks();
}

function renderTasks() {
    let users = JSON.parse(localStorage.getItem("users"));
    let tasks = users[currentUser].tasks;

    taskGrid.innerHTML = "";
    tasks.forEach((task, index) => {
        const card = document.createElement("div");
        card.className = "task-card" + (task.done ? " done" : "");
        card.innerHTML = `
            <p>${task.text}</p>
            <button onclick="toggleTask(${index})">Done</button>
        `;
        taskGrid.appendChild(card);
    });
}

function toggleTask(index) {
    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks[index].done = true;
    localStorage.setItem("users", JSON.stringify(users));
    renderTasks();
}

/* ===== Auto Login ===== */
const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
    currentUser = savedUser;
    loadDashboard();
}
