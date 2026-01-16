const logger = require('../utils/logger');

/**
 * Send notification (placeholder for future implementation)
 * This can be extended to support push notifications, SMS, etc.
 */
const sendNotification = async (userId, type, data) => {
    logger.info(`Notification sent to user ${userId}: ${type}`, data);

    // TODO: Implement actual notification logic
    // - Push notifications (Firebase, OneSignal, etc.)
    // - SMS notifications (Twilio, etc.)
    // - In-app notifications

    return {
        success: true,
        userId,
        type,
        data
    };
};

/**
 * Send order notification
 */
const sendOrderNotification = async (userId, order) => {
    return sendNotification(userId, 'order_created', {
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status
    });
};

/**
 * Send order status update notification
 */
const sendOrderStatusNotification = async (userId, order) => {
    return sendNotification(userId, 'order_status_updated', {
        orderNumber: order.orderNumber,
        status: order.status
    });
};

/**
 * Send low stock notification (Admin)
 */
const sendLowStockNotification = async (product) => {
    logger.warn(`Low stock alert for product: ${product.name} (${product.stock} remaining)`);

    return {
        success: true,
        type: 'low_stock',
        product: {
            id: product._id,
            name: product.name,
            stock: product.stock
        }
    };
};

module.exports = {
    sendNotification,
    sendOrderNotification,
    sendOrderStatusNotification,
    sendLowStockNotification
};
