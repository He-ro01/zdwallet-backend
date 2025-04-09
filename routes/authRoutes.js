const express = require('express');
const { register, login, checkLogin } = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-login', checkLogin)

module.exports = router;
