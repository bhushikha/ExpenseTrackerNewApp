const express = require('express');
const axios = require('axios');

const premiumFeatureController = require('../controller/premiumFeature');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);


module.exports = router;