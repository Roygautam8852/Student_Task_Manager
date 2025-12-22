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

