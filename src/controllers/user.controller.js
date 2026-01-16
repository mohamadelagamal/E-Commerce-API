const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/helpers');
const { uploadToLocal } = require('../utils/fileUpload');

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user._id);
    ApiResponse.success(res, 'Profile retrieved successfully', { user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
    let updateData = req.body;

    // Handle avatar upload
    if (req.file) {
        const avatarUrl = await uploadToLocal(req.file.buffer, req.file.originalname, req.file.mimetype);
        updateData.avatar = avatarUrl;
    }

    const user = await userService.updateProfile(req.user._id, updateData);
    ApiResponse.success(res, 'Profile updated successfully', { user });
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/users/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, currentPassword, newPassword);
    ApiResponse.success(res, 'Password changed successfully');
});

/**
 * @desc    Add address
 * @route   POST /api/v1/users/addresses
 * @access  Private
 */
const addAddress = asyncHandler(async (req, res) => {
    const user = await userService.addAddress(req.user._id, req.body);
    ApiResponse.created(res, 'Address added successfully', { user });
});

/**
 * @desc    Update address
 * @route   PUT /api/v1/users/addresses/:addressId
 * @access  Private
 */
const updateAddress = asyncHandler(async (req, res) => {
    const user = await userService.updateAddress(req.user._id, req.params.addressId, req.body);
    ApiResponse.success(res, 'Address updated successfully', { user });
});

/**
 * @desc    Delete address
 * @route   DELETE /api/v1/users/addresses/:addressId
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await userService.deleteAddress(req.user._id, req.params.addressId);
    ApiResponse.success(res, 'Address deleted successfully', { user });
});

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    ApiResponse.success(res, 'Users retrieved successfully', result);
});

/**
 * @desc    Deactivate user
 * @route   PUT /api/v1/users/:id/deactivate
 * @access  Private/Admin
 */
const deactivateUser = asyncHandler(async (req, res) => {
    const user = await userService.deactivateUser(req.params.id);
    ApiResponse.success(res, 'User deactivated successfully', { user });
});

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
