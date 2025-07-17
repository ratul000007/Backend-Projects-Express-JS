const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Load env config
dotenv.config();

//connect to DB
connectDB();

// ✅ Initialize Express app
const app = express();

//Middleware
app.use(
    cors({
        origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json()); //to parse JSON bodies

app.use("/api", authRoutes);

app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));