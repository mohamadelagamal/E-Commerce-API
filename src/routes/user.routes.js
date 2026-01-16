const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadSingle } = require('../middleware/upload.middleware');

const router = express.Router();

// User routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, uploadSingle('avatar'), userController.updateProfile);
router.put('/password', protect, userController.changePassword);

// Address routes
router.post('/addresses', protect, userController.addAddress);
router.put('/addresses/:addressId', protect, userController.updateAddress);
router.delete('/addresses/:addressId', protect, userController.deleteAddress);

// Admin routes
router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.put('/:id/deactivate', protect, authorize('admin'), userController.deactivateUser);

module.exports = router;
