import app from './app.js';
import ENV from './config/environment.js';
import prisma from './config/database.js';
import { syncAdminCredentials } from './utils/authSync.js';

const PORT = ENV.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Portfolio REST API backend running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${ENV.NODE_ENV}`);
  console.log(`🔒 Allowed CORS Frontend: ${ENV.FRONTEND_URL}`);

  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma');
    await syncAdminCredentials();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
    console.log('ℹ️ Please ensure MySQL is running and DATABASE_URL in .env is correct.');
  }
});

// Graceful Shutdown
const handleGracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('💤 HTTP server closed.');
    await prisma.$disconnect();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
