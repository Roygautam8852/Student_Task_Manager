document.addEventListener("DOMContentLoaded", () => {

  // ===== STORAGE KEYS =====
  const USERS_KEY = "users";
  const CURRENT_USER_KEY = "currentUser";
  const TASKS_KEY = "userTasks";

  // ===== SELECTORS =====
  const addTaskBtn = document.getElementById("addTaskBtn");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const taskGrid = document.querySelector(".task-grid");
  const avatar = document.querySelector(".user-pic");
  const avatarMenu = document.getElementById("avatarMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const body = document.body;

  const searchInput = document.querySelector(".search input");
  const searchDropdown = document.getElementById("searchDropdown");

  // STAT CARDS
  const backlogCount = document.querySelector(".stat-card.backlog h3");
  const progressCount = document.querySelector(".stat-card.progress h3");
  const completedCount = document.querySelector(".stat-card.completed h3");

  // ===== HELPERS =====
  const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));

  const getCurrentUser = () =>
    JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

  const setCurrentUser = u =>
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));

  const getAllTasks = () =>
    JSON.parse(localStorage.getItem(TASKS_KEY)) || {};

  const saveAllTasks = t =>
    localStorage.setItem(TASKS_KEY, JSON.stringify(t));

  function getTasks() {
    const user = getCurrentUser();
    if (!user) return [];
    return getAllTasks()[user.id] || [];
  }

  function saveTasks(tasks) {
    const user = getCurrentUser();
    if (!user) return;
    const all = getAllTasks();
    all[user.id] = tasks;
    saveAllTasks(all);
  }

  function updateAvatar() {
    const user = getCurrentUser();
    avatar.textContent = user ? user.name[0].toUpperCase() : "";
  }

  // ===== UPDATE STATS =====
  function updateStats() {
    const tasks = getTasks();

    backlogCount.innerHTML =
      `${tasks.filter(t => t.status === "backlog").length} <span>Task</span>`;
    progressCount.innerHTML =
      `${tasks.filter(t => t.status === "progress").length} <span>Task</span>`;
    completedCount.innerHTML =
      `${tasks.filter(t => t.status === "completed").length} <span>Task</span>`;
  }

  // ===== MODALS =====
  const signupModal = () => `
    <div class="modal">
      <div class="modal-box">
        <h2>Sign Up</h2>
        <input id="suName" placeholder="Name">
        <input id="suEmail" placeholder="Email">
        <input id="suPass" type="password" placeholder="Password">
        <button class="add-btn" id="signupSubmit">Create Account</button>
        <button class="add-btn cancel" id="closeModal">Cancel</button>
      </div>
    </div>`;

  const loginModal = () => `
    <div class="modal">
      <div class="modal-box">
        <h2>Login</h2>
        <input id="liEmail" placeholder="Email">
        <input id="liPass" type="password" placeholder="Password">
        <button class="add-btn" id="loginSubmit">Login</button>
        <button class="add-btn cancel" id="closeModal">Cancel</button>
      </div>
    </div>`;

  const taskModal = () => `
    <div class="modal">
      <div class="modal-box">
        <h2>Add Task</h2>
        <input id="taskTitle" placeholder="Task title">
        <textarea id="taskDesc" placeholder="Task description"></textarea>
        <select id="taskStatus">
          <option value="backlog">Backlog</option>
          <option value="progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button class="add-btn" id="saveTask">Add Task</button>
        <button class="add-btn cancel" id="closeModal">Cancel</button>
      </div>
    </div>`;

  // ===== RENDER TASKS =====
  function renderTasks(tasks = getTasks()) {
    taskGrid.innerHTML = "";

    if (tasks.length === 0) {
      taskGrid.innerHTML =
        "<p style='color:#9aa0c3'>No tasks found</p>";
      updateStats();
      return;
    }

    tasks.forEach(t => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <span class="badge ${t.status}">${t.status}</span>
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
      `;
      taskGrid.appendChild(card);
    });

    updateStats();
  }

  // ===== SEARCH (INPUT + ENTER FIX) =====
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    searchDropdown.innerHTML = "";

    if (!query) {
      searchDropdown.style.display = "none";
      renderTasks();
      return;
    }

    const tasks = getTasks();
    const filtered = tasks.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.desc.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      searchDropdown.style.display = "none";
      renderTasks([]);
      return;
    }

    searchDropdown.style.display = "block";

    filtered.forEach(task => {
      const item = document.createElement("div");
      item.className = "search-item";
      item.textContent = task.title;

      item.onclick = () => {
        searchInput.value = task.title;
        searchDropdown.style.display = "none";
        renderTasks([task]);
      };

      searchDropdown.appendChild(item);
    });
  });

  // 🔥 ENTER KEY FIX
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const query = searchInput.value.toLowerCase().trim();
      if (!query) return;

      const tasks = getTasks();
      const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.desc.toLowerCase().includes(query)
      );

      searchDropdown.style.display = "none";
      renderTasks(filtered);
    }
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search")) {
      searchDropdown.style.display = "none";
    }
  });

  // ===== OPEN MODALS =====
  signupBtn.onclick = () =>
    body.insertAdjacentHTML("beforeend", signupModal());

  loginBtn.onclick = () =>
    body.insertAdjacentHTML("beforeend", loginModal());

  addTaskBtn.onclick = () => {
    if (!getCurrentUser()) return alert("Please login first");
    body.insertAdjacentHTML("beforeend", taskModal());
  };

  // ===== AVATAR LOGOUT =====
  avatar.addEventListener("click", e => {
    e.stopPropagation();
    if (!getCurrentUser()) return;
    avatarMenu.style.display =
      avatarMenu.style.display === "block" ? "none" : "block";
  });

  logoutBtn.onclick = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    avatar.textContent = "";
    taskGrid.innerHTML = "";
    updateStats();
    avatarMenu.style.display = "none";
    alert("Logged out successfully");
  };

  // ===== GLOBAL HANDLER =====
  body.addEventListener("click", e => {

    if (e.target.id === "closeModal") {
      document.querySelector(".modal")?.remove();
    }

    if (e.target.id === "signupSubmit") {
      const name = suName.value.trim();
      const email = suEmail.value.trim();
      const pass = suPass.value.trim();

      if (!name || !email || !pass) return alert("Fill all fields");

      const users = getUsers();
      if (users.find(u => u.email === email))
        return alert("User already exists");

      users.push({ id: Date.now(), name, email, password: pass });
      saveUsers(users);
      alert("Signup successful. Now login.");
      document.querySelector(".modal").remove();
    }

    if (e.target.id === "loginSubmit") {
      const email = liEmail.value.trim();
      const pass = liPass.value.trim();

      const user = getUsers().find(
        u => u.email === email && u.password === pass
      );

      if (!user) return alert("Invalid credentials");

      setCurrentUser(user);
      updateAvatar();
      renderTasks();
      alert("Login successful");
      document.querySelector(".modal").remove();
    }

    if (e.target.id === "saveTask") {
      const title = taskTitle.value.trim();
      const desc = taskDesc.value.trim();
      const status = taskStatus.value;

      if (!title || !desc) return alert("Fill all fields");

      const tasks = getTasks();
      tasks.push({ id: Date.now(), title, desc, status });
      saveTasks(tasks);
      renderTasks();
      document.querySelector(".modal").remove();
    }
  });

  // ===== INIT =====
  updateAvatar();
  renderTasks();

});
