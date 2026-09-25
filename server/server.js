const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB().then(() => {
  const HOST = '0.0.0.0';
  const server = app.listen(PORT, HOST, () => {
    logger.info(`PromoteHub Server running in ${process.env.NODE_ENV || 'development'} mode on ${HOST}:${PORT}`);
    logger.info(`Health check: http://${HOST}:${PORT}/health (or /api/health)`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`, err.stack);
    server.close(() => process.exit(1));
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err.stack);
    process.exit(1);
  });
}).catch((err) => {
  logger.error(`Initial server boot failure: ${err.message}`);
  process.exit(1);
});
