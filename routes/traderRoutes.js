const express = require('express');
const router = express.Router();
const TraderController = require('../controllers/traderController');

router.get('/getTraders', TraderController.getTraders);

router.get('/search', TraderController.searchTrader);

module.exports = router;
