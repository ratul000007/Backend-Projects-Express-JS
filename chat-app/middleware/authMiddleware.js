const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const h = req.headers.authorization;

    if (!h || !h.startsWith('Bearer')) return res.status(401).json({ message: "No token" });
    const token = h.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalid" });
    }
};