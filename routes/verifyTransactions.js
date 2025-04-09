// routes/verifyTransactions.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/transactionModel');

// Access the secret key from the environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

router.get('/verify-transactions', async (req, res) => {
    try {
        const response = await axios.get('https://api.paystack.co/transaction', {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` // Use the environment variable here
            }
        });

        const transactions = response.data.data;
        const successful = transactions.filter(tx => tx.status === 'success');

        let updates = [];

        for (const tx of successful) {
            const existing = await Transaction.findOne({ transactionId: tx.id.toString() });
            if (existing) continue;

            const user = await User.findOne({ email: tx.customer.email });
            if (!user) continue;

            // Update user balance
            user.wallet.balance += tx.amount / 100; // amount from Paystack is in kobo
            await user.save();

            // Save transaction
            const newTx = new Transaction({
                userEmail: tx.customer.email,
                amount: tx.amount / 100,
                transactionId: tx.id.toString(),
                status: tx.status,
                reference: tx.reference
            });

            await newTx.save();
            updates.push({ email: user.email, amount: tx.amount / 100 });
        }

        res.json({ success: true, updates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error verifying transactions' });
    }
});

module.exports = router;
