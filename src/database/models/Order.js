const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    image: String
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        phone: String
    },
    paymentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        note: String,
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    trackingNumber: String,
    shippingCarrier: String,
    notes: String,
    cancelledAt: Date,
    cancelReason: String,
    deliveredAt: Date
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
    }
    next();
});

// Add status to history when status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            updatedAt: new Date()
        });
    }
    next();
});

// Method to cancel order
orderSchema.methods.cancelOrder = function (reason) {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    this.cancelReason = reason;
    return this.save();
};

// Method to mark as delivered
orderSchema.methods.markAsDelivered = function () {
    this.status = 'delivered';
    this.deliveredAt = new Date();
    return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
