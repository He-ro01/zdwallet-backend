// routes/webhookRoutes.js
const express = require('express');
const { paystackWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/paystack', express.raw({ type: 'application/json' }), paystackWebhook);

module.exports = router;
