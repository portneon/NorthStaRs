
const { PrismaClient } = require('@prisma/client');

const databaseUrl = 'mysql://root:root@localhost:3306/northstars';
process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to database!');
    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
