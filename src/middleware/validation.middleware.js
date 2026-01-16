const Joi = require('joi');
const ApiError = require('../utils/ApiError');

/**
 * Validate request data against Joi schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        const { error, value } = schema.validate(
            {
                body: req.body,
                query: req.query,
                params: req.params
            },
            validationOptions
        );

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            return next(new ApiError(errorMessage, 400));
        }

        // Replace request data with validated data
        req.body = value.body || req.body;
        req.query = value.query || req.query;
        req.params = value.params || req.params;

        next();
    };
};

module.exports = { validate };
