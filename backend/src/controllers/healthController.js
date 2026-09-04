const { prisma } = require('../config/database');

/**
 * Health check endpoint
 * GET /api/health
 */
async function getHealth(req, res) {
  try {
    // Safely query the database
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: 'API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'API is running but database is disconnected',
      database: 'disconnected',
      error: error.message,
    });
  }
}

module.exports = {
  getHealth,
};
