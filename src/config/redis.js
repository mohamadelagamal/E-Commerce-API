const redis = require('redis');
const logger = require('../utils/logger');
const config = require('./environment');

let redisClient = null;

const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            socket: {
                host: config.redis.host,
                port: config.redis.port
            },
            password: config.redis.password || undefined
        });

        redisClient.on('error', (err) => {
            logger.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            logger.info('Redis Client Connected');
            console.log('✅ Redis Connected');
        });

        redisClient.on('ready', () => {
            logger.info('Redis Client Ready');
        });

        redisClient.on('end', () => {
            logger.warn('Redis Client Disconnected');
        });

        await redisClient.connect();

        return redisClient;
    } catch (error) {
        logger.error('Redis Connection Error:', error);
        console.error('❌ Redis Connection Error:', error.message);
        // Don't exit process, allow app to run without Redis
        return null;
    }
};

const getRedisClient = () => {
    return redisClient;
};

const disconnectRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
    }
};

module.exports = {
    connectRedis,
    getRedisClient,
    disconnectRedis
};
