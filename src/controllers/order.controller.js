const orderService = require('../services/order.service');
const emailService = require('../services/email.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Create order
 * @route   POST /api/v1/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.user._id, req.body);

    // Send confirmation email (optional)
    try {
        await emailService.sendOrderConfirmationEmail(req.user, order);
    } catch (error) {
        console.log('Order confirmation email failed:', error.message);
    }

    ApiResponse.created(res, 'Order created successfully', { order });
});

/**
 * @desc    Get user orders
 * @route   GET /api/v1/orders
 * @access  Private
 */
const getUserOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getUserOrders(req.user._id, req.query);
    ApiResponse.success(res, 'Orders retrieved successfully', result);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id, req.user._id);
    ApiResponse.success(res, 'Order retrieved successfully', { order });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/v1/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const order = await orderService.cancelOrder(req.params.id, req.user._id, reason);
    ApiResponse.success(res, 'Order cancelled successfully', { order });
});

/**
 * @desc    Update order status
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status, note);

    // Send email if shipped (optional)
    if (status === 'shipped') {
        try {
            const User = require('../database/models/User');
            const user = await User.findById(order.user);
            await emailService.sendOrderShippedEmail(user, order);
        } catch (error) {
            console.log('Order shipped email failed:', error.message);
        }
    }

    ApiResponse.success(res, 'Order status updated successfully', { order });
});

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders/admin/all
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getAllOrders(req.query);
    ApiResponse.success(res, 'Orders retrieved successfully', result);
});

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
};
