# 🚀 Hostinger Deployment Guide - E-Commerce Backend

This guide will help you deploy your E-Commerce Backend to Hostinger using GitHub Actions with MongoDB Atlas.

## 📋 Prerequisites

- ✅ MongoDB Atlas account with Cluster0 configured
- ✅ GitHub account
- ✅ Hostinger hosting account with Node.js support
- ✅ Git installed on your local machine

---

## 🗄️ Step 1: MongoDB Atlas Configuration

### 1.1 Database Connection (Already Configured ✅)

Your MongoDB Atlas credentials are already set up:
- **Username**: `mohamadelgamaltech_db_user`
- **Password**: `JFWC7vo2dok12QEu`
- **Cluster**: `Cluster0`
- **Database**: `ecommerce`

### 1.2 Important: Whitelist Hostinger IP Address

⚠️ **CRITICAL**: You need to add Hostinger's server IP to MongoDB Atlas Network Access:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click on **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Add your Hostinger server IP address (you'll get this from Hostinger control panel)
5. Or temporarily use `0.0.0.0/0` (allows all IPs - **not recommended for production**)

### 1.3 Test MongoDB Connection Locally

Run this command to test your MongoDB connection:

```bash
npm run dev
```

You should see: `✅ MongoDB Connected: cluster0-xxxxx.mongodb.net`

---

## 🐙 Step 2: Push to GitHub

### 2.1 Initialize Git Repository (if not already done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

### 2.2 Add All Files to Git

```bash
# Add all files (excluding those in .gitignore)
git add .

# Check what will be committed
git status
```

### 2.3 Commit Your Changes

```bash
# First commit
git commit -m "Initial commit - E-Commerce Backend with MongoDB Atlas"
```

### 2.4 Connect to GitHub Repository

```bash
# Add remote repository
git remote add origin https://github.com/mohamadelagamal/E-Commerce-API.git

# Verify remote
git remote -v

# Set main branch
git branch -M main
```

### 2.5 Push to GitHub

```bash
# Push to GitHub
git push -u origin main
```

If you encounter authentication issues, you may need to use a Personal Access Token (PAT):
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use the token as your password when pushing

---

## ⚙️ Step 3: Configure GitHub Secrets for Hostinger

### 3.1 Get Hostinger Credentials

Log in to your Hostinger control panel and gather:

1. **FTP Credentials**:
   - FTP Server (e.g., `ftp.yourdomain.com`)
   - FTP Username
   - FTP Password
   - FTP Server Directory (e.g., `/public_html/api` or `/domains/yourdomain.com/public_html`)

2. **SSH Credentials** (if available):
   - SSH Host
   - SSH Username
   - SSH Password
   - SSH Port (usually 22)
   - App Path (where your app is located on the server)

### 3.2 Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/mohamadelagamal/E-Commerce-API`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `FTP_SERVER` | Your Hostinger FTP server | `ftp.yourdomain.com` |
| `FTP_USERNAME` | Your FTP username | `user@yourdomain.com` |
| `FTP_PASSWORD` | Your FTP password | `your_ftp_password` |
| `FTP_SERVER_DIR` | Directory on server | `/public_html/api/` |
| `SSH_HOST` | SSH host (if available) | `yourdomain.com` |
| `SSH_USERNAME` | SSH username | `your_ssh_user` |
| `SSH_PASSWORD` | SSH password | `your_ssh_password` |
| `SSH_PORT` | SSH port | `22` |
| `APP_PATH` | App path on server | `/home/user/public_html/api` |

### 3.3 Add Environment Variables Secret

Create one more secret for your production environment variables:

**Secret Name**: `ENV_FILE`

**Value** (copy this and replace with your actual values):

```env
NODE_ENV=production
PORT=5000
API_VERSION=v1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=your_production_jwt_secret_key_here_make_it_strong
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_production_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# Redis (if Hostinger supports it)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

---

## 🚀 Step 4: Deploy to Hostinger

### 4.1 Automatic Deployment

Every time you push to the `main` branch, the GitHub Action will automatically deploy to Hostinger.

To trigger deployment with the specific phrase:

```bash
# Make some changes
git add .

# Commit with the trigger phrase
git commit -m "upload to hostinger - added new features"

# Push to GitHub
git push origin main
```

### 4.2 Manual Deployment

You can also trigger deployment manually:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Hostinger** workflow
4. Click **Run workflow** → **Run workflow**

### 4.3 Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Watch the deployment progress in real-time
4. Check for any errors in the logs

---

## 🔧 Step 5: Configure Hostinger Server

### 5.1 Node.js Setup on Hostinger

1. Log in to Hostinger control panel
2. Go to **Advanced** → **Node.js**
3. Create a new Node.js application:
   - **Application mode**: Production
   - **Application root**: `/public_html/api` (or your chosen directory)
   - **Application URL**: `https://yourdomain.com/api` or `https://api.yourdomain.com`
   - **Application startup file**: `server.js`
   - **Node.js version**: 18.x or higher

### 5.2 Install Dependencies on Hostinger

After first deployment, SSH into your Hostinger server and run:

```bash
cd /path/to/your/app
npm install --production
```

### 5.3 Start the Application

In Hostinger's Node.js manager:
- Click **Start** or **Restart** application
- Or use PM2 if available: `pm2 start server.js --name ecommerce-backend`

---

## ✅ Step 6: Verify Deployment

### 6.1 Test API Endpoints

```bash
# Health check
curl https://yourdomain.com/api/v1/health

# Expected response:
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-01-16T12:00:00.000Z"
}
```

### 6.2 Test MongoDB Connection

Check your application logs on Hostinger to verify:
- `✅ MongoDB Connected: cluster0-xxxxx.mongodb.net`

---

## 🔄 Step 7: Future Deployments

### Quick Deployment Workflow

```bash
# 1. Make your changes
# Edit files...

# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "upload to hostinger - description of changes"
git push origin main

# 4. GitHub Actions will automatically deploy!
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: `MongoDB Connection Error`

**Solutions**:
1. Check if Hostinger IP is whitelisted in MongoDB Atlas Network Access
2. Verify MongoDB credentials in environment variables
3. Check if MongoDB Atlas cluster is running
4. Try using `0.0.0.0/0` temporarily to allow all IPs

### GitHub Actions Fails

**Problem**: Deployment workflow fails

**Solutions**:
1. Check GitHub Secrets are correctly set
2. Verify FTP/SSH credentials
3. Check workflow logs in GitHub Actions tab
4. Ensure Hostinger server has enough disk space

### Application Not Starting

**Problem**: App doesn't start on Hostinger

**Solutions**:
1. Check Node.js version compatibility (use 18.x or higher)
2. Run `npm install --production` on the server
3. Check application logs in Hostinger control panel
4. Verify `server.js` is the correct startup file
5. Check if PORT environment variable is set correctly

### File Upload Issues

**Problem**: File uploads fail

**Solutions**:
1. Ensure `uploads/` directory exists and has write permissions
2. Check `MAX_FILE_SIZE` in environment variables
3. Verify Hostinger allows file uploads

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Hostinger Node.js Hosting](https://www.hostinger.com/tutorials/nodejs-hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## 🎉 Congratulations!

Your E-Commerce Backend is now deployed to Hostinger with MongoDB Atlas! 

Every time you commit with "upload to hostinger" in the message, your app will automatically deploy.

**Next Steps**:
1. Set up your frontend application
2. Configure custom domain
3. Set up SSL certificate (Hostinger provides free SSL)
4. Monitor application performance
5. Set up error tracking (e.g., Sentry)

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Hostinger application logs
4. Contact Hostinger support for server-specific issues
5. Check MongoDB Atlas status page

---

**Last Updated**: January 16, 2026
**Version**: 1.0.0
