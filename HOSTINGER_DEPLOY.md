# 🚀 Hostinger Deployment Guide
## Domain: shopapi.kammelhatwsl.com

---

## ✅ Current Configuration

### Production Domain
- **API URL**: https://shopapi.kammelhatwsl.com
- **API Base**: https://shopapi.kammelhatwsl.com/api/v1
- **Framework**: Express.js
- **Node Version**: 22.x
- **Branch**: main
- **Root Directory**: ./

### MongoDB Atlas
- **Cluster**: cluster0.ickywlq.mongodb.net
- **Database**: ecommerce
- **Status**: ✅ Connected and tested

### GitHub Repository
- **URL**: https://github.com/mohamadelagamal/E-Commerce-API
- **Branch**: main
- **Status**: ✅ Up to date

---

## 📋 Environment Variables for Hostinger

You need to add these environment variables in your Hostinger deployment settings:

### Required Environment Variables

```bash
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# MongoDB Atlas (Already configured ✅)
MONGODB_URI=mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.ickywlq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# JWT Secrets (IMPORTANT: Generate strong random strings!)
JWT_SECRET=your_production_jwt_secret_32_chars_minimum
JWT_REFRESH_SECRET=your_production_refresh_secret_32_chars_minimum
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@kammelhatwsl.com

# Frontend URL
FRONTEND_URL=https://kammelhatwsl.com

# Stripe (if using payments)
STRIPE_SECRET_KEY=your_stripe_live_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_live_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_live_webhook_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### How to Add Environment Variables in Hostinger

1. Go to your Hostinger deployment settings
2. Find "Environment variables" section
3. Click "Add" for each variable
4. Enter the key and value
5. Save changes

---

## 🔐 Generate Strong JWT Secrets

Use PowerShell to generate secure secrets:

```powershell
# Generate JWT_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Generate JWT_REFRESH_SECRET (run again for different value)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use Node.js:

```javascript
require('crypto').randomBytes(32).toString('hex')
```

---

## 🌐 MongoDB Atlas Network Access

**IMPORTANT**: Whitelist Hostinger's IP address in MongoDB Atlas

### Steps:

1. Get your Hostinger server IP:
   - Check Hostinger deployment logs
   - Or contact Hostinger support

2. Add IP to MongoDB Atlas:
   - Go to https://cloud.mongodb.com/
   - Click **Network Access**
   - Click **Add IP Address**
   - Enter your Hostinger server IP
   - Click **Confirm**

**Current whitelisted IPs**:
- ✅ 41.235.233.21 (Your local development IP)
- ⏳ Add Hostinger server IP

**Temporary option** (not recommended for production):
- Use `0.0.0.0/0` to allow all IPs

---

## 📦 Build Settings

Your current Hostinger build settings:

```yaml
Framework: Express
Branch: main
Node Version: 22.x
Root Directory: ./
Build Command: (Default for Express)
Start Command: npm start
```

### Verify package.json Scripts

Make sure your `package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

✅ Already configured in your project!

---

## 🚀 Deployment Process

### Option 1: Deploy via Hostinger Dashboard

1. Go to your Hostinger dashboard
2. Find your deployment for `shopapi.kammelhatwsl.com`
3. Click **Deploy** button
4. Wait for deployment to complete
5. Check deployment logs for any errors

### Option 2: Deploy via Git Push

```bash
# Make changes
git add .

# Commit
git commit -m "Deploy to production"

# Push to main branch (triggers Hostinger deployment)
git push origin main
```

Hostinger will automatically detect the push and redeploy.

---

## ✅ Post-Deployment Verification

### 1. Check Health Endpoint

```bash
curl https://shopapi.kammelhatwsl.com/api/v1/health
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-01-16T13:00:00.000Z"
}
```

### 2. Check MongoDB Connection

Look for this in Hostinger logs:
```
✅ MongoDB Connected: ac-w6fnmjh-shard-00-02.ickywlq.mongodb.net
```

### 3. Test API Endpoints

Use the updated Postman collection:
- Import: `postman/E-Commerce-API.postman_collection.json`
- Use environment: `E-Commerce API - Production`
- Base URL is already set to: `https://shopapi.kammelhatwsl.com/api/v1`

---

## 📊 Testing with Postman

### Import Production Environment

1. Open Postman
2. Click **Environments** → **Import**
3. Select: `postman/E-Commerce-API-Production.postman_environment.json`
4. The base URL is already configured: `https://shopapi.kammelhatwsl.com/api/v1`

### Test Endpoints

```bash
# Health Check
GET https://shopapi.kammelhatwsl.com/api/v1/health

# Register User
POST https://shopapi.kammelhatwsl.com/api/v1/auth/register

# Login
POST https://shopapi.kammelhatwsl.com/api/v1/auth/login

# Get Products
GET https://shopapi.kammelhatwsl.com/api/v1/products
```

---

## 🔧 Troubleshooting

### Issue: MongoDB Connection Fails

**Symptoms**:
```
❌ MongoDB Connection Error: querySrv ENOTFOUND
```

**Solutions**:
1. Check if Hostinger IP is whitelisted in MongoDB Atlas
2. Verify `MONGODB_URI` environment variable is set correctly
3. Check MongoDB Atlas cluster status
4. Try using `0.0.0.0/0` temporarily to test

### Issue: Server Won't Start

**Symptoms**:
- Deployment succeeds but app doesn't respond
- 502 Bad Gateway error

**Solutions**:
1. Check Hostinger deployment logs
2. Verify Node.js version is 22.x
3. Check if `PORT` environment variable is set
4. Ensure `npm start` script exists in package.json
5. Check for missing dependencies

### Issue: Environment Variables Not Working

**Symptoms**:
- App uses default values
- Features not working as expected

**Solutions**:
1. Verify all environment variables are added in Hostinger
2. Restart the application after adding variables
3. Check for typos in variable names
4. Ensure no spaces in variable values

### Issue: CORS Errors

**Symptoms**:
```
Access-Control-Allow-Origin error
```

**Solutions**:
1. Update `FRONTEND_URL` environment variable
2. Check CORS configuration in your code
3. Ensure frontend domain is correct

---

## 📁 File Structure on Hostinger

```
/
├── node_modules/          # Installed dependencies
├── src/                   # Source code
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── uploads/               # Uploaded files (create if needed)
├── .env                   # Created from environment variables
├── package.json
├── package-lock.json
└── server.js              # Entry point
```

---

## 🔄 Update Workflow

### Making Changes and Deploying

```bash
# 1. Make your changes locally
# Edit files...

# 2. Test locally
npm run dev

# 3. Test MongoDB connection
# Should see: ✅ MongoDB Connected

# 4. Commit changes
git add .
git commit -m "Description of changes"

# 5. Push to GitHub
git push origin main

# 6. Hostinger automatically redeploys!
```

### Monitor Deployment

1. Go to Hostinger dashboard
2. Check deployment status
3. View deployment logs
4. Test API endpoints

---

## 📝 Important Notes

### SSL Certificate
- ✅ Hostinger provides free SSL
- Your API is accessible via HTTPS
- Certificate auto-renews

### Domain Configuration
- **API Domain**: shopapi.kammelhatwsl.com
- **Main Domain**: kammelhatwsl.com (for frontend)
- Both should have SSL enabled

### Database Backups
- MongoDB Atlas provides automatic backups
- Configure backup schedule in Atlas dashboard
- Test restore process periodically

### Monitoring
- Check Hostinger logs regularly
- Monitor MongoDB Atlas metrics
- Set up error alerts if possible

---

## 🎯 Quick Reference

### Production URLs
```
API Base: https://shopapi.kammelhatwsl.com/api/v1
Health: https://shopapi.kammelhatwsl.com/api/v1/health
Docs: https://shopapi.kammelhatwsl.com/api/v1/docs (if configured)
```

### MongoDB Connection
```
Cluster: cluster0.ickywlq.mongodb.net
Database: ecommerce
Status: ✅ Connected
```

### Deployment
```
Platform: Hostinger
Framework: Express.js
Node: 22.x
Branch: main
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] All environment variables added in Hostinger
- [ ] JWT secrets generated (strong and unique)
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Email credentials configured
- [ ] Stripe keys updated (if using payments)
- [ ] Frontend URL configured
- [ ] Code tested locally
- [ ] All changes committed and pushed

After deploying:
- [ ] Health endpoint responds
- [ ] MongoDB connection successful
- [ ] API endpoints working
- [ ] Postman tests passing
- [ ] SSL certificate active
- [ ] No errors in logs

---

## 🆘 Support Resources

- **Hostinger Support**: https://www.hostinger.com/tutorials/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Express.js**: https://expressjs.com/
- **GitHub**: https://github.com/mohamadelagamal/E-Commerce-API

---

## 🎉 Success!

Once deployed, your API will be live at:
**https://shopapi.kammelhatwsl.com/api/v1**

Test it with:
```bash
curl https://shopapi.kammelhatwsl.com/api/v1/health
```

---

**Last Updated**: January 16, 2026
**Domain**: shopapi.kammelhatwsl.com
**Status**: Ready to deploy!
