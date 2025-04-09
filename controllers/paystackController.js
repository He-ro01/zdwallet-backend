const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.handleWebhook = async (req, res) => {
    const { event, data } = req.body;

    if (event === 'charge.success') {
        const user = await User.findOne({ email: data.customer.email });
        if (user) {
            user.balance += data.amount / 100;
            await user.save();
            res.status(200).send('Transaction successful');
        }
    } else {
        res.status(400).send('Event not handled');
    }
};
