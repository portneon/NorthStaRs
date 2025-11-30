/**
 * Master Database Seeding Script
 * Seeds Users, Modules, Grid Problems, and Standard Problems
 * Run with: node scripts/seed_full_db.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedFullDatabase() {
    try {
        console.log('🚀 Starting full database seed...\n');

        // 1. Seed Modules
        await seedModules();

        // 2. Seed Users
        await seedUsers();

        // 3. Seed Grid Problems
        await seedGridProblems();

        // 4. Seed Standard Problems
        await seedStandardProblems();

        console.log('\n✨ Full database seeding complete!');

    } catch (error) {
        console.error('💥 Fatal error during full seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// --- Helper Functions ---

async function seedModules() {
    console.log('📦 Seeding modules...');
    const modules = [
        {
            title: 'Advanced Algorithms',
            subTitle: 'Module_04',
            description: 'Master advanced algorithmic techniques including dynamic programming, graph algorithms, and optimization strategies.',
            difficulty: 'advanced'
        },
        {
            title: 'System Design',
            subTitle: 'Module_02',
            description: 'Learn to design scalable distributed systems with focus on architecture patterns and trade-offs.',
            difficulty: 'intermediate'
        },
        {
            title: 'React Patterns',
            subTitle: 'Module_09',
            description: 'Explore modern React patterns including hooks, context, and performance optimization techniques.',
            difficulty: 'intermediate'
        },
        {
            title: 'Data Structures',
            subTitle: 'Module_01',
            description: 'Foundation of computer science - arrays, linked lists, trees, graphs, hashmaps and more.',
            difficulty: 'beginner'
        }
    ];

    for (const moduleData of modules) {
        const existing = await prisma.module.findFirst({ where: { title: moduleData.title } });
        if (!existing) {
            await prisma.module.create({ data: moduleData });
            console.log(`   ✅ Created module: ${moduleData.title}`);
        } else {
            console.log(`   ⏭️  Module already exists: ${moduleData.title}`);
        }
    }
}

async function seedUsers() {
    console.log('\n👤 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
        {
            username: 'architect',
            email: 'architect@nothstars.com',
            operativeName: 'The Architect',
            xp: 1250,
            level: 5,
            clearanceLevel: 'Level_05',
            streakCount: 42
        },
        {
            username: 'testuser',
            email: 'test@example.com',
            operativeName: 'Test Operative',
            xp: 100,
            level: 1,
            clearanceLevel: 'Level_01',
            streakCount: 0
        }
    ];

    for (const userData of users) {
        const existing = await prisma.user.findUnique({ where: { email: userData.email } });
        if (!existing) {
            await prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword
                }
            });
            console.log(`   ✅ Created user: ${userData.username}`);
        } else {
            console.log(`   ⏭️  User already exists: ${userData.username}`);
        }
    }
}

async function seedGridProblems() {
    console.log('\n🧩 Seeding grid problems...');
    try {
        const problemsPath = path.join(__dirname, '../data/grid_coding_problems.json');
        if (fs.existsSync(problemsPath)) {
            const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
            const advancedModule = await prisma.module.findFirst({ where: { title: 'Advanced Algorithms' } });

            for (const problem of problemsData) {
                const existing = await prisma.codeProblem.findFirst({ where: { title: problem.title } });

                if (!existing) {
                    const createdProblem = await prisma.codeProblem.create({
                        data: {
                            title: problem.title,
                            description: problem.description,
                            difficulty: problem.difficulty,
                            language: 'javascript',
                            problemType: 'grid-based',
                            starterCode: JSON.stringify(problem.starterCode),
                            constraints: JSON.stringify({
                                gridSize: problem.gridSize,
                                startPosition: problem.startPosition,
                                expectedPath: problem.expectedPath
                            }),
                            instructions: problem.instructions,
                            hints: problem.hints,
                            xpReward: 150,
                            moduleId: advancedModule?.id
                        }
                    });

                    for (const tc of problem.testCases) {
                        await prisma.testCase.create({
                            data: {
                                problemId: createdProblem.id,
                                input: tc.input || '',
                                expectedOutput: tc.expectedOutput,
                                isHidden: false,
                                description: tc.description
                            }
                        });
                    }
                    console.log(`   ✅ Created grid problem: ${problem.title}`);
                } else {
                    // Update existing problem with new fields
                    await prisma.codeProblem.update({
                        where: { id: existing.id },
                        data: {
                            instructions: problem.instructions,
                            hints: problem.hints,
                            moduleId: advancedModule?.id // Ensure module is linked
                        }
                    });
                    console.log(`   🔄 Updated existing grid problem: ${problem.title}`);
                }
            }
        } else {
            console.log('   ⚠️  Grid problems file not found, skipping.');
        }
    } catch (err) {
        console.error('   ❌ Error seeding grid problems:', err.message);
    }
}

async function seedStandardProblems() {
    console.log('\n💻 Seeding standard problems...');

    const dsModule = await prisma.module.findFirst({ where: { title: 'Data Structures' } });
    const sysModule = await prisma.module.findFirst({ where: { title: 'System Design' } });

    const standardProblems = [
        {
            title: "Two Sum",
            description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            difficulty: "easy",
            language: "javascript",
            starterCode: "function twoSum(nums, target) {\n  // Your code here\n}",
            xpReward: 50,
            moduleId: dsModule?.id,
            testCases: [
                { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", description: "Basic case" },
                { input: "[3,2,4], 6", expectedOutput: "[1,2]", description: "Unsorted array" }
            ]
        },
        {
            title: "Reverse String",
            description: "Write a function that reverses a string. The input string is given as an array of characters `s`.",
            difficulty: "easy",
            language: "javascript",
            starterCode: "function reverseString(s) {\n  // Your code here\n}",
            xpReward: 50,
            moduleId: dsModule?.id,
            testCases: [
                { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', description: "Standard word" }
            ]
        },
        {
            title: "Load Balancer Implementation",
            description: "Implement a basic Round Robin Load Balancer class that distributes requests among a list of servers.",
            difficulty: "intermediate",
            language: "javascript",
            starterCode: "class LoadBalancer {\n  constructor(servers) {\n    this.servers = servers;\n  }\n\n  next() {\n    // Return next server\n  }\n}",
            xpReward: 100,
            moduleId: sysModule?.id,
            testCases: [
                { input: '["s1", "s2", "s3"]', expectedOutput: "s1", description: "First request" }
            ]
        }
    ];

    for (const problem of standardProblems) {
        const existing = await prisma.codeProblem.findFirst({ where: { title: problem.title } });

        if (!existing) {
            const createdProblem = await prisma.codeProblem.create({
                data: {
                    title: problem.title,
                    description: problem.description,
                    difficulty: problem.difficulty,
                    language: problem.language,
                    problemType: 'standard',
                    starterCode: problem.starterCode,
                    xpReward: problem.xpReward,
                    moduleId: problem.moduleId
                }
            });

            for (const tc of problem.testCases) {
                await prisma.testCase.create({
                    data: {
                        problemId: createdProblem.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        isHidden: false,
                        description: tc.description
                    }
                });
            }
            console.log(`   ✅ Created standard problem: ${problem.title}`);
        } else {
            console.log(`   ⏭️  Standard problem already exists: ${problem.title}`);
        }
    }
}

seedFullDatabase();
