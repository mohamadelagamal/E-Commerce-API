const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Strict rate limiter for authentication routes
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        status: 'error',
        message: 'Too many authentication attempts, please try again later'
    },
    skipSuccessfulRequests: true
});

/**
 * Rate limiter for password reset
 */
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per hour
    message: {
        status: 'error',
        message: 'Too many password reset attempts, please try again later'
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    passwordResetLimiter
};
