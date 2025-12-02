const prisma = require('./prisma/prisma');

async function main() {
    console.log('Start seeding...');

    // 1. Create a Course
    const course = await prisma.course.create({
        data: {
            title: 'Full Stack Neural Interface',
            description: 'Master the grid and become a verified Architect.',
        },
    });

    // 2. Create Modules
    const module1 = await prisma.module.create({
        data: {
            title: 'Grid Fundamentals',
            subTitle: 'Module_01',
            description: 'Learn the basics of grid traversal and node manipulation.',
            difficulty: 'beginner',
            courseId: course.id,
        },
    });

    const module2 = await prisma.module.create({
        data: {
            title: 'Algorithmic Warfare',
            subTitle: 'Module_02',
            description: 'Advanced pathfinding and optimization strategies.',
            difficulty: 'intermediate',
            courseId: course.id,
        },
    });

    // 3. Create Code Problems
    const problem1 = await prisma.codeProblem.create({
        data: {
            title: 'Binary Inversion',
            description: 'Invert the binary tree of the grid nodes to reveal the hidden path.',
            difficulty: 'easy',
            language: 'javascript',
            starterCode: '// Write your solution here\nfunction invert(node) {\n  \n}',
            xpReward: 100,
            moduleId: module1.id,
            problemType: 'standard',
            instructions: 'Input: Root node of a binary tree.\nOutput: Inverted tree.',
        },
    });

    const problem2 = await prisma.codeProblem.create({
        data: {
            title: 'Pathfinder v1',
            description: 'Find the shortest path from [0,0] to [N,N] avoiding obstacles.',
            difficulty: 'medium',
            language: 'javascript',
            starterCode: '// Implement BFS\nfunction findPath(grid) {\n  \n}',
            xpReward: 200,
            moduleId: module2.id,
            problemType: 'standard',
        },
    });

    // 4. Create Quizzes
    const topic = await prisma.topic.create({
        data: {
            name: 'Data Structures',
            description: 'Core concepts of memory organization.',
            courseId: course.id,
        },
    });

    const quiz1 = await prisma.quiz.create({
        data: {
            title: 'Array Manipulation',
            description: 'Test your knowledge of array methods and complexity.',
            difficulty: 'easy',
            topicId: topic.id,
            questions: {
                create: [
                    {
                        text: 'What is the time complexity of accessing an element in an array by index?',
                        options: {
                            create: [
                                { text: 'O(1)' },
                                { text: 'O(n)' },
                                { text: 'O(log n)' },
                                { text: 'O(n^2)' },
                            ],
                        },
                        correctOptionId: 'placeholder', // Will update after creation
                        explanation: 'Array access is constant time because it uses a direct memory offset.',
                    },
                    {
                        text: 'Which method adds an element to the end of an array?',
                        options: {
                            create: [
                                { text: 'push()' },
                                { text: 'pop()' },
                                { text: 'shift()' },
                                { text: 'unshift()' },
                            ],
                        },
                        correctOptionId: 'placeholder',
                    },
                ],
            },
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Fetch the created quiz with all relations to ensure we have the IDs
    const quiz1WithRelations = await prisma.quiz.findUnique({
        where: { id: quiz1.id },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Update correct options for Quiz 1
    const q1 = quiz1WithRelations.questions.find(q => q.text.includes('time complexity'));
    const q1Correct = q1.options.find(o => o.text === 'O(1)');
    if (q1 && q1Correct) {
        await prisma.question.update({
            where: { id: q1.id },
            data: { correctOptionId: q1Correct.id }
        });
    }

    const q2 = quiz1WithRelations.questions.find(q => q.text.includes('adds an element'));
    const q2Correct = q2.options.find(o => o.text === 'push()');
    if (q2 && q2Correct) {
        await prisma.question.update({
            where: { id: q2.id },
            data: { correctOptionId: q2Correct.id }
        });
    }

    const quiz2 = await prisma.quiz.create({
        data: {
            title: 'Graph Theory Basics',
            description: 'Understand nodes, edges, and traversal algorithms.',
            difficulty: 'medium',
            topicId: topic.id,
            questions: {
                create: [
                    {
                        text: 'Which algorithm is best for finding the shortest path in an unweighted graph?',
                        options: {
                            create: [
                                { text: 'BFS' },
                                { text: 'DFS' },
                                { text: 'Dijkstra' },
                                { text: 'Prim' },
                            ],
                        },
                        correctOptionId: 'placeholder',
                    },
                ],
            },
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Fetch Quiz 2 with relations
    const quiz2WithRelations = await prisma.quiz.findUnique({
        where: { id: quiz2.id },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    // Update correct options for Quiz 2
    const q3 = quiz2WithRelations.questions[0];
    const q3Correct = q3.options.find(o => o.text === 'BFS');
    if (q3 && q3Correct) {
        await prisma.question.update({
            where: { id: q3.id },
            data: { correctOptionId: q3Correct.id }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
