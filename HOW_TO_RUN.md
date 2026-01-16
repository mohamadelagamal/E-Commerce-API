# How to Run This E-Commerce Backend Project

## 🚀 Quick Start (Minimum Setup)

### Step 1: Configure Environment Variables

Create a `.env` file in the project root with minimum configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Secrets (REQUIRED - change these!)
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_REFRESH_SECRET=my_super_secret_refresh_key_67890

# Optional (can skip for now)
# REDIS_HOST=localhost
# REDIS_PORT=6379
```

### Step 2: Make Sure MongoDB is Running

**Option A: If MongoDB is installed as a service (Windows)**
```bash
net start MongoDB
```

**Option B: If using MongoDB Compass**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`

**Option C: If MongoDB is not installed**
- Download from: https://www.mongodb.com/try/download/community
- Install and start the service

### Step 3: Seed the Database (Optional but Recommended)

```bash
npm run seed
```

This creates:
- Admin user: `admin@ecommerce.com` / `admin123`
- 2 sample users
- 5 sample products

### Step 4: Start the Server

```bash
npm run dev
```

### Step 5: Test the API

Open your browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-01-13T12:03:34.000Z"
}
```

✅ **Your API is running!**

---

## 📋 Detailed Setup Guide

### Prerequisites Check

Before running, make sure you have:

- ✅ **Node.js** (v16+) - Check: `node --version`
- ✅ **npm** - Check: `npm --version`
- ✅ **MongoDB** - Running on port 27017

### Full Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT (REQUIRED)
JWT_SECRET=change_this_to_a_random_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=change_this_to_another_random_secret
JWT_REFRESH_EXPIRE=30d

# Redis (Optional - comment out if not using)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=

# AWS S3 (Optional - comment out if not using)
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=your_bucket

# Stripe (Optional - comment out if not using)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (Optional - comment out if not using)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASSWORD=your_app_password
# EMAIL_FROM=noreply@ecommerce.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

---

## 🎯 Running the Project

### Development Mode (Recommended)

```bash
npm run dev
```

**Features:**
- Auto-restart on file changes (nodemon)
- Detailed error messages
- Console logging

### Production Mode

```bash
npm start
```

**Features:**
- Optimized for production
- Less verbose logging

---

## 🗄️ Database Commands

### Seed Database with Sample Data

```bash
npm run seed
```

**Creates:**
- 1 Admin user
- 2 Regular users  
- 5 Sample products

**Admin Credentials:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

### Run Migrations

```bash
npm run migrate
```

---

## 🧪 Testing the API

### Option 1: Browser

Visit: `http://localhost:5000/health`

### Option 2: Postman

1. Import collection from `postman/E-Commerce-API.postman_collection.json`
2. Import environment from `postman/E-Commerce-API.postman_environment.json`
3. Select environment
4. Test endpoints!

### Option 3: cURL

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"

# Get products
curl http://localhost:5000/api/v1/products
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"

**Solution:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   ```
2. Verify connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

### Error: "Port 5000 already in use"

**Solution:**
Change port in `.env`:
```env
PORT=5001
```

### Error: "JWT_SECRET is not defined"

**Solution:**
Make sure `.env` file exists and contains:
```env
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

### Error: "Redis connection failed"

**Solution:**
Redis is optional. Comment out Redis config in `.env`:
```env
# REDIS_HOST=localhost
# REDIS_PORT=6379
```

### Error: "Email sending failed"

**Solution:**
Email is optional. Comment out email config or use valid credentials.

---

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm start                # Start server

# Database
npm run seed             # Seed sample data
npm run migrate          # Run migrations

# Testing
npm test                 # Run all tests
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests
npm run test:watch       # Watch mode
```

---

## 🎯 What Happens When You Run

### `npm run dev` starts:

1. ✅ Loads environment variables from `.env`
2. ✅ Connects to MongoDB
3. ✅ Connects to Redis (if configured)
4. ✅ Starts Express server on port 5000
5. ✅ Logs: "Server running on http://localhost:5000"

### Server Console Output:

```
✅ MongoDB Connected: localhost
✅ Redis Connected (if configured)
🚀 Server running on http://localhost:5000
```

---

## 🔍 Verify Everything is Working

### 1. Health Check
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"success"}`

### 2. Get Products
```bash
curl http://localhost:5000/api/v1/products
```
Expected: List of products (if seeded)

### 3. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```
Expected: User created with token

---

## 📁 Project Structure

```
ecommerce-backend/
├── src/                 # Source code
├── tests/              # Test files
├── postman/            # Postman collection
├── .env                # Your environment variables (create this!)
├── .env.example        # Template
├── package.json        # Dependencies
└── server.js           # Entry point
```

---

## 🎉 You're Ready!

**Quick Start Checklist:**
- ✅ MongoDB is running
- ✅ Created `.env` file
- ✅ Ran `npm run seed` (optional)
- ✅ Ran `npm run dev`
- ✅ Tested `http://localhost:5000/health`

**Next Steps:**
1. Import Postman collection
2. Test the API endpoints
3. Start building your frontend!

---

## 📞 Need Help?

Check these files:
- `QUICK_START.md` - Quick setup guide
- `PROJECT_SETUP.md` - Complete documentation
- `postman/README.md` - API testing guide

**Common Issues:**
- MongoDB not running → Start MongoDB service
- Port in use → Change PORT in `.env`
- Missing .env → Copy from `.env.example`

---

**Happy Coding! 🚀**
