// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoute');
const userRoutes = require('./routes/userRoutes');
const verifyTxRoutes = require('./routes/verifyTransactions');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/webhook', webhookRoutes); // ✅ Webhook Route
app.use('/user', userRoutes);

app.use('/api', verifyTxRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
    })
    .catch(err => console.error(err));
