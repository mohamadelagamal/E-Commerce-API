const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update totals before saving
cartSchema.pre('save', function (next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.lastModified = Date.now();
    next();
});

// Method to add item to cart
cartSchema.methods.addItem = function (productId, quantity, price) {
    const existingItem = this.items.find(item => item.product.toString() === productId.toString());

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ product: productId, quantity, price });
    }

    return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (itemId) {
    this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
    const item = this.items.find(item => item._id.toString() === itemId.toString());

    if (item) {
        item.quantity = quantity;
    }

    return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
    this.items = [];
    return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
