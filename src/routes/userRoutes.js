const express = require('express');
const { register, verifyOtpForRegister, login, verifyOtpForLogin } = require('../controllers/userController');

const router = express.Router();

// Đăng ký
router.post('/register', register);
router.post('/register/verify', verifyOtpForRegister);

// Đăng nhập
router.post('/login', login);
router.post('/login/verify', verifyOtpForLogin);

module.exports = router;
