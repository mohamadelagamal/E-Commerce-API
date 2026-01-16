const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const config = require('../config/environment');

// Configure multer storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Check file type
    if (config.upload.allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError('Invalid file type. Only images are allowed', 400), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: fileFilter
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        const uploadHandler = upload.single(fieldName);

        uploadHandler(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(new ApiError('File size too large. Maximum size is 5MB', 400));
                }
                return next(new ApiError(err.message, 400));
            } else if (err) {
                return next(err);
            }
            next();
        });
    };
};

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 5) => {
    return (req, res, next) => {
        const uploadHandler = upload.array(fieldName, maxCount);

        uploadHandler(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(new ApiError('File size too large. Maximum size is 5MB', 400));
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return next(new ApiError(`Too many files. Maximum is ${maxCount}`, 400));
                }
                return next(new ApiError(err.message, 400));
            } else if (err) {
                return next(err);
            }
            next();
        });
    };
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple
};
