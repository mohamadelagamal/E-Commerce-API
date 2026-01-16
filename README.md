# E-Commerce Backend API

A robust and scalable e-commerce backend built with Express.js, MongoDB, and Redis.

## Features

- 🔐 JWT Authentication & Authorization
- 👤 User Management
- 🛍️ Product Management
- 🛒 Shopping Cart
- 📦 Order Processing
- 💳 Payment Integration (Stripe)
- 📧 Email Notifications
- 📤 File Upload (AWS S3)
- 🚀 Redis Caching
- 🔒 Rate Limiting
- 📝 Request Validation
- 🧪 Comprehensive Testing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Authentication**: JWT
- **Payment**: Stripe
- **Storage**: AWS S3
- **Email**: Nodemailer
- **Validation**: Joi
- **Testing**: Jest & Supertest
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- AWS Account (for S3)
- Stripe Account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations
```bash
npm run migrate
```

5. Seed the database (optional)
```bash
npm run seed
```

6. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/password` - Change password

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add item to cart
- `PUT /api/v1/cart/:itemId` - Update cart item
- `DELETE /api/v1/cart/:itemId` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart

### Orders
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id/cancel` - Cancel order

## Project Structure

```
ecommerce-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── database/        # Database models, migrations, seeders
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── jobs/            # Background jobs
│   └── app.js           # Express app setup
├── tests/               # Test files
├── .env                 # Environment variables
├── package.json
└── server.js            # Entry point
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## License

ISC
