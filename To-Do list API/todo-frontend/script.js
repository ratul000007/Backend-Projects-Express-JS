const API_URL = "http://localhost:3000/todos";

const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoTitle = document.getElementById("todo-title");

document.addEventListener("DOMContentLoaded", fetchTodos);

// Fetch and display todos
async function fetchTodos() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        todoList.innerHTML = "";

        data.data.forEach(todo => {
            const div = document.createElement("div");
            div.className = "todo-item";
            if (todo.completed) div.classList.add("completed");
            div.innerText = todo.title;
            todoList.appendChild(div); 
        });
    } catch (error) {
        console.error("Failed to catch todos", error);
    }
}

// Add a new todo
todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Add button clicked");

    const title = todoTitle.value.trim();
    if (!title) return;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        const data = await res.json();
        if (data.success) {
            todoTitle.value = "";
            fetchTodos();
        } else {
            alert("Failed to add todo");
        }
    } catch (error) {
        console.error("Error adding todo:", error);
    }
});