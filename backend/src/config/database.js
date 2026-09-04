const { PrismaClient } = require('@prisma/client');
const environment = require('./environment');

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      environment.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (environment.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Test the database connection safely using SELECT 1
 */
async function connectDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[Database] Connected successfully to MySQL via Prisma');
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    throw error;
  }
}

/**
 * Graceful disconnect from database
 */
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('[Database] Prisma client disconnected cleanly');
  } catch (error) {
    console.error('[Database] Error disconnecting Prisma client:', error.message);
  }
}

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase,
};
