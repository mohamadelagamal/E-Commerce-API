const express = require('express');
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { uploadMultiple } = require('../middleware/upload.middleware');
const { createProductSchema, updateProductSchema, objectIdSchema } = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', validate(objectIdSchema), productController.getProductById);

// Protected routes
router.post('/:id/reviews', protect, productController.addReview);

// Admin routes
router.post(
    '/',
    protect,
    authorize('admin'),
    uploadMultiple('images', 5),
    validate(createProductSchema),
    productController.createProduct
);

router.put(
    '/:id',
    protect,
    authorize('admin'),
    uploadMultiple('images', 5),
    validate(updateProductSchema),
    productController.updateProduct
);

router.delete(
    '/:id',
    protect,
    authorize('admin'),
    productController.deleteProduct
);

module.exports = router;
