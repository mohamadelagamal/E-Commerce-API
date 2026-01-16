require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Log Public IP for MongoDB Whitelisting
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('================================================');
    console.log(`🌍 SERVER PUBLIC IP: ${data.ip}`);
    console.log('⚠️  ADD THIS IP TO MONGODB ATLAS NETWORK ACCESS');
    console.log('================================================');
  } catch (err) {
    console.error('Failed to resolve public IP:', err.message);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = server;
