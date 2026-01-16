const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/helpers');
const emailService = require('../services/email.service');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const { user, token, refreshToken } = await authService.register(req.body);

    // Send welcome email (optional - don't fail if email service is not configured)
    try {
        await emailService.sendWelcomeEmail(user);
    } catch (error) {
        console.log('Email sending failed (this is optional):', error.message);
    }

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    ApiResponse.created(res, 'User registered successfully', {
        user,
        token,
        refreshToken
    });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await authService.login(email, password);

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    ApiResponse.success(res, 'Login successful', {
        user,
        token,
        refreshToken
    });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);

    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    ApiResponse.success(res, 'Logout successful');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const { token } = await authService.refreshAccessToken(refreshToken);

    ApiResponse.success(res, 'Token refreshed successfully', { token });
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const resetToken = await authService.forgotPassword(email);

    // Send reset email (optional - don't fail if email service is not configured)
    try {
        const user = await require('../database/models/User').findOne({ email });
        await emailService.sendPasswordResetEmail(user, resetToken);
    } catch (error) {
        console.log('Password reset email failed (this is optional):', error.message);
    }

    ApiResponse.success(res, 'Password reset email sent');
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    ApiResponse.success(res, 'Password reset successful');
});

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
};
