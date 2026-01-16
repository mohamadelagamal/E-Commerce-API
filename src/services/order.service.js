const Order = require('../database/models/Order');
const Cart = require('../database/models/Cart');
const Product = require('../database/models/Product');
const ApiError = require('../utils/ApiError');
const { paginate, getPaginationMeta } = require('../utils/helpers');

/**
 * Create order from cart
 */
const createOrder = async (userId, orderData) => {
    const { shippingAddress, paymentMethod } = orderData;

    // Get user cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new ApiError('Cart is empty', 400);
    }

    // Verify stock availability
    for (let item of cart.items) {
        const product = await Product.findById(item.product._id);

        if (!product.isInStock() || product.stock < item.quantity) {
            throw new ApiError(`Product ${product.name} is out of stock`, 400);
        }
    }

    // Calculate totals
    const subtotal = cart.totalPrice;
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shippingCost;

    // Create order items
    const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0]?.url
    }));

    // Create order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        subtotal,
        tax,
        shippingCost,
        total
    });

    // Update product stock
    for (let item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity }
        });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    return order;
};

/**
 * Get user orders
 */
const getUserOrders = async (userId, filters = {}) => {
    const { page = 1, limit = 10, status } = filters;

    const query = { user: userId };
    if (status) query.status = status;

    const { skip, limit: limitNum } = paginate(page, limit);

    const orders = await Order.find(query)
        .populate('items.product')
        .skip(skip)
        .limit(limitNum)
        .sort('-createdAt');

    const total = await Order.countDocuments(query);

    return {
        orders,
        pagination: getPaginationMeta(total, parseInt(page), parseInt(limit))
    };
};

/**
 * Get order by ID
 */
const getOrderById = async (orderId, userId) => {
    const order = await Order.findById(orderId)
        .populate('items.product')
        .populate('paymentInfo');

    if (!order) {
        throw new ApiError('Order not found', 404);
    }

    // Check if order belongs to user
    if (order.user.toString() !== userId.toString()) {
        throw new ApiError('Not authorized to access this order', 403);
    }

    return order;
};

/**
 * Cancel order
 */
const cancelOrder = async (orderId, userId, reason) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError('Order not found', 404);
    }

    // Check if order belongs to user
    if (order.user.toString() !== userId.toString()) {
        throw new ApiError('Not authorized to cancel this order', 403);
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
        throw new ApiError(`Cannot cancel order with status: ${order.status}`, 400);
    }

    // Restore product stock
    for (let item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
        });
    }

    await order.cancelOrder(reason);

    return order;
};

/**
 * Update order status (Admin)
 */
const updateOrderStatus = async (orderId, status, note) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError('Order not found', 404);
    }

    order.status = status;

    if (note) {
        order.statusHistory.push({
            status,
            note,
            updatedAt: new Date()
        });
    }

    if (status === 'delivered') {
        order.deliveredAt = new Date();
    }

    await order.save();

    return order;
};

/**
 * Get all orders (Admin)
 */
const getAllOrders = async (filters = {}) => {
    const { page = 1, limit = 10, status } = filters;

    const query = {};
    if (status) query.status = status;

    const { skip, limit: limitNum } = paginate(page, limit);

    const orders = await Order.find(query)
        .populate('user', 'name email')
        .populate('items.product')
        .skip(skip)
        .limit(limitNum)
        .sort('-createdAt');

    const total = await Order.countDocuments(query);

    return {
        orders,
        pagination: getPaginationMeta(total, parseInt(page), parseInt(limit))
    };
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
};
