const Product = require('../database/models/Product');
const ApiError = require('../utils/ApiError');
const { paginate, getPaginationMeta } = require('../utils/helpers');

/**
 * Get all products
 */
const getAllProducts = async (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        category,
        minPrice,
        maxPrice,
        search,
        sort = '-createdAt',
        isActive = true
    } = filters;

    // Build query
    const query = { isActive };

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
        query.$text = { $search: search };
    }

    const { skip, limit: limitNum } = paginate(page, limit);

    const products = await Product.find(query)
        .skip(skip)
        .limit(limitNum)
        .sort(sort);

    const total = await Product.countDocuments(query);

    return {
        products,
        pagination: getPaginationMeta(total, parseInt(page), parseInt(limit))
    };
};

/**
 * Get product by ID
 */
const getProductById = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    return product;
};

/**
 * Create new product
 */
const createProduct = async (productData) => {
    const product = await Product.create(productData);
    return product;
};

/**
 * Update product
 */
const updateProduct = async (productId, updateData) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    Object.assign(product, updateData);
    await product.save();

    return product;
};

/**
 * Delete product
 */
const deleteProduct = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    return product;
};

/**
 * Add product review
 */
const addReview = async (productId, userId, rating, comment) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
        review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
        throw new ApiError('You have already reviewed this product', 400);
    }

    // Add review
    product.reviews.push({
        user: userId,
        rating,
        comment
    });

    // Update rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating.average = totalRating / product.reviews.length;
    product.rating.count = product.reviews.length;

    await product.save();

    return product;
};

/**
 * Update stock
 */
const updateStock = async (productId, quantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    product.stock += quantity;

    if (product.stock < 0) {
        throw new ApiError('Insufficient stock', 400);
    }

    await product.save();

    return product;
};

/**
 * Get featured products
 */
const getFeaturedProducts = async (limit = 10) => {
    const products = await Product.find({ isFeatured: true, isActive: true })
        .limit(limit)
        .sort('-createdAt');

    return products;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview,
    updateStock,
    getFeaturedProducts
};
