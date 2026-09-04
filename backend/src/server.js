const app = require('./app');
const environment = require('./config/environment');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { verifyEmailTransporter } = require('./services/emailService');

const PORT = environment.PORT;

let server;

/**
 * Bootstrap the HTTP server
 */
async function startServer() {
  try {
    // 1. Verify database connectivity
    await connectDatabase();

    // 2. Verify email transporter (non-fatal check)
    await verifyEmailTransporter().catch((err) => {
      console.warn('[EmailService] SMTP verification notice:', err.message);
    });

    // 3. Start HTTP listener
    server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
      console.log(`📡 Environment: ${environment.NODE_ENV}`);
      console.log(`🌐 Allowed Frontend: ${environment.FRONTEND_URL}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Failed to start server due to startup error:', error.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown procedure
 */
async function gracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDatabase();
      console.log('[Server] Graceful shutdown completed. Exiting.');
      process.exit(0);
    });

    // Force close after 10 seconds if shutdown hangs
    setTimeout(() => {
      console.error('[Server] Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

// Register process signal handlers
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Process-level unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception thrown:', error);
  gracefulShutdown('uncaughtException');
});

startServer();
