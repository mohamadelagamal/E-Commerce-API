const express = require('express');
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { createOrderSchema } = require('../utils/validators');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), orderController.getAllOrders);
router.put('/:id/status', authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
