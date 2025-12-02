const prisma = require('./prisma/prisma');

async function main() {
    const user = await prisma.user.findFirst();
    const problem = await prisma.codeProblem.findFirst({
        where: { title: 'Binary Inversion' },
        include: { testCases: true }
    });

    if (!user || !problem) {
        console.log('User or Problem not found');
        return;
    }

    console.log(`USER_ID=${user.id}`);
    console.log(`PROBLEM_ID=${problem.id}`);
    console.log('TEST_CASES:', JSON.stringify(problem.testCases));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
