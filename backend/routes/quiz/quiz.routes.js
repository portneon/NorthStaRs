const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, submitQuizAttempt } = require('../../controllers/quiz/quiz.controller');

// Hardcoded seed quiz data (first quiz from seed-quizzes.js)
const seedQuiz1 = {
    id: 'seed-quiz-1',
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    difficulty: 'easy',
    questions: [
        {
            id: 'q1',
            text: 'What is the correct way to declare a variable in JavaScript?',
            options: [
                { id: 'opt1', text: 'var myVar = 5;' },
                { id: 'opt2', text: 'variable myVar = 5;' },
                { id: 'opt3', text: 'v myVar = 5;' },
                { id: 'opt4', text: 'declare myVar = 5;' }
            ],
            correctOption: 'opt1'
        },
        {
            id: 'q2',
            text: 'Which of the following is NOT a JavaScript data type?',
            options: [
                { id: 'opt1', text: 'String' },
                { id: 'opt2', text: 'Boolean' },
                { id: 'opt3', text: 'Float' },
                { id: 'opt4', text: 'Number' }
            ],
            correctOption: 'opt3'
        },
        {
            id: 'q3',
            text: 'What does "===" operator do in JavaScript?',
            options: [
                { id: 'opt1', text: 'Assigns a value' },
                { id: 'opt2', text: 'Compares value and type' },
                { id: 'opt3', text: 'Compares only value' },
                { id: 'opt4', text: 'Checks if not equal' }
            ],
            correctOption: 'opt2'
        }
    ]
};

router.get('/test', (req, res) => {
    res.json({ message: 'Quiz route is working!' });
});

// New endpoint returning the hard‑coded seed quiz
router.get('/seed-quiz-1', (req, res) => {
    res.json(seedQuiz1);
});

// Endpoint to submit an answer for a specific question of the hard‑coded seed quiz
router.post('/seed-quiz-1/answer', (req, res) => {
    const { questionIndex, selectedOption } = req.body;
    const question = seedQuiz1.questions[questionIndex];
    if (!question) {
        return res.status(400).json({ error: 'Invalid question index' });
    }
    const isCorrect = question.correctOption === selectedOption;
    res.json({ isCorrect });
});

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/attempt', submitQuizAttempt);

module.exports = router;
