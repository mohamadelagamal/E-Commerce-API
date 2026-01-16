const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const ApiError = require('../utils/ApiError');
const config = require('../config/environment');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new ApiError('Not authorized to access this route', 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return next(new ApiError('User not found', 404));
            }

            if (!req.user.isActive) {
                return next(new ApiError('User account is deactivated', 403));
            }

            next();
        } catch (error) {
            return next(new ApiError('Not authorized to access this route', 401));
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Authorize specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    `User role '${req.user.role}' is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
