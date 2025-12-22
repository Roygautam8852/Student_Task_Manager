const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const button = document.querySelector("button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    list.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("done");
        }

        li.onclick = () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        };

        const del = document.createElement("button");
        del.textContent = "✖";
        del.onclick = (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        li.appendChild(del);
        list.appendChild(li);
    });
}

button.onclick = () => {
    if (input.value.trim() === "") return;
    tasks.push({ text: input.value, completed: false });
    input.value = "";
    saveTasks();
    renderTasks();
};

renderTasks();
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const button = document.querySelector("button");

button.addEventListener("click", () => {
    if (input.value === "") return;

    const li = document.createElement("li");
    li.textContent = input.value;

    li.addEventListener("click", () => {
        li.style.textDecoration = "line-through";
    });

    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = () => li.remove();

    li.appendChild(del);
    list.appendChild(li);
    input.value = "";
});

