# 📚 E-Commerce API - Complete Documentation

## 🌐 Base URL
```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

## 🔑 Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Products](#products)
4. [Cart](#cart)
5. [Orders](#orders)
6. [Status Codes](#status-codes)
7. [Error Responses](#error-responses)

---

# 🔐 Authentication

## Register User
**POST** `/auth/register`

**Access:** Public

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-01-15T21:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Password must be at least 6 characters
- Email must be unique
- Tokens are automatically generated
- User role defaults to "user"

---

## Login User
**POST** `/auth/login`

**Access:** Public

**Description:** Authenticate user and receive access tokens

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Access token expires in 7 days (configurable)
- Refresh token expires in 30 days (configurable)
- Rate limited to prevent brute force attacks

---

## Refresh Token
**POST** `/auth/refresh`

**Access:** Public

**Description:** Get a new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Use this when access token expires
- Refresh token must be valid
- Returns new access and refresh tokens

---

## Logout
**POST** `/auth/logout`

**Access:** Public

**Description:** Logout user (client-side token removal)

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

**Notes:**
- Client should delete stored tokens
- Server-side session invalidation (if using Redis)

---

## Forgot Password
**POST** `/auth/forgot-password`

**Access:** Public

**Description:** Request password reset email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password reset email sent"
}
```

**Notes:**
- Sends email with reset token
- Token expires in 1 hour
- Rate limited to prevent abuse

---

## Reset Password
**POST** `/auth/reset-password`

**Access:** Public

**Description:** Reset password using token from email

**Request Body:**
```json
{
  "token": "abc123def456ghi789",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

**Notes:**
- Token must be valid and not expired
- Password must meet security requirements
- User should login again after reset

---

# 👤 Users

## Get User Profile
**GET** `/users/profile`

**Access:** Private (Authenticated users)

**Description:** Get current user's profile information

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "avatar": "/uploads/1705353600000-avatar.jpg",
      "role": "user",
      "addresses": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "zipCode": "10001",
          "isDefault": true
        }
      ],
      "createdAt": "2026-01-15T21:30:00.000Z"
    }
  }
}
```

**Notes:**
- Requires valid access token
- Returns complete user profile with addresses

---

## Update User Profile
**PUT** `/users/profile`

**Access:** Private (Authenticated users)

**Description:** Update user profile information

**Request Body (JSON or multipart/form-data for avatar):**
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

**With Avatar Upload (multipart/form-data):**
```
name: John Smith
phone: +1234567890
avatar: [file]
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "avatar": "/uploads/1705353700000-new-avatar.jpg",
      "role": "user"
    }
  }
}
```

**Notes:**
- Avatar is uploaded to local storage
- Supported formats: JPEG, PNG, WebP
- Max file size: 5MB
- Email cannot be changed via this endpoint

---

## Change Password
**PUT** `/users/password`

**Access:** Private (Authenticated users)

**Description:** Change user password

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

**Notes:**
- Current password must be correct
- New password must meet security requirements
- User should login again after password change

---

## Add Address
**POST** `/users/addresses`

**Access:** Private (Authenticated users)

**Description:** Add a new shipping address

**Request Body:**
```json
{
  "street": "456 Oak Avenue",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA",
  "zipCode": "90001",
  "phone": "+1234567890",
  "isDefault": false
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Address added successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "addresses": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
          "street": "456 Oak Avenue",
          "city": "Los Angeles",
          "state": "CA",
          "country": "USA",
          "zipCode": "90001",
          "phone": "+1234567890",
          "isDefault": false
        }
      ]
    }
  }
}
```

**Notes:**
- Multiple addresses can be stored
- Only one address can be default
- All fields are required

---

## Update Address
**PUT** `/users/addresses/:addressId`

**Access:** Private (Authenticated users)

**Description:** Update an existing address

**Request Body:**
```json
{
  "street": "456 Oak Avenue Apt 5B",
  "isDefault": true
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Address updated successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "addresses": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
          "street": "456 Oak Avenue Apt 5B",
          "city": "Los Angeles",
          "state": "CA",
          "country": "USA",
          "zipCode": "90001",
          "isDefault": true
        }
      ]
    }
  }
}
```

**Notes:**
- Only update fields you want to change
- Setting isDefault to true will unset other defaults

---

## Delete Address
**DELETE** `/users/addresses/:addressId`

**Access:** Private (Authenticated users)

**Description:** Delete a shipping address

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Address deleted successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "addresses": []
    }
  }
}
```

**Notes:**
- Address is permanently removed
- Cannot delete if it's the only address and has active orders

---

## Get All Users (Admin)
**GET** `/users?page=1&limit=10&role=user`

**Access:** Private (Admin only)

**Description:** Get all users with pagination and filters

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (user/admin)
- `isActive` (optional): Filter by active status

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-01-15T21:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

**Notes:**
- Admin access required
- Supports pagination and filtering
- Passwords are never returned

---

## Deactivate User (Admin)
**PUT** `/users/:id/deactivate`

**Access:** Private (Admin only)

**Description:** Deactivate a user account

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "isActive": false
    }
  }
}
```

**Notes:**
- Admin access required
- User cannot login when deactivated
- Can be reactivated by admin

---

# 🛍️ Products

## Get All Products
**GET** `/products?page=1&limit=10&category=electronics&minPrice=0&maxPrice=1000&search=laptop&sort=-createdAt`

**Access:** Public

**Description:** Get all products with filtering, search, and pagination

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search in name and description
- `sort` (optional): Sort field (prefix with - for descending)
- `inStock` (optional): Filter by stock availability (true/false)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
        "name": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 199.99,
        "category": "electronics",
        "stock": 50,
        "images": [
          {
            "url": "/uploads/1705353800000-headphones.jpg",
            "alt": "Wireless Headphones",
            "isPrimary": true
          }
        ],
        "rating": 4.5,
        "numReviews": 120,
        "isFeatured": true,
        "createdAt": "2026-01-15T20:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 10,
      "limit": 10
    }
  }
}
```

**Notes:**
- Public endpoint, no authentication required
- Supports advanced filtering and search
- Results are paginated
- Images are served from local storage

---

## Get Product by ID
**GET** `/products/:id`

**Access:** Public

**Description:** Get detailed information about a specific product

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation. Features include 30-hour battery life, Bluetooth 5.0, and premium sound quality.",
      "price": 199.99,
      "category": "electronics",
      "stock": 50,
      "images": [
        {
          "url": "/uploads/1705353800000-headphones.jpg",
          "alt": "Wireless Headphones",
          "isPrimary": true
        },
        {
          "url": "/uploads/1705353801000-headphones-side.jpg",
          "alt": "Wireless Headphones Side View",
          "isPrimary": false
        }
      ],
      "specifications": {
        "brand": "AudioTech",
        "color": "Black",
        "weight": "250g"
      },
      "rating": 4.5,
      "numReviews": 120,
      "reviews": [
        {
          "user": {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
            "name": "John Doe"
          },
          "rating": 5,
          "comment": "Excellent sound quality!",
          "createdAt": "2026-01-14T10:00:00.000Z"
        }
      ],
      "isFeatured": true,
      "createdAt": "2026-01-15T20:00:00.000Z"
    }
  }
}
```

**Notes:**
- Returns complete product details including reviews
- Images URLs are relative to server
- Stock availability is shown

---

## Get Featured Products
**GET** `/products/featured?limit=6`

**Access:** Public

**Description:** Get featured products for homepage

**Query Parameters:**
- `limit` (optional): Number of products to return (default: 10)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Featured products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
        "name": "Wireless Headphones",
        "price": 199.99,
        "images": [
          {
            "url": "/uploads/1705353800000-headphones.jpg",
            "isPrimary": true
          }
        ],
        "rating": 4.5
      }
    ]
  }
}
```

**Notes:**
- Returns only featured products
- Useful for homepage displays
- Limited fields for performance

---

## Create Product (Admin)
**POST** `/products`

**Access:** Private (Admin only)

**Description:** Create a new product

**Request Body (multipart/form-data):**
```
name: Wireless Headphones
description: High-quality wireless headphones
price: 199.99
category: electronics
stock: 50
images: [file1, file2, file3]
specifications: {"brand": "AudioTech", "color": "Black"}
isFeatured: true
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones",
      "price": 199.99,
      "category": "electronics",
      "stock": 50,
      "images": [
        {
          "url": "/uploads/1705353800000-headphones.jpg",
          "alt": "Wireless Headphones",
          "isPrimary": true
        }
      ],
      "specifications": {
        "brand": "AudioTech",
        "color": "Black"
      },
      "isFeatured": true,
      "createdAt": "2026-01-15T20:00:00.000Z"
    }
  }
}
```

**Notes:**
- Admin access required
- Supports multiple image uploads (max 5)
- Images are stored locally
- First image is automatically set as primary

---

## Update Product (Admin)
**PUT** `/products/:id`

**Access:** Private (Admin only)

**Description:** Update an existing product

**Request Body (multipart/form-data):**
```
name: Wireless Headphones Pro
price: 249.99
stock: 75
images: [new_file1, new_file2]
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "product": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "name": "Wireless Headphones Pro",
      "price": 249.99,
      "stock": 75,
      "images": [
        {
          "url": "/uploads/1705353900000-headphones-pro.jpg",
          "alt": "Wireless Headphones Pro",
          "isPrimary": true
        }
      ]
    }
  }
}
```

**Notes:**
- Admin access required
- Only update fields you want to change
- New images replace old ones if provided

---

## Delete Product (Admin)
**DELETE** `/products/:id`

**Access:** Private (Admin only)

**Description:** Delete a product

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

**Notes:**
- Admin access required
- Product is permanently removed
- Associated images are deleted from storage

---

## Add Product Review
**POST** `/products/:id/reviews`

**Access:** Private (Authenticated users)

**Description:** Add a review to a product

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Review added successfully",
  "data": {
    "product": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "name": "Wireless Headphones",
      "rating": 4.6,
      "numReviews": 121,
      "reviews": [
        {
          "user": {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
            "name": "John Doe"
          },
          "rating": 5,
          "comment": "Excellent product! Highly recommended.",
          "createdAt": "2026-01-15T21:30:00.000Z"
        }
      ]
    }
  }
}
```

**Notes:**
- User must be authenticated
- Rating must be between 1 and 5
- User can only review once per product
- Product rating is automatically recalculated

---

# 🛒 Cart

## Get User Cart
**GET** `/cart`

**Access:** Private (Authenticated users)

**Description:** Get current user's shopping cart

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Cart retrieved successfully",
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "user": "65a1b2c3d4e5f6g7h8i9j0k1",
      "items": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
          "product": {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
            "name": "Wireless Headphones",
            "price": 199.99,
            "images": [
              {
                "url": "/uploads/1705353800000-headphones.jpg",
                "isPrimary": true
              }
            ],
            "stock": 50
          },
          "quantity": 2,
          "price": 199.99
        }
      ],
      "totalItems": 2,
      "totalPrice": 399.98
    }
  }
}
```

**Notes:**
- Returns cart with populated product details
- Prices are current prices from products
- Total is automatically calculated

---

## Add Item to Cart
**POST** `/cart`

**Access:** Private (Authenticated users)

**Description:** Add a product to cart or update quantity if exists

**Request Body:**
```json
{
  "productId": "65a1b2c3d4e5f6g7h8i9j0k4",
  "quantity": 2
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Item added to cart successfully",
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "items": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
          "product": "65a1b2c3d4e5f6g7h8i9j0k4",
          "quantity": 2,
          "price": 199.99
        }
      ],
      "totalItems": 2,
      "totalPrice": 399.98
    }
  }
}
```

**Notes:**
- Creates cart if user doesn't have one
- If product exists, quantity is updated
- Stock availability is checked
- Price is locked at time of adding

---

## Update Cart Item
**PUT** `/cart/:itemId`

**Access:** Private (Authenticated users)

**Description:** Update quantity of a cart item

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Cart item updated successfully",
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "items": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
          "product": "65a1b2c3d4e5f6g7h8i9j0k4",
          "quantity": 3,
          "price": 199.99
        }
      ],
      "totalItems": 3,
      "totalPrice": 599.97
    }
  }
}
```

**Notes:**
- Quantity must be greater than 0
- Stock availability is checked
- Total is recalculated

---

## Remove Item from Cart
**DELETE** `/cart/:itemId`

**Access:** Private (Authenticated users)

**Description:** Remove a specific item from cart

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Item removed from cart successfully",
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "items": [],
      "totalItems": 0,
      "totalPrice": 0
    }
  }
}
```

**Notes:**
- Item is permanently removed
- Total is recalculated
- Cart remains even if empty

---

## Clear Cart
**DELETE** `/cart`

**Access:** Private (Authenticated users)

**Description:** Remove all items from cart

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "items": [],
      "totalItems": 0,
      "totalPrice": 0
    }
  }
}
```

**Notes:**
- All items are removed
- Cart structure remains
- Useful for "start over" functionality

---

# 📦 Orders

## Create Order
**POST** `/orders`

**Access:** Private (Authenticated users)

**Description:** Create an order from current cart

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001",
    "phone": "+1234567890"
  },
  "paymentMethod": "card"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "orderNumber": "ORD-1705353600000-1",
      "user": "65a1b2c3d4e5f6g7h8i9j0k1",
      "items": [
        {
          "product": "65a1b2c3d4e5f6g7h8i9j0k4",
          "name": "Wireless Headphones",
          "quantity": 2,
          "price": 199.99,
          "image": "/uploads/1705353800000-headphones.jpg"
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "zipCode": "10001",
        "phone": "+1234567890"
      },
      "subtotal": 399.98,
      "tax": 39.99,
      "shippingCost": 0,
      "discount": 0,
      "total": 439.97,
      "status": "pending",
      "statusHistory": [
        {
          "status": "pending",
          "updatedAt": "2026-01-15T21:30:00.000Z"
        }
      ],
      "createdAt": "2026-01-15T21:30:00.000Z"
    }
  }
}
```

**Notes:**
- Cart must not be empty
- Stock is verified before order creation
- Product stock is decremented
- Cart is cleared after order
- Tax is calculated at 10%
- Free shipping over $100
- Order confirmation email is sent
- Order number is auto-generated

---

## Get User Orders
**GET** `/orders?page=1&limit=10&status=pending`

**Access:** Private (Authenticated users)

**Description:** Get all orders for current user

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending/processing/shipped/delivered/cancelled/refunded)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
        "orderNumber": "ORD-1705353600000-1",
        "items": [
          {
            "product": {
              "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
              "name": "Wireless Headphones"
            },
            "quantity": 2,
            "price": 199.99
          }
        ],
        "total": 439.97,
        "status": "pending",
        "createdAt": "2026-01-15T21:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pages": 1,
      "limit": 10
    }
  }
}
```

**Notes:**
- Returns only user's own orders
- Supports pagination and status filtering
- Orders are sorted by creation date (newest first)

---

## Get Order by ID
**GET** `/orders/:id`

**Access:** Private (Authenticated users)

**Description:** Get detailed information about a specific order

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Order retrieved successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "orderNumber": "ORD-1705353600000-1",
      "user": "65a1b2c3d4e5f6g7h8i9j0k1",
      "items": [
        {
          "product": {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
            "name": "Wireless Headphones",
            "images": [
              {
                "url": "/uploads/1705353800000-headphones.jpg"
              }
            ]
          },
          "name": "Wireless Headphones",
          "quantity": 2,
          "price": 199.99,
          "image": "/uploads/1705353800000-headphones.jpg"
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "zipCode": "10001",
        "phone": "+1234567890"
      },
      "paymentInfo": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
        "method": "card",
        "status": "completed"
      },
      "subtotal": 399.98,
      "tax": 39.99,
      "shippingCost": 0,
      "discount": 0,
      "total": 439.97,
      "status": "shipped",
      "statusHistory": [
        {
          "status": "pending",
          "updatedAt": "2026-01-15T21:30:00.000Z"
        },
        {
          "status": "processing",
          "note": "Order is being prepared",
          "updatedAt": "2026-01-15T22:00:00.000Z"
        },
        {
          "status": "shipped",
          "note": "Order has been shipped via FedEx",
          "updatedAt": "2026-01-15T23:00:00.000Z"
        }
      ],
      "trackingNumber": "FDX123456789",
      "shippingCarrier": "FedEx",
      "createdAt": "2026-01-15T21:30:00.000Z"
    }
  }
}
```

**Notes:**
- User can only view their own orders
- Includes complete order details
- Status history shows all status changes
- Payment information is included if available

---

## Cancel Order
**PUT** `/orders/:id/cancel`

**Access:** Private (Authenticated users)

**Description:** Cancel an order

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "orderNumber": "ORD-1705353600000-1",
      "status": "cancelled",
      "cancelledAt": "2026-01-15T23:30:00.000Z",
      "cancelReason": "Changed my mind",
      "statusHistory": [
        {
          "status": "pending",
          "updatedAt": "2026-01-15T21:30:00.000Z"
        },
        {
          "status": "cancelled",
          "updatedAt": "2026-01-15T23:30:00.000Z"
        }
      ]
    }
  }
}
```

**Notes:**
- User can only cancel their own orders
- Cannot cancel if status is: delivered, cancelled, or refunded
- Product stock is restored upon cancellation
- Cancellation reason is optional but recommended

---

## Update Order Status (Admin)
**PUT** `/orders/:id/status`

**Access:** Private (Admin only)

**Description:** Update order status (admin operation)

**Request Body:**
```json
{
  "status": "shipped",
  "note": "Order has been shipped via FedEx. Tracking number: FDX123456789"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "orderNumber": "ORD-1705353600000-1",
      "status": "shipped",
      "statusHistory": [
        {
          "status": "pending",
          "updatedAt": "2026-01-15T21:30:00.000Z"
        },
        {
          "status": "processing",
          "note": "Order is being prepared",
          "updatedAt": "2026-01-15T22:00:00.000Z"
        },
        {
          "status": "shipped",
          "note": "Order has been shipped via FedEx. Tracking number: FDX123456789",
          "updatedAt": "2026-01-15T23:00:00.000Z"
        }
      ],
      "trackingNumber": "FDX123456789",
      "shippingCarrier": "FedEx"
    }
  }
}
```

**Valid Status Values:**
- `pending` - Order received, awaiting processing
- `processing` - Order is being prepared for shipment
- `shipped` - Order has been shipped to customer
- `delivered` - Order has been delivered to customer
- `cancelled` - Order has been cancelled
- `refunded` - Order has been refunded

**Status Notes Examples:**

**For "pending" status:**
```json
{
  "status": "pending",
  "note": "Order received and awaiting payment confirmation"
}
```

**For "processing" status:**
```json
{
  "status": "processing",
  "note": "Order is being prepared. Items are being picked and packed."
}
```

**For "shipped" status:**
```json
{
  "status": "shipped",
  "note": "Order has been shipped via FedEx. Tracking number: FDX123456789. Estimated delivery: 3-5 business days."
}
```

**For "delivered" status:**
```json
{
  "status": "delivered",
  "note": "Order has been successfully delivered. Signed by: John Doe"
}
```

**For "cancelled" status:**
```json
{
  "status": "cancelled",
  "note": "Order cancelled at customer request. Refund will be processed within 5-7 business days."
}
```

**For "refunded" status:**
```json
{
  "status": "refunded",
  "note": "Full refund of $439.97 has been processed to original payment method. Please allow 5-7 business days for funds to appear."
}
```

**Notes:**
- Admin access required
- Note is optional but highly recommended for customer communication
- Status history is automatically updated
- Email notification is sent to customer when status changes to "shipped"
- Delivered status automatically sets deliveredAt timestamp
- Each status change is logged with timestamp

---

## Get All Orders (Admin)
**GET** `/orders/admin/all?page=1&limit=10&status=pending`

**Access:** Private (Admin only)

**Description:** Get all orders from all users

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
        "orderNumber": "ORD-1705353600000-1",
        "user": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "items": [
          {
            "product": {
              "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
              "name": "Wireless Headphones"
            },
            "quantity": 2,
            "price": 199.99
          }
        ],
        "total": 439.97,
        "status": "pending",
        "createdAt": "2026-01-15T21:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 15,
      "limit": 10
    }
  }
}
```

**Notes:**
- Admin access required
- Returns orders from all users
- Includes user information
- Supports pagination and filtering

---

# 📊 Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE requests |
| 201 | Created | Successful POST requests that create resources |
| 400 | Bad Request | Invalid request data or validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User doesn't have permission for this action |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

# ❌ Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "stack": "Error stack trace (development only)"
}
```

**Common Error Examples:**

**Validation Error (400):**
```json
{
  "status": "error",
  "message": "\"email\" must be a valid email"
}
```

**Authentication Error (401):**
```json
{
  "status": "error",
  "message": "Not authorized, token missing or invalid"
}
```

**Authorization Error (403):**
```json
{
  "status": "error",
  "message": "Not authorized to access this resource"
}
```

**Not Found Error (404):**
```json
{
  "status": "error",
  "message": "Product not found"
}
```

**Duplicate Error (409):**
```json
{
  "status": "error",
  "message": "Email already exists"
}
```

**Rate Limit Error (429):**
```json
{
  "status": "error",
  "message": "Too many requests, please try again later"
}
```

---

# 🔧 Additional Notes

## File Uploads
- **Supported formats:** JPEG, PNG, WebP
- **Max file size:** 5MB
- **Storage:** Local file system in `/uploads` directory
- **Access:** Files are publicly accessible via `/uploads/filename`

## Pagination
- Default page: 1
- Default limit: 10
- Maximum limit: 100

## Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour
- General API: 100 requests per 15 minutes

## Caching
- Redis is used for session management
- Product listings can be cached
- Cart data is real-time

## Email Notifications
- Order confirmation on order creation
- Shipping notification when order is shipped
- Password reset emails
- Configure SMTP settings in `.env`

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Helmet for security headers
- CORS protection
- Rate limiting
- Input validation with Joi
- XSS protection

---

# 🚀 Quick Start Testing

1. **Register a user:**
   ```bash
   POST /auth/register
   ```

2. **Login to get token:**
   ```bash
   POST /auth/login
   ```

3. **Browse products:**
   ```bash
   GET /products
   ```

4. **Add to cart:**
   ```bash
   POST /cart
   ```

5. **Create order:**
   ```bash
   POST /orders
   ```

6. **Track order:**
   ```bash
   GET /orders/:id
   ```

---

**Last Updated:** January 15, 2026
**API Version:** v1
**Base URL:** http://localhost:5000/api/v1
