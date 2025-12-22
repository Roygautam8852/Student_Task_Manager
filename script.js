const authContainer = document.getElementById("authContainer");
const appContainer = document.getElementById("appContainer");
const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");
const authTitle = document.getElementById("authTitle");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const userNameDisplay = document.getElementById("userNameDisplay");
const logoutBtn = document.getElementById("logoutBtn");

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let isSignup = false;
let currentUser = null;

/* ===== AUTH ===== */
toggleAuth.onclick = () => {
    isSignup = !isSignup;
    authTitle.textContent = isSignup ? "Sign Up" : "Sign In";
    authBtn.textContent = isSignup ? "Sign Up" : "Sign In";
    toggleAuth.innerHTML = isSignup
        ? `Already have an account? <span>Sign In</span>`
        : `Don’t have an account? <span>Sign Up</span>`;
};

authBtn.onclick = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) return;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (isSignup) {
        users[username] = { password, tasks: [] };
        localStorage.setItem("users", JSON.stringify(users));
    }

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem("currentUser", username);
        loadApp();
    }
};

/* ===== APP ===== */
function loadApp() {
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    userNameDisplay.textContent = currentUser;
    renderTasks();
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function renderTasks() {
    const users = JSON.parse(localStorage.getItem("users"));
    const tasks = users[currentUser].tasks;
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) li.classList.add("done");

        li.onclick = () => {
            task.completed = !task.completed;
            saveUsers(users);
            renderTasks();
        };

        const del = document.createElement("button");
        del.textContent = "✖";
        del.onclick = (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveUsers(users);
            renderTasks();
        };

        li.appendChild(del);
        taskList.appendChild(li);
    });
}

addBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.push({ text, completed: false });
    saveUsers(users);
    taskInput.value = "";
    renderTasks();
};

logoutBtn.onclick = () => {
    localStorage.removeItem("currentUser");
    location.reload();
};

/* Auto login */
const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
    currentUser = savedUser;
    loadApp();
}
