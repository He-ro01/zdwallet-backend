// models/userModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    reference: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
   
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: {
        account_number: {
            type: String,
            unique: true,
            default: () => `PS-${Date.now()}`
        },
        balance: {
            type: Number,
            default: 0
        }
    }
});


module.exports = mongoose.model('User', userSchema);
