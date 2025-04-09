// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken'); // Middleware to verify token
const router = express.Router();

// GET User Data
router.get('/data', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the middleware sets req.user

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send user data, including wallet balance
        res.status(200).json({
            username: user.username,
            email: user.email,
            walletBalance: user.wallet.balance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
