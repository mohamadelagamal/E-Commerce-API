const Queue = require('bull');
const Order = require('../database/models/Order');
const Product = require('../database/models/Product');
const logger = require('../utils/logger');
const config = require('../config/environment');

// Create order processing queue
const orderQueue = new Queue('order-processing', {
    redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined
    }
});

// Process order jobs
orderQueue.process(async (job) => {
    const { type, data } = job.data;

    try {
        switch (type) {
            case 'update-inventory':
                await updateInventory(data.orderId);
                break;

            case 'check-low-stock':
                await checkLowStock();
                break;

            case 'auto-cancel-pending':
                await autoCancelPendingOrders();
                break;

            default:
                logger.warn(`Unknown order processing type: ${type}`);
        }

        logger.info(`Order processing completed: ${type}`);
    } catch (error) {
        logger.error(`Order processing failed: ${type}`, error);
        throw error;
    }
});

/**
 * Update inventory after order
 */
const updateInventory = async (orderId) => {
    const order = await Order.findById(orderId).populate('items.product');

    for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (product && product.isLowStock()) {
            logger.warn(`Low stock alert: ${product.name} (${product.stock} remaining)`);
            // Could trigger notification here
        }
    }
};

/**
 * Check for low stock products
 */
const checkLowStock = async () => {
    const products = await Product.find({ isActive: true });

    const lowStockProducts = products.filter(p => p.isLowStock());

    if (lowStockProducts.length > 0) {
        logger.warn(`Found ${lowStockProducts.length} low stock products`);
        // Could send notification to admin
    }
};

/**
 * Auto-cancel pending orders older than 24 hours
 */
const autoCancelPendingOrders = async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingOrders = await Order.find({
        status: 'pending',
        createdAt: { $lt: oneDayAgo }
    });

    for (const order of pendingOrders) {
        await order.cancelOrder('Auto-cancelled due to no payment');
        logger.info(`Auto-cancelled order: ${order.orderNumber}`);
    }
};

/**
 * Add order processing job to queue
 */
const addOrderProcessingJob = async (type, data, options = {}) => {
    return orderQueue.add(
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
    orderQueue,
    addOrderProcessingJob
};
