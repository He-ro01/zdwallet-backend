const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

exports.initiatePayment = async (email, amount) => {
    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            { email, amount: amount * 100 }, // amount in kobo
            { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
        );
        return response.data;
    } catch (error) {
        throw new Error('Payment initiation failed');
    }
};
