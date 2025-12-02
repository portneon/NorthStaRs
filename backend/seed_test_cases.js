const prisma = require('./prisma/prisma');

async function main() {
    const problem = await prisma.codeProblem.findFirst({
        where: { title: 'Binary Inversion' }
    });

    if (!problem) {
        console.log('Problem not found');
        return;
    }

    // Clear existing test cases to avoid duplicates if re-running
    await prisma.testCase.deleteMany({
        where: { problemId: problem.id }
    });

    await prisma.testCase.create({
        data: {
            problemId: problem.id,
            input: 'root = [4,2,7,1,3,6,9]',
            expected: '[4,7,2,9,6,3,1]',
            isHidden: false
        }
    });

    console.log('Test case added for problem:', problem.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
