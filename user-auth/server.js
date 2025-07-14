const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParse = require("cookie-parser");

app.use(cookieParse());

app.use("/api", authRoutes);

//Load env config
dotenv.config();

const app = express();
app.use(express.json()); //to parse JSON bodies

app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));