// controllers/webhookController.js
const crypto = require('crypto');
const User = require('../models/User');
const axios = require('axios');

exports.paystackWebhook = async (req, res) => {
    try {
        const { reference, amount, customer } = req.body.data;
        const { email } = customer;

        // Step 1: Verify Paystack Signature
        const secret = process.env.PAYSTACK_SECRET;
        const hash = crypto.createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Step 2: Verify Transaction with Paystack API
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        });

        const { status, amount: verifiedAmount, transaction_id } = response.data.data;
        if (status !== 'success') {
            return res.status(400).json({ message: "Transaction not successful" });
        }

        // Step 3: Update User Balance
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const amountInNaira = verifiedAmount / 100;
        user.balance += amountInNaira;

        // Step 4: Store Transaction
        user.transactions.push({
            amount: amountInNaira,
            transactionId: transaction_id,
            status,
            reference
        });

        await user.save();

        return res.status(200).json({ message: "Transaction verified and balance updated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Webhook handling failed" });
    }
};
