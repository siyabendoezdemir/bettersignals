const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Authentication
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.postRegister);
router.get('/logout', AuthController.getLogout);

module.exports = router;
