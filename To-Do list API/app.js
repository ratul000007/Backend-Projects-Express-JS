const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect("mongodb+srv://ratul07:Manutd_20@ratul.cskiwek.mongodb.net/ratulApp?retryWrites=true&w=majority&appName=Ratul", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.error("MongoDB connection error:", err));

const todoSchema = 