const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, submitQuizAttempt } = require('../../controllers/quiz/quiz.controller');

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/attempt', submitQuizAttempt);

module.exports = router;
