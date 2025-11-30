const prisma = require('./prisma/prisma');

async function testQuizFetch() {
    try {
        console.log('Testing quiz fetch...');
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
        console.log('Success! Found', quizzes.length, 'quizzes');
        console.log('First quiz:', JSON.stringify(quizzes[0], null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

testQuizFetch();
