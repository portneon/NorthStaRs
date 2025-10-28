const express = require('express');
const router = express.Router();
const { getAllBadges, getUserBadges } = require('../../controllers/badge/badge.controller');

router.get('/', getAllBadges);
router.get('/user/:userId', getUserBadges);

module.exports = router;
