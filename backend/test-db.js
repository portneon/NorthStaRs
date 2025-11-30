const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to fetch quizzes...');
        const quizzes = await prisma.quiz.findMany();
        console.log('Successfully fetched quizzes:', quizzes);
    } catch (e) {
        console.error('Error fetching quizzes:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
