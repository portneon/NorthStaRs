const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, submitQuizAttempt } = require('../../controllers/quiz/quiz.controller');

router.get('/test', (req, res) => {
    res.json({ message: 'Quiz route is working!' });
});

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/attempt', submitQuizAttempt);

module.exports = router;
