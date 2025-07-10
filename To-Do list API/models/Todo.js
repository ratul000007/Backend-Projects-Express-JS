const mongoose = require("mongoose");

//define schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("ToDo", todoSchema);

module.exports = Todo;