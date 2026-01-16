const Joi = require('joi');

/**
 * User registration validation schema
 */
const registerSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().optional()
    })
});

/**
 * User login validation schema
 */
const loginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
});

/**
 * Product creation validation schema
 */
const createProductSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).max(2000).required(),
        price: Joi.number().min(0).required(),
        comparePrice: Joi.number().min(0).optional(),
        category: Joi.string().valid('electronics', 'clothing', 'books', 'home', 'sports', 'toys', 'other').required(),
        subcategory: Joi.string().optional(),
        brand: Joi.string().optional(),
        sku: Joi.string().required(),
        stock: Joi.number().min(0).required(),
        tags: Joi.array().items(Joi.string()).optional()
    })
});

/**
 * Product update validation schema
 */
const updateProductSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        description: Joi.string().min(10).max(2000).optional(),
        price: Joi.number().min(0).optional(),
        comparePrice: Joi.number().min(0).optional(),
        category: Joi.string().valid('electronics', 'clothing', 'books', 'home', 'sports', 'toys', 'other').optional(),
        subcategory: Joi.string().optional(),
        brand: Joi.string().optional(),
        stock: Joi.number().min(0).optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        isActive: Joi.boolean().optional(),
        isFeatured: Joi.boolean().optional()
    })
});

/**
 * Add to cart validation schema
 */
const addToCartSchema = Joi.object({
    body: Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    })
});

/**
 * Update cart item validation schema
 */
const updateCartItemSchema = Joi.object({
    body: Joi.object({
        quantity: Joi.number().min(1).required()
    })
});

/**
 * Create order validation schema
 */
const createOrderSchema = Joi.object({
    body: Joi.object({
        shippingAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            zipCode: Joi.string().required(),
            phone: Joi.string().optional()
        }).required(),
        paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer', 'cash_on_delivery').required()
    })
});

/**
 * MongoDB ObjectId validation
 */
const objectIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
});

module.exports = {
    registerSchema,
    loginSchema,
    createProductSchema,
    updateProductSchema,
    addToCartSchema,
    updateCartItemSchema,
    createOrderSchema,
    objectIdSchema
};
