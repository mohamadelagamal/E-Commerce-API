const User = require('../database/models/User');
const ApiError = require('../utils/ApiError');

/**
 * Get user profile
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, updateData) => {
    const { name, phone, avatar } = updateData;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    return user;
};

/**
 * Change password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
        throw new ApiError('Current password is incorrect', 400);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    return true;
};

/**
 * Add address
 */
const addAddress = async (userId, addressData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || addressData.isDefault) {
        // Remove default from other addresses
        user.addresses.forEach(addr => addr.isDefault = false);
        addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    return user;
};

/**
 * Update address
 */
const updateAddress = async (userId, addressId, addressData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError('Address not found', 404);
    }

    // Update address fields
    Object.assign(address, addressData);

    // If setting as default, remove default from others
    if (addressData.isDefault) {
        user.addresses.forEach(addr => {
            if (addr._id.toString() !== addressId) {
                addr.isDefault = false;
            }
        });
    }

    await user.save();

    return user;
};

/**
 * Delete address
 */
const deleteAddress = async (userId, addressId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    user.addresses = user.addresses.filter(
        addr => addr._id.toString() !== addressId
    );

    await user.save();

    return user;
};

/**
 * Get all users (Admin)
 */
const getAllUsers = async (filters = {}) => {
    const { page = 1, limit = 10, role, isActive } = filters;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Deactivate user (Admin)
 */
const deactivateUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    user.isActive = false;
    await user.save();

    return user;
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllUsers,
    deactivateUser
};
