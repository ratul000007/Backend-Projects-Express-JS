const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { token } = require("morgan");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password });

        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, password: user.email, isAdmin: user.isAdmin },
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: "Invalid Credentials" });

        res.json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, password: user.email, isAdmin: user.isAdmin },
        })
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
}