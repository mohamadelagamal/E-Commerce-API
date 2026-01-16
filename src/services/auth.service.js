const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../database/models/User');
const ApiError = require('../utils/ApiError');
const config = require('../config/environment');
const { generateRandomString } = require('../utils/helpers');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt.secret, {
        expiresIn: config.jwt.expire
    });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpire
    });
};

/**
 * Register new user
 */
const register = async (userData) => {
    const { name, email, password, phone } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError('Email already registered', 400);
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
        user,
        token,
        refreshToken
    };
};

/**
 * Login user
 */
const login = async (email, password) => {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new ApiError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new ApiError('Account is deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError('Invalid credentials', 401);
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password from response
    user.password = undefined;

    return {
        user,
        token,
        refreshToken
    };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError('Invalid refresh token', 401);
        }

        const newToken = generateToken(user._id);

        return {
            token: newToken
        };
    } catch (error) {
        throw new ApiError('Invalid refresh token', 401);
    }
};

/**
 * Logout user
 */
const logout = async (userId) => {
    const user = await User.findById(userId);

    if (user) {
        user.refreshToken = undefined;
        await user.save();
    }

    return true;
};

/**
 * Generate password reset token
 */
const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError('No user found with that email', 404);
    }

    // Generate reset token
    const resetToken = generateRandomString(32);

    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    return resetToken;
};

/**
 * Reset password
 */
const resetPassword = async (resetToken, newPassword) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError('Invalid or expired reset token', 400);
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return true;
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    generateToken,
    generateRefreshToken
};
