const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/ping', paymentController.ping);
router.post('/checkout/:traderId', paymentController.checkout);


module.exports = router;
