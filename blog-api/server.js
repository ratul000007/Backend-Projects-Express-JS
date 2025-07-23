const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(express.json());
app.use("/api/posts", blogRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

//connect to mongoDb
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));