const pistonService = require('../../services/code/piston.service');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Code Controller
 * Handles code execution, submission, and problem management
 */

/**
 * Execute code via Piston API
 * POST /code/execute
 */
const executeCode = async (req, res) => {
    try {
        const { language, version, code, stdin } = req.body;

        // Validation
        if (!language || !version || !code) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: language, version, code',
            });
        }

        // Execute code
        const result = await pistonService.executeCode(
            language,
            version,
            code,
            stdin || ''
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Code execution error:', error);
        return res.status(500).json({
            success: false,
            message: 'Code execution failed',
            error: error.message,
        });
    }
};

/**
 * Submit code solution for a problem
 * POST /code/submit/:problemId
 */
const submitCode = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { userId, language, version, code } = req.body;

        // Validation
        if (!userId || !language || !version || !code) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, language, version, code',
            });
        }

        // Get problem with test cases
        const problem = await prisma.codeProblem.findUnique({
            where: { id: problemId },
            include: { testCases: true },
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found',
            });
        }

        // Validate against test cases
        const testResults = await pistonService.validateTestCases(
            language,
            version,
            code,
            problem.testCases.map((tc) => ({
                input: tc.input,
                expected: tc.expected,
            }))
        );

        // Determine status
        const status = testResults.allPassed
            ? 'PASSED'
            : testResults.passedTests > 0
                ? 'PARTIAL'
                : 'FAILED';

        // Save submission
        const submission = await prisma.codeSubmission.create({
            data: {
                userId,
                problemId,
                code,
                language,
                status,
                testsPassed: testResults.passedTests,
                testsTotal: testResults.totalTests,
            },
        });

        // Award XP if all tests passed
        if (testResults.allPassed) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    xp: { increment: problem.xpReward },
                },
            });

            // Update leaderboard
            await prisma.leaderboard.upsert({
                where: { userId },
                update: {
                    totalXP: { increment: problem.xpReward },
                    lastUpdated: new Date(),
                },
                create: {
                    userId,
                    totalXP: problem.xpReward,
                },
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                submission,
                testResults,
                xpAwarded: testResults.allPassed ? problem.xpReward : 0,
            },
        });
    } catch (error) {
        console.error('Code submission error:', error);
        return res.status(500).json({
            success: false,
            message: 'Code submission failed',
            error: error.message,
        });
    }
};

/**
 * Get all coding problems
 * GET /code/problems
 */
const getProblems = async (req, res) => {
    try {
        const problems = await prisma.codeProblem.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                language: true,
                xpReward: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json({
            success: true,
            data: problems,
        });
    } catch (error) {
        console.error('Get problems error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch problems',
            error: error.message,
        });
    }
};

/**
 * Get specific problem with test cases
 * GET /code/problems/:id
 */
const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await prisma.codeProblem.findUnique({
            where: { id },
            include: {
                testCases: {
                    where: { isHidden: false }, // Only return visible test cases
                },
            },
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: problem,
        });
    } catch (error) {
        console.error('Get problem error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch problem',
            error: error.message,
        });
    }
};

/**
 * Get user submissions
 * GET /code/submissions/:userId
 */
const getUserSubmissions = async (req, res) => {
    try {
        const { userId } = req.params;

        const submissions = await prisma.codeSubmission.findMany({
            where: { userId },
            include: {
                problem: {
                    select: {
                        title: true,
                        difficulty: true,
                        xpReward: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error('Get submissions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.message,
        });
    }
};

/**
 * Get supported languages from Piston
 * GET /code/languages
 */
const getSupportedLanguages = async (req, res) => {
    try {
        const runtimes = await pistonService.getRuntimes();

        return res.status(200).json({
            success: true,
            data: runtimes,
        });
    } catch (error) {
        console.error('Get languages error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch supported languages',
            error: error.message,
        });
    }
};

module.exports = {
    executeCode,
    submitCode,
    getProblems,
    getProblemById,
    getUserSubmissions,
    getSupportedLanguages,
};
