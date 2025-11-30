/**
 * Database Seeding Script for Grid-Based Coding Problems
 * Run with: node scripts/seed_grid_problems.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedGridProblems() {
    try {
        console.log('🌱 Seeding grid-based coding problems...\n');

        // Read the problems JSON file
        const problemsPath = path.join(__dirname, '../data/grid_coding_problems.json');
        const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

        let successCount = 0;
        let errorCount = 0;

        for (const problem of problemsData) {
            try {
                console.log(`📝 Creating problem: ${problem.title}`);

                // Create the CodeProblem first
                const createdProblem = await prisma.codeProblem.create({
                    data: {
                        title: problem.title,
                        description: problem.description,
                        difficulty: problem.difficulty,
                        language: 'javascript', // Default language
                        problemType: 'grid-based', // Custom type for filtering
                        starterCode: JSON.stringify(problem.starterCode),
                        constraints: JSON.stringify({
                            gridSize: problem.gridSize,
                            startPosition: problem.startPosition,
                            instructions: problem.instructions,
                            hints: problem.hints,
                            expectedPath: problem.expectedPath
                        }),
                        xpReward: 50,
                    }
                });

                // Create test cases separately
                for (const tc of problem.testCases) {
                    await prisma.testCase.create({
                        data: {
                            problemId: createdProblem.id,
                            input: tc.input || '',
                            expectedOutput: tc.expectedOutput,
                            isHidden: false,
                            description: tc.description || 'Test case'
                        }
                    });
                }

                console.log(`   ✅ Created problem ID: ${createdProblem.id} with ${problem.testCases.length} test case(s)`);
                successCount++;

            } catch (problemError) {
                console.error(`   ❌ Error creating problem "${problem.title}":`, problemError.message);
                errorCount++;
            }
        }

        console.log(`\n🎉 Seeding complete!`);
        console.log(`   ✅ Successfully seeded: ${successCount} problems`);
        if (errorCount > 0) {
            console.log(`   ❌ Failed: ${errorCount} problems`);
        }

    } catch (error) {
        console.error('💥 Fatal error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeding function
seedGridProblems()
    .then(() => {
        console.log('\n✨ All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
