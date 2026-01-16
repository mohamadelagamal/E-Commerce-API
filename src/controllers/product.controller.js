const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/helpers');
const { uploadToLocal } = require('../utils/fileUpload');

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    ApiResponse.success(res, 'Products retrieved successfully', result);
});

/**
 * @desc    Get product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    ApiResponse.success(res, 'Product retrieved successfully', { product });
});

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    let productData = req.body;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
        const imagePromises = req.files.map(async (file, index) => {
            const url = await uploadToLocal(file.buffer, file.originalname, file.mimetype);
            return {
                url,
                alt: productData.name,
                isPrimary: index === 0
            };
        });

        productData.images = await Promise.all(imagePromises);
    }

    const product = await productService.createProduct(productData);
    ApiResponse.created(res, 'Product created successfully', { product });
});

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
    let updateData = req.body;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
        const imagePromises = req.files.map(async (file, index) => {
            const url = await uploadToLocal(file.buffer, file.originalname, file.mimetype);
            return {
                url,
                alt: updateData.name || 'Product image',
                isPrimary: index === 0
            };
        });

        updateData.images = await Promise.all(imagePromises);
    }

    const product = await productService.updateProduct(req.params.id, updateData);
    ApiResponse.success(res, 'Product updated successfully', { product });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    ApiResponse.success(res, 'Product deleted successfully');
});

/**
 * @desc    Add product review
 * @route   POST /api/v1/products/:id/reviews
 * @access  Private
 */
const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await productService.addReview(
        req.params.id,
        req.user._id,
        rating,
        comment
    );
    ApiResponse.created(res, 'Review added successfully', { product });
});

/**
 * @desc    Get featured products
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await productService.getFeaturedProducts(req.query.limit);
    ApiResponse.success(res, 'Featured products retrieved successfully', { products });
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview,
    getFeaturedProducts
};
