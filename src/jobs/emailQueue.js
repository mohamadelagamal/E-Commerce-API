const Queue = require('bull');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');
const config = require('../config/environment');

// Create email queue
const emailQueue = new Queue('email', {
    redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined
    }
});

// Process email jobs
emailQueue.process(async (job) => {
    const { type, data } = job.data;

    try {
        switch (type) {
            case 'welcome':
                await emailService.sendWelcomeEmail(data.user);
                break;

            case 'password-reset':
                await emailService.sendPasswordResetEmail(data.user, data.resetToken);
                break;

            case 'order-confirmation':
                await emailService.sendOrderConfirmationEmail(data.user, data.order);
                break;

            case 'order-shipped':
                await emailService.sendOrderShippedEmail(data.user, data.order);
                break;

            default:
                logger.warn(`Unknown email type: ${type}`);
        }

        logger.info(`Email sent: ${type}`);
    } catch (error) {
        logger.error(`Email sending failed: ${type}`, error);
        throw error;
    }
});

// Queue event listeners
emailQueue.on('completed', (job) => {
    logger.info(`Email job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
    logger.error(`Email job ${job.id} failed:`, err);
});

/**
 * Add email to queue
 */
const addEmailToQueue = async (type, data, options = {}) => {
    return emailQueue.add(
        { type, data },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            ...options
        }
    );
};

module.exports = {
    emailQueue,
    addEmailToQueue
};
