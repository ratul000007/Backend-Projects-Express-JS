const express = require("express");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const { generateAccessToken } = require("../utils/generateTokens");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

//refreshed token route
router.post("/refresh-token", (req, res) => {
    const token = req.cookies.refreshToken;

    if(!token) {
        return res.status(401).json({ message: "No refresh token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateAccessToken(decoded.userId);
        res.json({ accessToken });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});

//logout
router.post("/logout", (req,res) => {
    res
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        })
        .json({ message: "Logged out successfully" });
});

// 🔒 Protected route
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;