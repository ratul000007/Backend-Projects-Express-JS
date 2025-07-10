import React, { useEffect, useState} from "react";

function TodoList() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("/todos")
            .then(res => res.json)
            .then(data => setTodos(data.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>To-Do List</h2>
            {todos.map(todo => (
                <div key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none"}}>
                    {todo.title}
                </div>
            ))}
        </div>
    );
}

export default TodoList;