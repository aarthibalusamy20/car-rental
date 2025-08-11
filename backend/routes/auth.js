const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // <-- Keep this only if you use jwt in this file (optional)
const { login, register } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);

module.exports = router;
