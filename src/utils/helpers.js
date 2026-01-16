const crypto = require('crypto');

/**
 * Generate random string
 */
const generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate OTP
 */
const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    return {
        skip,
        limit: limitNum,
        page: pageNum
    };
};

/**
 * Calculate pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

/**
 * Async handler wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

/**
 * Format price
 */
const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(price);
};

/**
 * Calculate discount percentage
 */
const calculateDiscount = (originalPrice, discountedPrice) => {
    if (originalPrice <= discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Generate slug from string
 */
const generateSlug = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

module.exports = {
    generateRandomString,
    generateOTP,
    paginate,
    getPaginationMeta,
    asyncHandler,
    sanitizeInput,
    formatPrice,
    calculateDiscount,
    generateSlug
};
