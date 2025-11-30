const prisma = require('../prisma/prisma');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        console.log('🔐 Creating test user...');

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });

        if (existingUser) {
            console.log('✅ Test user already exists!');
            console.log('   Email: test@example.com');
            console.log('   Password: password123');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                username: 'testuser',
                email: 'test@example.com',
                password: hashedPassword,
                operativeName: 'Test Operative',
                xp: 100,
                level: 1,
            }
        });

        console.log('✅ Test user created successfully!');
        console.log('   Email: test@example.com');
        console.log('   Password: password123');
        console.log('   Username:', user.username);
        console.log('   ID:', user.id);
        console.log('\n🎮 You can now login with these credentials!');

    } catch (error) {
        console.error('❌ Error creating test user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
