const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed quiz data...');

    // Create a topic first
    const topic = await prisma.topic.create({
        data: {
            name: 'JavaScript Fundamentals',
            description: 'Basic JavaScript concepts and syntax'
        }
    });

    console.log('Created topic:', topic.name);

    // Create Quiz 1: JavaScript Basics
    const quiz1 = await prisma.quiz.create({
        data: {
            title: 'JavaScript Basics',
            description: 'Test your knowledge of JavaScript fundamentals',
            difficulty: 'easy',
            topicId: topic.id,
            questions: {
                create: [
                    {
                        text: 'What is the correct way to declare a variable in JavaScript?',
                        options: {
                            create: [
                                { text: 'var myVar = 5;' },
                                { text: 'variable myVar = 5;' },
                                { text: 'v myVar = 5;' },
                                { text: 'declare myVar = 5;' }
                            ]
                        }
                    },
                    {
                        text: 'Which of the following is NOT a JavaScript data type?',
                        options: {
                            create: [
                                { text: 'String' },
                                { text: 'Boolean' },
                                { text: 'Float' },
                                { text: 'Number' }
                            ]
                        }
                    },
                    {
                        text: 'What does "===" operator do in JavaScript?',
                        options: {
                            create: [
                                { text: 'Assigns a value' },
                                { text: 'Compares value and type' },
                                { text: 'Compares only value' },
                                { text: 'Checks if not equal' }
                            ]
                        }
                    }
                ]
            }
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Set correct answers for Quiz 1
    await prisma.question.update({
        where: { id: quiz1.questions[0].id },
        data: { correctOptionId: quiz1.questions[0].options[0].id }
    });
    await prisma.question.update({
        where: { id: quiz1.questions[1].id },
        data: { correctOptionId: quiz1.questions[1].options[2].id }
    });
    await prisma.question.update({
        where: { id: quiz1.questions[2].id },
        data: { correctOptionId: quiz1.questions[2].options[1].id }
    });

    console.log('Created quiz:', quiz1.title);

    // Create Quiz 2: Advanced JavaScript
    const quiz2 = await prisma.quiz.create({
        data: {
            title: 'Advanced JavaScript Concepts',
            description: 'Challenge yourself with advanced JavaScript topics',
            difficulty: 'hard',
            topicId: topic.id,
            questions: {
                create: [
                    {
                        text: 'What is a closure in JavaScript?',
                        options: {
                            create: [
                                { text: 'A function that has access to variables in its outer scope' },
                                { text: 'A way to close a program' },
                                { text: 'A type of loop' },
                                { text: 'A method to hide variables' }
                            ]
                        }
                    },
                    {
                        text: 'What does the "this" keyword refer to in JavaScript?',
                        options: {
                            create: [
                                { text: 'The current function' },
                                { text: 'The global object' },
                                { text: 'The object that is executing the current function' },
                                { text: 'The parent function' }
                            ]
                        }
                    },
                    {
                        text: 'What is the purpose of Promise in JavaScript?',
                        options: {
                            create: [
                                { text: 'To handle synchronous operations' },
                                { text: 'To handle asynchronous operations' },
                                { text: 'To create loops' },
                                { text: 'To define variables' }
                            ]
                        }
                    },
                    {
                        text: 'What is event bubbling?',
                        options: {
                            create: [
                                { text: 'Events propagate from child to parent elements' },
                                { text: 'Events propagate from parent to child elements' },
                                { text: 'Events are cancelled' },
                                { text: 'Events are duplicated' }
                            ]
                        }
                    }
                ]
            }
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Set correct answers for Quiz 2
    await prisma.question.update({
        where: { id: quiz2.questions[0].id },
        data: { correctOptionId: quiz2.questions[0].options[0].id }
    });
    await prisma.question.update({
        where: { id: quiz2.questions[1].id },
        data: { correctOptionId: quiz2.questions[1].options[2].id }
    });
    await prisma.question.update({
        where: { id: quiz2.questions[2].id },
        data: { correctOptionId: quiz2.questions[2].options[1].id }
    });
    await prisma.question.update({
        where: { id: quiz2.questions[3].id },
        data: { correctOptionId: quiz2.questions[3].options[0].id }
    });

    console.log('Created quiz:', quiz2.title);

    // Create Quiz 3: ES6 Features
    const quiz3 = await prisma.quiz.create({
        data: {
            title: 'ES6 Features',
            description: 'Modern JavaScript features introduced in ES6',
            difficulty: 'medium',
            topicId: topic.id,
            questions: {
                create: [
                    {
                        text: 'What is the difference between let and const?',
                        options: {
                            create: [
                                { text: 'let is block-scoped, const is function-scoped' },
                                { text: 'const cannot be reassigned, let can be' },
                                { text: 'There is no difference' },
                                { text: 'let is faster than const' }
                            ]
                        }
                    },
                    {
                        text: 'What is arrow function syntax?',
                        options: {
                            create: [
                                { text: '() => {}' },
                                { text: 'function() {}' },
                                { text: '-> {}' },
                                { text: 'func => {}' }
                            ]
                        }
                    },
                    {
                        text: 'What does the spread operator (...) do?',
                        options: {
                            create: [
                                { text: 'Multiplies numbers' },
                                { text: 'Expands an iterable into individual elements' },
                                { text: 'Creates a range' },
                                { text: 'Divides arrays' }
                            ]
                        }
                    }
                ]
            }
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Set correct answers for Quiz 3
    await prisma.question.update({
        where: { id: quiz3.questions[0].id },
        data: { correctOptionId: quiz3.questions[0].options[1].id }
    });
    await prisma.question.update({
        where: { id: quiz3.questions[1].id },
        data: { correctOptionId: quiz3.questions[1].options[0].id }
    });
    await prisma.question.update({
        where: { id: quiz3.questions[2].id },
        data: { correctOptionId: quiz3.questions[2].options[1].id }
    });

    console.log('Created quiz:', quiz3.title);

    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
