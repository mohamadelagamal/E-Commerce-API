require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    apiVersion: process.env.API_VERSION || 'v1',

    database: {
        uri: process.env.MONGODB_URI,
        testUri: process.env.MONGODB_TEST_URI
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expire: process.env.JWT_EXPIRE || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d'
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || ''
    },



    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    },

    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM
    },

    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000'
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
        allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp']
    }
};

module.exports = config;
