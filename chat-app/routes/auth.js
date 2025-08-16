const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

const getToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
        const { username, email, password } = req.body;

   try {
        const exists = await User.findOne({ $or: [{ username }, { email }] });
        if (exists) return res.status(400).json({ message: 'User already exists' });
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({ username, email, password:hashed });
        res.json({ token: getToken(user._id), user: { id: user._id, username: user.username, email: user.email }});
   } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
   }
});

router.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ token: getToken(user._id), user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;