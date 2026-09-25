const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const dealRoutes = require('./routes/dealRoutes');
const couponRoutes = require('./routes/couponRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const hubExtrasRoutes = require('./routes/hubExtrasRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Allows frontend assets when testing locally
  })
);

// 2. CORS configuration
const isDev = process.env.NODE_ENV !== 'production';

const cleanOrigin = (url) => (url ? url.replace(/\/+$/, '') : null);

const allowedOrigins = [
  cleanOrigin(process.env.FRONTEND_URL),
  cleanOrigin(process.env.CLIENT_URL),
  'https://promotional-hub.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, server-side, or Postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = cleanOrigin(origin);

      // In local development, dynamically allow any localhost or 127.0.0.1 port
      if (
        isDev &&
        (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow Vercel production and preview deployments
      try {
        const host = new URL(origin).hostname;
        if (host === 'vercel.app' || host.endsWith('.vercel.app')) {
          return callback(null, true);
        }
      } catch (err) {}

      // Do not throw an unhandled Error that causes a 500 crash; pass false for standard CORS block
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// 3. Body Parsing Middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// 4. Basic NoSQL Query Sanitization Middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      });
    }
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  // Avoid mutating raw query strings for search keywords, but strip $ operators
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (key.startsWith('$')) {
        delete req.query[key];
      }
    });
  }
  next();
});

// 5. Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 6. Health Check Endpoints (placed before rate limiter so Render health probes are never throttled)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    healthy: true,
    platform: 'PromoteHub API',
    message: 'PromoteHub API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// 7. Rate Limiting for general API endpoints
app.use('/api', apiLimiter);

// 8. API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', hubExtrasRoutes);

// 9. Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
