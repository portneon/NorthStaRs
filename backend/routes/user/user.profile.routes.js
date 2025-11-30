const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserModules, getUserStats } = require('../../controllers/user/user.profile.controller');

router.get('/:userId', getUserProfile);
router.put('/:userId', updateUserProfile);
router.get('/:userId/modules', getUserModules);
router.get('/stats/:userId', getUserStats);

module.exports = router;
