const express = require('express');
const router = express.Router();

const {
    getleaderboard
} = require('../../controllers/leaderboard/leaderboard.controllers')
 


router.get('/', getleaderboard)

module.exports = router;