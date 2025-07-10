const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Todo = require("../models/Todo")


//routes

//get all todos
router.get("/", async (req, res) => {
    try {
        const { completed, sort, page = 1, limit = 10 } = req.query;
        let filter = {};
        let sortOption = {}; 

        //convert query values
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        //filtering by completed status
        if (completed === "true") {
            filter.completed = true;
        } else if (completed === "false") {
            filter.completed = false;
        }

        //filtering by logic
        if(sort === "asc") {
            sortOption.createdAt = 1;
        } else if (sort === "desc") {
            sortOption.createdAt = -1;
        }
        const todos = await Todo.find(filter)
            .sort(sortOption)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
            
        const totalCount = await Todo.countDocuments(filter);
        res.json({
            success: true,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / limitNumber),
            totalItems: totalCount,
            data: todos,
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

//get todos by id
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) return res.status(404).json({ message: "To-Do not found."});
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
})

//create a new todo
router.post("/", async (req, res) => {
    const { title } = req.body;
    if(!title || typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({ 
            message: "Title is required and must be at least 3 characters long."
        });
    }

    const todo = new Todo({ title: title.trim() });

    try {
        const newTodo = await todo.save();
        res.status(201).json({ success: true, data: newTodo });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error message here" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) return res.status(404).json({ message: "To-Do not found" });

        if(req.body.title !== undefined) {
            const title = req.body.title;
            if(typeof title !== "string" || title.trim().length < 3) {
                return res.status(400).json({ 
                    message: "Title must be at least 3 characters long.",
                });
            }
            todo.title = title.trim();
        }
        if(req.body.completed !== undefined) todo.completed = req.body.completed;

        const updatedToDo = await todo.save();
        res.json({ success: true, data: updatedToDo});
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
});

//delete todo by id
router.delete("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if(!todo) return res.status(404).json({ message: "To-Do not found" });
        res.json({ success:true, message: "To-Do deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;