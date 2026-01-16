# Quick Start Guide

## ✅ Installation Complete!

All dependencies have been installed successfully.

## 🚀 Next Steps

### 1. Configure Environment Variables

Edit the `.env.example` file and save it as `.env` with your actual credentials:

```bash
# Minimum required configuration for local development:

NODE_ENV=development
PORT=5000

# MongoDB (required)
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Secrets (required - change these!)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this

# Email (optional for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@ecommerce.com

# Redis (optional - comment out if not using)
# REDIS_HOST=localhost
# REDIS_PORT=6379

# AWS S3 (optional - comment out if not using)
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=your_bucket

# Stripe (optional - comment out if not using)
# STRIPE_SECRET_KEY=sk_test_...
```

### 2. Start MongoDB

Make sure MongoDB is running:

```bash
# Windows (if installed as service)
net start MongoDB

# Or use MongoDB Compass to start it
```

### 3. Seed the Database (Optional)

```bash
npm run seed
```

This will create:
- **Admin user**: `admin@ecommerce.com` / `admin123`
- **Sample users**: 2 test users
- **Sample products**: 5 products

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

### 5. Test the API

Open your browser or Postman and test:

**Health Check:**
```
GET http://localhost:5000/health
```

**Register a User:**
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Products:**
```
GET http://localhost:5000/api/v1/products
```

## 📋 Common Commands

```bash
# Development
npm run dev              # Start with nodemon

# Production
npm start                # Start server

# Database
npm run migrate          # Run migrations
npm run seed             # Seed database

# Testing
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests
```

## 🔧 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/ecommerce`

### Redis Connection Error (Optional)
- Redis is optional for basic functionality
- Comment out Redis config in `.env` if not using
- Or install and start Redis

### Port Already in Use
- Change `PORT` in `.env` to another port (e.g., 5001)

### Email Not Sending
- Email is optional for testing
- Check your email credentials
- For Gmail, use an "App Password" not your regular password

## 📚 API Documentation

See `PROJECT_SETUP.md` for complete API documentation.

## 🎯 What's Working

✅ User registration and authentication
✅ Product management (CRUD)
✅ Shopping cart
✅ Order creation and management
✅ JWT authentication
✅ Input validation
✅ Error handling
✅ Logging
✅ File uploads (if AWS configured)
✅ Email notifications (if email configured)
✅ Payment processing (if Stripe configured)

## 🎉 You're Ready!

Your e-commerce backend is now set up and ready to use!

For detailed documentation, see:
- `README.md` - Project overview
- `PROJECT_SETUP.md` - Complete setup guide
- API endpoints documentation in the routes files

Happy coding! 🚀
