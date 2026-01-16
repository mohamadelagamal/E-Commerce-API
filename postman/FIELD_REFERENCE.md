# API Field Documentation - Quick Reference

## 🎯 Purpose
This guide provides a quick reference for all enum values and field constraints in the E-Commerce API.

---

## 🔐 Authentication

### Register User
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Field Requirements:**
- `name` (String, Required) - Full name of the user
- `email` (String, Required) - Valid email address
- `password` (String, Required) - Minimum 6 characters
- `phone` (String, Optional) - Phone number

---

## 👤 User Management

### Add Address
```json
{
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "isDefault": true
}
```

**Field Requirements:**
- `street` (String, Required) - Street address line
- `city` (String, Required) - City name
- `state` (String, Required) - State or province
- `country` (String, Required) - Country name
- `zipCode` (String, Required) - Postal/ZIP code
- `isDefault` (Boolean, Optional) - Set as default address

---

## 📦 Products

### Product Categories (ENUM)
Use these exact values for the `category` field:

| Value | Description |
|-------|-------------|
| `electronics` | Electronic devices and accessories |
| `clothing` | Apparel and fashion items |
| `books` | Books and publications |
| `home` | Home and furniture items |
| `sports` | Sports and fitness equipment |
| `toys` | Toys and games |
| `other` | Other miscellaneous items |

### Create Product (Admin)
```json
{
  "name": "New Product",
  "description": "High quality product description here",
  "price": 99.99,
  "category": "electronics",
  "brand": "TechBrand",
  "sku": "PROD-001",
  "stock": 100,
  "tags": ["new", "featured"],
  "isFeatured": false
}
```

**Field Requirements:**
- `name` (String, Required) - Product name (max 100 chars)
- `description` (String, Required) - Product description (min 10, max 2000 chars)
- `price` (Number, Required) - Selling price (min: 0)
- `category` (String, Required) - One of: `electronics`, `clothing`, `books`, `home`, `sports`, `toys`, `other`
- `brand` (String, Required) - Brand name (max 50 chars)
- `sku` (String, Required) - Unique Stock Keeping Unit identifier
- `stock` (Number, Required) - Available quantity (min: 0)
- `tags` (Array, Optional) - Product tags (array of strings)
- `isFeatured` (Boolean, Optional) - Mark as featured (default: false)

### Update Product (Admin)
```json
{
  "price": 89.99,
  "stock": 150,
  "isFeatured": true
}
```

**Field Requirements (All Optional):**
- `name` (String) - Product name (max 100 chars)
- `description` (String) - Product description (max 2000 chars)
- `price` (Number) - New price (min: 0)
- `stock` (Number) - New stock level (min: 0)
- `category` (String) - Product category (see enum above)
- `brand` (String) - Brand name
- `isFeatured` (Boolean) - Mark as featured product
- `tags` (Array) - Product tags (array of strings)

**Note:** SKU cannot be changed through this endpoint

### Add Product Review
```json
{
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

**Field Requirements:**
- `rating` (Number, Required) - Rating score: 1, 2, 3, 4, or 5
- `comment` (String, Optional) - Review text

**Rating Values:**
- `1` - Poor
- `2` - Fair
- `3` - Good
- `4` - Very Good
- `5` - Excellent

---

## 🛒 Cart Management

### Add to Cart
```json
{
  "productId": "{{productId}}",
  "quantity": 1
}
```

**Field Requirements:**
- `productId` (String, Required) - MongoDB ObjectId of the product
- `quantity` (Number, Required) - Quantity to add (min: 1, max: available stock)

**Notes:**
- If product already exists in cart, quantity will be incremented
- Product must be active and in stock
- Quantity cannot exceed available stock

### Update Cart Item
```json
{
  "quantity": 3
}
```

**Field Requirements:**
- `quantity` (Number, Required) - New quantity (min: 1, max: available stock)

**Notes:**
- Quantity must be a positive integer
- Cannot exceed available product stock
- Set quantity to 0 or use DELETE endpoint to remove item

---

## 📋 Orders

### Order Status (ENUM)
Use these exact values for the `status` field:

| Value | Description | When to Use |
|-------|-------------|-------------|
| `pending` | Order received, awaiting processing | Initial order state |
| `processing` | Order is being prepared | Order confirmed, being packed |
| `shipped` | Order has been dispatched | Order sent to customer |
| `delivered` | Order successfully delivered | Customer received order |
| `cancelled` | Order cancelled by admin/user | Order cancelled before shipping |
| `refunded` | Payment refunded to customer | Payment returned |

### Payment Methods (ENUM)
Use these exact values for the `paymentMethod` field:

| Value | Description |
|-------|-------------|
| `stripe` | Stripe payment gateway (default) |
| `paypal` | PayPal payment |
| `cash_on_delivery` | Cash on delivery |

### Create Order
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "paymentMethod": "stripe"
}
```

**Field Requirements:**
- `shippingAddress` (Object, Required) - Complete shipping address details
  - `shippingAddress.street` (String, Required) - Street address line
  - `shippingAddress.city` (String, Required) - City name
  - `shippingAddress.state` (String, Required) - State or province
  - `shippingAddress.country` (String, Required) - Country name
  - `shippingAddress.zipCode` (String, Required) - Postal/ZIP code
- `paymentMethod` (String, Optional) - One of: `stripe`, `paypal`, `cash_on_delivery` (default: stripe)

**Notes:**
- Cart must contain at least one item
- All cart items must be in stock
- Order will be created with status 'pending'
- Cart will be cleared after successful order creation

### Cancel Order
```json
{
  "reason": "Changed my mind"
}
```

**Field Requirements:**
- `reason` (String, Optional) - Cancellation reason (max 500 chars)

**Notes:**
- Only orders with status `pending` or `processing` can be cancelled
- Orders that are `shipped` or `delivered` cannot be cancelled
- Stock will be returned to inventory automatically

### Update Order Status (Admin)
```json
{
  "status": "shipped",
  "note": "Order shipped via FedEx. Tracking: 123456"
}
```

**Field Requirements:**
- `status` (String, Required) - One of: `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`
- `note` (String, Optional) - Admin note/tracking info (max 500 chars)

**Status Transition Rules:**
- ❌ Cannot change from `delivered` to `pending`
- ❌ Cannot change from `refunded` to any other status
- ❌ `cancelled` orders cannot be updated

**Best Practices:**
- Include tracking information in the `note` field when marking as `shipped`
- Status changes trigger email notifications to customers
- Refunds must be processed separately through payment provider

---

## 🔍 Query Parameters

### Pagination
Available on: Get All Products, Get All Users, Get My Orders, Get All Orders

```
?page=1&limit=10
```

**Parameters:**
- `page` (Number, Optional) - Page number (default: 1)
- `limit` (Number, Optional) - Items per page (default: 10, max: 100)

### Product Filtering
Available on: Get All Products

```
?category=electronics&minPrice=0&maxPrice=1000&search=headphones&sort=-createdAt
```

**Parameters:**
- `category` (String, Optional) - Filter by category (see Product Categories enum)
- `minPrice` (Number, Optional) - Minimum price filter
- `maxPrice` (Number, Optional) - Maximum price filter
- `search` (String, Optional) - Search in name, description, tags
- `sort` (String, Optional) - Sort field (prefix with `-` for descending)

**Sort Examples:**
- `price` - Price ascending
- `-price` - Price descending
- `createdAt` - Oldest first
- `-createdAt` - Newest first
- `name` - Alphabetical A-Z

### Order Filtering
Available on: Get My Orders, Get All Orders (Admin)

```
?status=pending
```

**Parameters:**
- `status` (String, Optional) - Filter by order status (see Order Status enum)

### User Filtering
Available on: Get All Users (Admin)

```
?role=user
```

**Parameters:**
- `role` (String, Optional) - Filter by role: `user` or `admin`

---

## 📝 Common Patterns

### MongoDB ObjectId Format
Used for: `productId`, `orderId`, `userId`, `cartItemId`, `addressId`

Example: `"507f1f77bcf86cd799439011"`

### Array Fields
Used for: `tags` in products

```json
{
  "tags": ["new", "featured", "sale"]
}
```

### Boolean Fields
Used for: `isDefault`, `isFeatured`

Values: `true` or `false` (not strings)

```json
{
  "isDefault": true,
  "isFeatured": false
}
```

### Nested Objects
Used for: `shippingAddress` in orders

```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

---

## ⚠️ Important Notes

### Character Limits
- Product name: 100 characters
- Product description: 10-2000 characters
- Brand name: 50 characters
- Cancellation reason: 500 characters
- Admin note: 500 characters

### Numeric Constraints
- Price: minimum 0
- Stock: minimum 0
- Quantity: minimum 1
- Rating: 1-5 (integers only)
- Password: minimum 6 characters

### Unique Fields
- Email (user registration)
- SKU (product creation)

### Immutable Fields
- Email (cannot be changed via profile update)
- SKU (cannot be changed via product update)

---

## 🎯 Quick Tips

### For Frontend Developers
1. Always validate enum values on the client side
2. Check character limits before submission
3. Use the exact enum values (case-sensitive)
4. Handle nested objects correctly for addresses
5. Display allowed values in dropdowns/selects

### For Mobile Developers
1. Cache enum values locally
2. Implement proper form validation
3. Show clear error messages for validation failures
4. Use number inputs for numeric fields
5. Implement proper date/time handling

### For QA/Testing
1. Test all enum values (valid and invalid)
2. Test boundary conditions (min/max values)
3. Test character limits
4. Test required vs optional fields
5. Test status transitions for orders

---

## 📚 Related Documentation

- **DOCUMENTATION_ENHANCEMENTS.md** - Detailed explanation of all enhancements
- **ENHANCEMENT_SUMMARY.md** - Previous enhancement summary
- **QUICK_REFERENCE.md** - API endpoint quick reference
- **E-Commerce-API.postman_collection.json** - Full Postman collection

---

## 🔄 Last Updated
2026-01-16

All field descriptions and enum values are synchronized with the latest API implementation.
