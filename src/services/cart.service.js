const Cart = require('../database/models/Cart');
const Product = require('../database/models/Product');
const ApiError = require('../utils/ApiError');

/**
 * Get user cart
 */
const getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
};

/**
 * Add item to cart
 */
const addToCart = async (userId, productId, quantity) => {
    // Check if product exists and is in stock
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    if (!product.isActive) {
        throw new ApiError('Product is not available', 400);
    }

    if (product.stock < quantity) {
        throw new ApiError('Insufficient stock', 400);
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
        item => item.product.toString() === productId
    );

    if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;

        if (product.stock < newQuantity) {
            throw new ApiError('Insufficient stock', 400);
        }

        existingItem.quantity = newQuantity;
    } else {
        // Add new item
        cart.items.push({
            product: productId,
            quantity,
            price: product.price
        });
    }

    await cart.save();
    await cart.populate('items.product');

    return cart;
};

/**
 * Update cart item quantity
 */
const updateCartItem = async (userId, itemId, quantity) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    const item = cart.items.id(itemId);

    if (!item) {
        throw new ApiError('Item not found in cart', 404);
    }

    // Check stock
    const product = await Product.findById(item.product);

    if (product.stock < quantity) {
        throw new ApiError('Insufficient stock', 400);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    return cart;
};

/**
 * Remove item from cart
 */
const removeFromCart = async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate('items.product');

    return cart;
};

/**
 * Clear cart
 */
const clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    cart.items = [];
    await cart.save();

    return cart;
};

/**
 * Sync cart prices
 */
const syncCartPrices = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        return null;
    }

    // Update prices based on current product prices
    for (let item of cart.items) {
        if (item.product) {
            item.price = item.product.price;
        }
    }

    await cart.save();

    return cart;
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCartPrices
};
