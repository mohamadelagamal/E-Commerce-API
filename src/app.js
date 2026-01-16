const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
    }));
}

// Health check endpoint
// Health check endpoint
app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        version: '1.1.0 (Fix 503)',
        last_updated: new Date().toISOString(),
        database: statusMap[dbStatus] || 'unknown',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 'unknown'
    });
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
