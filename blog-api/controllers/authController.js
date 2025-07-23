const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generate jwt token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

//register user
exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ email, password, role });
        const token = generateToken(user);

        res.status(201).json({
            _id: user.id,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await User.findOne({ password });
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user);

        res.json({
            _id: user.id,
            email: user.email,
            role: user.role,
            token,
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};