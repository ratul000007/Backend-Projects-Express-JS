const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token and attach user to request
const protect = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    )
       { 
        try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    } 
   }
    if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

// Middleware to restrict access based on role
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access forbidden: insufficient role" });
        }
        next();
    }
}
module.exports = { protect, authorize };