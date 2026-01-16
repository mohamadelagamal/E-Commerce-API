const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentIntentId: String,
    stripeChargeId: String,
    paymentDetails: {
        cardLast4: String,
        cardBrand: String,
        cardExpMonth: Number,
        cardExpYear: Number
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    refundInfo: {
        refundId: String,
        refundAmount: Number,
        refundReason: String,
        refundedAt: Date
    },
    failureReason: String,
    metadata: {
        type: Map,
        of: String
    },
    paidAt: Date
}, {
    timestamps: true
});

// Index for faster queries
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

// Method to mark payment as succeeded
paymentSchema.methods.markAsSucceeded = function (transactionId, paidAt = new Date()) {
    this.status = 'succeeded';
    this.transactionId = transactionId;
    this.paidAt = paidAt;
    return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function (reason) {
    this.status = 'failed';
    this.failureReason = reason;
    return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function (refundId, amount, reason) {
    this.status = 'refunded';
    this.refundInfo = {
        refundId,
        refundAmount: amount,
        refundReason: reason,
        refundedAt: new Date()
    };
    return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);
