const express = require('express');
const app = express();
const prisma = require('./prisma/prisma');

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Test works!' });
});

// Quiz endpoint
app.get('/quiz', async (req, res) => {
    console.log('Quiz endpoint hit');
    try {
        const quizzes = await prisma.quiz.findMany({
            include: {
                topic: true,
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });
        console.log('Found quizzes:', quizzes.length);
        res.json(quizzes);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
