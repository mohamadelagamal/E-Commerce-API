const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Get user cart
 * @route   GET /api/v1/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);
    ApiResponse.success(res, 'Cart retrieved successfully', { cart });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/v1/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, productId, quantity);
    ApiResponse.success(res, 'Item added to cart', { cart });
});

/**
 * @desc    Update cart item
 * @route   PUT /api/v1/cart/:itemId
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user._id, req.params.itemId, quantity);
    ApiResponse.success(res, 'Cart item updated', { cart });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/cart/:itemId
 * @access  Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await cartService.removeFromCart(req.user._id, req.params.itemId);
    ApiResponse.success(res, 'Item removed from cart', { cart });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/v1/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    ApiResponse.success(res, 'Cart cleared', { cart });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
