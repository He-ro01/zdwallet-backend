const User = require('../models/User');
const { initiatePayment } = require('../utils/Paystack');

exports.getBalance = async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.status(200).json({ balance: user.balance });
};

exports.fundWallet = async (req, res) => {
    const { amount } = req.body;
    const user = await User.findById(req.user.userId);

    const payment = await initiatePayment(user.email, amount);
    res.status(200).json({ payment });
};
