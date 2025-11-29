const express = require('express');
const router = express.Router();
const {
    executeCode,
    submitCode,
    getProblems,
    getProblemById,
    getUserSubmissions,
    getSupportedLanguages,
} = require('../../controllers/code/code.controller');

// Execute code
router.post('/execute', executeCode);

// Submit code solution
router.post('/submit/:problemId', submitCode);

// Get all problems
router.get('/problems', getProblems);

// Get specific problem
router.get('/problems/:id', getProblemById);

// Get user submissions
router.get('/submissions/:userId', getUserSubmissions);

// Get supported languages
router.get('/languages', getSupportedLanguages);

module.exports = router;
