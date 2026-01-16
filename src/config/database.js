const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables');
            logger.error('MONGODB_URI is not defined');
            return null; // Don't crash, just return null
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Do NOT exit process here, let the server start so we can inspect logs
        // process.exit(1); 
        return null;
    }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB error: ${err}`);
});

module.exports = connectDB;
