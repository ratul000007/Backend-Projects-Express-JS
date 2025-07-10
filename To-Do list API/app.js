const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes");


const app = express();

const cors = require("cors");
app.use(cors());

const PORT = 3000;

app.use(express.json());

//connect to mongodb
mongoose.connect("mongodb+srv://ratul07:Manutd_20@ratul.cskiwek.mongodb.net/ratulApp?retryWrites=true&w=majority&appName=Ratul")
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.error("MongoDB connection error:", err));

//use the routes
app.use("/todos", todoRoutes);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
