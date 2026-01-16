require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Log Public IP for MongoDB Whitelisting
  const https = require('https');
  https.get('https://api.ipify.org?format=json', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
      try {
        const ip = JSON.parse(data).ip;
        console.log('================================================');
        console.log(`🌍 SERVER PUBLIC IP: ${ip}`);
        console.log('⚠️  ADD THIS IP TO MONGODB ATLAS NETWORK ACCESS');
        console.log('================================================');
      } catch (e) {
        console.error('Failed to parse IP:', e.message);
      }
    });
  }).on('error', (err) => {
    console.error('Failed to resolve public IP:', err.message);
  });
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
