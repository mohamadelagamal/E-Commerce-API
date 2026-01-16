# 🛒 E-Commerce Backend API

A professional, production-ready E-Commerce backend API built with **Node.js**, **Express.js**, and **MongoDB Atlas**. Features automated deployment to Hostinger via GitHub Actions.

[![Deploy to Hostinger](https://github.com/mohamadelagamal/E-Commerce-API/actions/workflows/deploy-to-hostinger.yml/badge.svg)](https://github.com/mohamadelagamal/E-Commerce-API/actions/workflows/deploy-to-hostinger.yml)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Hostinger hosting account (for deployment)
- Git installed

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/mohamadelagamal/E-Commerce-API.git
cd E-Commerce-API

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials

# 4. Run the development server
npm run dev

# Server will start on http://localhost:5000
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[START_HERE.md](START_HERE.md)** | 👈 **Start here!** Quick start guide |
| **[SUCCESS_NEXT_STEPS.md](SUCCESS_NEXT_STEPS.md)** | Next steps after GitHub setup |
| **[HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)** | Complete deployment guide |
| **[GITHUB_SECRETS.md](GITHUB_SECRETS.md)** | GitHub secrets configuration |
| **[MONGODB_SETUP.md](MONGODB_SETUP.md)** | MongoDB Atlas setup instructions |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Complete API reference |
| **[ARABIC_GUIDE.md](ARABIC_GUIDE.md)** | الدليل بالعربية |

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - JWT-based auth with refresh tokens
- ✅ **Product Management** - CRUD operations for products
- ✅ **Category Management** - Organize products by categories
- ✅ **Shopping Cart** - Add, update, remove items
- ✅ **Order Management** - Create and track orders
- ✅ **Payment Integration** - Stripe payment gateway
- ✅ **File Upload** - Image upload with Multer
- ✅ **Email Notifications** - Nodemailer integration

### Security Features
- 🔒 **Helmet** - Security headers
- 🔒 **Rate Limiting** - Prevent abuse
- 🔒 **CORS** - Cross-origin resource sharing
- 🔒 **Input Validation** - Joi validation
- 🔒 **Password Hashing** - bcrypt encryption

### Performance Features
- ⚡ **Compression** - Response compression
- ⚡ **Redis Caching** - Fast data retrieval
- ⚡ **Bull Queue** - Background job processing
- ⚡ **MongoDB Indexing** - Optimized queries

### DevOps Features
- 🚀 **GitHub Actions** - Automated CI/CD
- 🚀 **Automated Deployment** - Deploy to Hostinger on push
- 📊 **Logging** - Winston logger
- 🧪 **Testing** - Jest test suite

---

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **File Upload**: Multer

### DevOps
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: Hostinger
- **Database**: MongoDB Atlas (Cloud)

### Additional Services
- **Payment**: Stripe
- **Email**: Nodemailer
- **Caching**: Redis
- **Queue**: Bull

---

## 📁 Project Structure

```
ecommerce-backend/
├── .github/
│   └── workflows/
│       └── deploy-to-hostinger.yml    # GitHub Actions workflow
├── src/
│   ├── config/
│   │   ├── database.js                # MongoDB connection
│   │   └── redis.js                   # Redis configuration
│   ├── controllers/                   # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── ...
│   ├── models/                        # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── ...
│   ├── routes/                        # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── ...
│   ├── middleware/                    # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/                         # Utility functions
│   │   ├── logger.js
│   │   └── email.js
│   └── validators/                    # Joi schemas
├── tests/                             # Test files
├── uploads/                           # Uploaded files
├── .env                               # Environment variables (not in Git)
├── .env.example                       # Example environment file
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies
├── server.js                          # Entry point
└── README.md                          # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login user
POST   /api/v1/auth/refresh-token     # Refresh access token
POST   /api/v1/auth/logout            # Logout user
```

### Products
```
GET    /api/v1/products               # Get all products
GET    /api/v1/products/:id           # Get product by ID
POST   /api/v1/products               # Create product (Admin)
PUT    /api/v1/products/:id           # Update product (Admin)
DELETE /api/v1/products/:id           # Delete product (Admin)
```

### Categories
```
GET    /api/v1/categories             # Get all categories
GET    /api/v1/categories/:id         # Get category by ID
POST   /api/v1/categories             # Create category (Admin)
PUT    /api/v1/categories/:id         # Update category (Admin)
DELETE /api/v1/categories/:id         # Delete category (Admin)
```

### Cart
```
GET    /api/v1/cart                   # Get user's cart
POST   /api/v1/cart/items             # Add item to cart
PUT    /api/v1/cart/items/:id         # Update cart item
DELETE /api/v1/cart/items/:id         # Remove item from cart
DELETE /api/v1/cart                   # Clear cart
```

### Orders
```
GET    /api/v1/orders                 # Get user's orders
GET    /api/v1/orders/:id             # Get order by ID
POST   /api/v1/orders                 # Create order
PUT    /api/v1/orders/:id/status      # Update order status (Admin)
```

📖 **Full API Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🚀 Deployment

### Automatic Deployment to Hostinger

This project uses GitHub Actions for automated deployment. Every push to the `main` branch triggers deployment.

**To deploy**:

```bash
# 1. Make your changes
git add .

# 2. Commit with trigger phrase
git commit -m "upload to hostinger - description of changes"

# 3. Push to GitHub (triggers automatic deployment)
git push origin main
```

**Monitor deployment**: 
- Go to [Actions tab](https://github.com/mohamadelagamal/E-Commerce-API/actions)
- Watch the deployment progress

📖 **Deployment Guide**: See [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

📖 **See `.env.example` for complete list**

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm test -- --coverage
```

---

## 📊 Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run migrate        # Run database migrations
npm run seed           # Seed database with sample data
```

---

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (Cluster0)
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update `.env` file

📖 **Detailed guide**: [MONGODB_SETUP.md](MONGODB_SETUP.md)

### GitHub Secrets (for deployment)
1. Go to repository Settings → Secrets → Actions
2. Add required secrets (FTP, SSH, MongoDB, etc.)
3. See [GITHUB_SECRETS.md](GITHUB_SECRETS.md) for complete list

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Mohamed Elagamal**
- GitHub: [@mohamadelagamal](https://github.com/mohamadelagamal)
- Repository: [E-Commerce-API](https://github.com/mohamadelagamal/E-Commerce-API)

---

## 🆘 Support

Need help? Check these resources:

- 📖 [Documentation](START_HERE.md)
- 🐛 [Report Issues](https://github.com/mohamadelagamal/E-Commerce-API/issues)
- 💬 [Discussions](https://github.com/mohamadelagamal/E-Commerce-API/discussions)

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for MongoDB Atlas
- GitHub for GitHub Actions
- Hostinger for reliable hosting

---

## 📈 Project Status

- ✅ Backend API - Complete
- ✅ MongoDB Integration - Complete
- ✅ GitHub Actions - Complete
- ✅ Documentation - Complete
- 🚧 Frontend - In Progress
- 🚧 Mobile App - Planned

---

## 🔗 Links

- **Repository**: https://github.com/mohamadelagamal/E-Commerce-API
- **Issues**: https://github.com/mohamadelagamal/E-Commerce-API/issues
- **Actions**: https://github.com/mohamadelagamal/E-Commerce-API/actions

---

**Made with ❤️ using Node.js, Express, and MongoDB**

---

**Last Updated**: January 16, 2026
