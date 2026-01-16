const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        // ⚠️ TEMPORARY FALLBACK: Use provided URI if env var is missing
        // TODO: Remove this fallback after configuring Hostinger Environment Variables
        const uri = process.env.MONGODB_URI || "mongodb+srv://mohamadelgamaltech_db_user:os0FEJURXsTpvJ4Z@cluster0.ickywlq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

        console.log('🔍 Attempting MongoDB connection...');
        console.log('🔍 Using URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

        if (!uri) {
            console.error('❌ MONGODB_URI is not defined and no fallback available');
            return null;
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip IPv6
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error(`❌ Error Code: ${error.code}`);
        console.error(`❌ Full Error:`, error);
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
