const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");


//register new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        //check if user already exists
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //create user
        const user = await User.create({ name, email, password });

        //genarate token
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        //send response
        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(201)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                accessToken,
            });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Login user
// @route   POST /api/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //validate input
    if(!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password with hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        
        // Generate JWT token
         const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        //send response
        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(201)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                accessToken,
            });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}