const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Token: ", token);

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        // Log the user ID (or other information) to the console
        console.log("Decoded user Info", req.user);

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
