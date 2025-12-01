
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('--- Database Connection Diagnostic ---');

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ Error: DATABASE_URL is not defined in .env');
        return;
    }

    // Mask password for logging
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`Attempting to connect to: ${maskedUrl}`);

    try {
        await prisma.$connect();
        console.log('✅ Success: Connected to the database!');

        // Try a simple query
        const userCount = await prisma.user.count();
        console.log(`✅ Query Test: Found ${userCount} users.`);

    } catch (e) {
        console.error('❌ Connection Failed:');
        console.error(e.message);

        if (e.message.includes('Authentication failed')) {
            console.log('\n--- Troubleshooting Tips ---');
            console.log('1. Double-check your password.');
            console.log('2. If your password contains special characters (e.g., #, @, /), they must be URL-encoded.');
            console.log('   Example: "p@ssword" -> "p%40ssword"');
            console.log('3. Verify the username (currently "root") is correct.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
