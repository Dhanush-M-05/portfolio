import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ENV from './config/environment.js';
import prisma from './config/database.js';
import errorHandler from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import navigationRoutes from './routes/navigationRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';

const app = express();

/* =========================================================
   TRUST PROXY
   ========================================================= */

if (ENV.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

/* =========================================================
   SECURITY HEADERS
   ========================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

/* =========================================================
   CORS CONFIGURATION
   ========================================================= */

const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',

  // Production frontend
  'https://dhanushweb.vercel.app',

  // Environment variable
  ENV.FRONTEND_URL,
].filter(Boolean);

// Remove duplicate origins
const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header
      // Example: curl, Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured frontend origins
      if (uniqueOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Development mode:
      // allow other origins for easier local testing
      if (ENV.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // Production:
      // reject unknown origins
      console.error(`CORS blocked origin: ${origin}`);

      return callback(
        new Error(`Origin ${origin} not allowed by CORS`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
    ],

    exposedHeaders: [
      'Content-Disposition',
    ],

    optionsSuccessStatus: 204,
  })
);

/*
 * Explicitly handle CORS preflight requests.
 * Important for POST/PUT/PATCH requests and Authorization headers.
 */
app.options('*', cors());

/* =========================================================
   BODY PARSERS
   ========================================================= */

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

/* =========================================================
   GLOBAL API RATE LIMITER
   ========================================================= */

app.use('/api', apiLimiter);

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    console.error('Database health check failed:', error);

    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'connected';

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy
      ? 'API is running'
      : 'Database service unavailable',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

/* =========================================================
   API ROUTES
   ========================================================= */

// Authentication
app.use('/api/auth', authRoutes);

// Profile
app.use('/api/profile', profileRoutes);

// Hero
app.use('/api/hero', heroRoutes);

// About
app.use('/api/about', aboutRoutes);

// Services
app.use('/api/services', serviceRoutes);

// Skills
app.use('/api/skills', skillRoutes);

// Projects
app.use('/api/projects', projectRoutes);

// Experience
app.use('/api/experience', experienceRoutes);

// Education
app.use('/api/education', educationRoutes);

// Certifications
app.use('/api/certifications', certificationRoutes);

// Achievements
app.use('/api/achievements', achievementRoutes);

// Resume
app.use('/api/resume', resumeRoutes);

// Social Links
app.use('/api/social-links', socialRoutes);

// Navigation
app.use('/api/navigation', navigationRoutes);

// Footer
app.use('/api/footer', footerRoutes);

// Website Settings
app.use('/api/settings', settingsRoutes);

// Contact
app.use('/api/contact', contactRoutes);

// Homepage
app.use('/api/homepage', homepageRoutes);

// Legacy compatibility route
// Frontend can continue using /api/sections
app.use('/api/sections', homepageRoutes);

/* =========================================================
   API ROOT
   ========================================================= */

app.get('/api', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Dhanush M Portfolio API is running',
    version: '1.0.0',
    environment: ENV.NODE_ENV,
  });
});

/* =========================================================
   404 HANDLER
   ========================================================= */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

/* =========================================================
   CENTRALIZED ERROR HANDLER
   ========================================================= */

app.use(errorHandler);

/* =========================================================
   EXPORT APP
   ========================================================= */

export default app;
