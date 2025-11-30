const prisma = require('../prisma/prisma');

async function seedModules() {
    try {
        console.log('🎯 Seeding modules...');

        // Create modules
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
            const existing = await prisma.module.findFirst({
                where: { title: moduleData.title }
            });

            if (!existing) {
                await prisma.module.create({ data: moduleData });
                console.log(`✅ Created module: ${moduleData.title}`);
            } else {
                console.log(`⏭️  Module already exists: ${moduleData.title}`);
            }
        }

        // Link existing grid problems to "Advanced Algorithms" module
        const advancedModule = await prisma.module.findFirst({
            where: { title: 'Advanced Algorithms' }
        });

        if (advancedModule) {
            const problems = await prisma.codeProblem.findMany({
                where: { problemType: 'grid-based' }
            });

            for (const problem of problems) {
                await prisma.codeProblem.update({
                    where: { id: problem.id },
                    data: { moduleId: advancedModule.id }
                });
            }
            console.log(`✅ Linked ${problems.length} grid problems to Advanced Algorithms module`);
        }

        console.log('✅ Module seeding complete!');
    } catch (error) {
        console.error('❌ Error seeding modules:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedModules();
