const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/userController.js');

// Users
router.get('/getUsers', UserController.getUsers);
router.post('/addUser', UserController.addUser);

// Interactions
router.post('/subscribe/:traderId', UserController.subscribe);

// Views
router.get('/dashboard', UserController.getDashboard);

module.exports = router;
