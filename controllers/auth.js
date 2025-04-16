// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.register = async (req, res) => {
    try {
        const { name, surname, mobileNumber, username, email, password } = req.body;
        console.log("Registering user...");
        console.log("Received details:", { name, surname, mobileNumber, username, email });



        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            mobileNumber,

            password: hashedPassword,
            wallet: {
                account_number: `PS-${Date.now()}`,
                balance: 0
            }
        });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,

                mobileNumber: user.mobileNumber,

                wallet: user.wallet
            }
        });

    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Logging in user...");

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                wallet: user.wallet
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(400).json({ error: error.message });
    }
};

// 3. Check Login Status Route
exports.checkLogin = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ loggedIn: false, message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token is valid, check if user exists
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ loggedIn: false, message: "User not found" });
        }

        res.json({ loggedIn: true, user: { id: user._id, username: user.username } });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Handle expired token scenario
            return res.status(200).json({ loggedIn: false, message: "Token expired" });
        }

        console.error('Check Login Error:', error);
        res.status(500).json({ loggedIn: false, message: "Internal server error" });
    }
};
