const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../database/models/Payment');
const Order = require('../database/models/Order');
const ApiError = require('../utils/ApiError');

/**
 * Create payment intent
 */
const createPaymentIntent = async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError('Order not found', 404);
    }

    if (order.user.toString() !== userId.toString()) {
        throw new ApiError('Not authorized', 403);
    }

    // Create payment record
    const payment = await Payment.create({
        order: orderId,
        user: userId,
        amount: order.total,
        paymentMethod: 'card',
        status: 'pending'
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
            orderId: orderId.toString(),
            paymentId: payment._id.toString()
        }
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    await payment.save();

    return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
    };
};

/**
 * Confirm payment
 */
const confirmPayment = async (paymentId, paymentIntentId) => {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
        await payment.markAsSucceeded(paymentIntent.id);

        // Update order
        const order = await Order.findById(payment.order);
        order.status = 'processing';
        order.paymentInfo = payment._id;
        await order.save();

        return { success: true, payment };
    } else {
        await payment.markAsFailed('Payment not completed');
        throw new ApiError('Payment failed', 400);
    }
};

/**
 * Process refund
 */
const processRefund = async (paymentId, amount, reason) => {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }

    if (payment.status !== 'succeeded') {
        throw new ApiError('Cannot refund unsuccessful payment', 400);
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: Math.round(amount * 100)
    });

    await payment.processRefund(refund.id, amount, reason);

    // Update order status
    const order = await Order.findById(payment.order);
    order.status = 'refunded';
    await order.save();

    return payment;
};

/**
 * Get payment by order
 */
const getPaymentByOrder = async (orderId) => {
    const payment = await Payment.findOne({ order: orderId });

    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }

    return payment;
};

/**
 * Handle Stripe webhook
 */
const handleWebhook = async (event) => {
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const payment = await Payment.findOne({
                stripePaymentIntentId: paymentIntent.id
            });

            if (payment) {
                await payment.markAsSucceeded(paymentIntent.id);
            }
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            const failedPayment = await Payment.findOne({
                stripePaymentIntentId: failedIntent.id
            });

            if (failedPayment) {
                await failedPayment.markAsFailed(failedIntent.last_payment_error?.message);
            }
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
    processRefund,
    getPaymentByOrder,
    handleWebhook
};
