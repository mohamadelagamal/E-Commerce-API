# 🚀 Deployment Guide - Hostinger with GitHub Actions

This guide will help you deploy your E-Commerce Backend to Hostinger automatically using GitHub Actions.

## 📋 Prerequisites

- ✅ Hostinger Business Plan (with Node.js support)
- ✅ MongoDB Atlas account (already configured)
- ✅ GitHub account
- ✅ Git installed on your computer

---

## 🗄️ Step 1: MongoDB Atlas Setup (Already Done ✓)

Your MongoDB Atlas is already configured with:
- **Username:** `mohamadelgamaltech_db_user`
- **Password:** `JFWC7vo2dok12QEu`
- **Cluster:** `Cluster0`
- **IP Whitelist:** `41.235.233.21` (your current IP)

### ⚠️ Important: Add Hostinger IP to MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0) for production
   - Or add Hostinger's specific IP address if they provide one
5. Click **Confirm**

---

## 📦 Step 2: Push Your Project to GitHub

### 2.1 Initialize Git Repository (if not already done)

Open PowerShell in your project directory and run:

```powershell
cd "c:\Users\HP\.gemini\antigravity\scratch\ecommerce-backend"
git init
git add .
git commit -m "Initial commit - E-Commerce Backend"
```

### 2.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `ecommerce-backend`
3. **DO NOT** initialize with README (we already have code)
4. Click **Create repository**

### 2.3 Push to GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-backend.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🔐 Step 3: Configure GitHub Secrets

GitHub Actions needs secure credentials to deploy to Hostinger. Add these secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these:

### Required Secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `FTP_SERVER` | Your Hostinger FTP hostname | Hostinger hPanel → Files → FTP Accounts |
| `FTP_USERNAME` | Your FTP username | Hostinger hPanel → Files → FTP Accounts |
| `FTP_PASSWORD` | Your FTP password | Hostinger hPanel → Files → FTP Accounts |
| `FTP_SERVER_DIR` | `/public_html/` or `/public_html/api/` | Where you want files uploaded |
| `SSH_HOST` | Your Hostinger SSH hostname | Hostinger hPanel → Advanced → SSH Access |
| `SSH_USERNAME` | Your SSH username | Same as FTP usually |
| `SSH_PASSWORD` | Your SSH password | Same as FTP usually |
| `SSH_PORT` | `21` or `22` | Usually 21 for Hostinger |
| `APP_PATH` | `/home/username/public_html/` | Full path to your app |

### Environment Variables (Optional but Recommended):

Add these as secrets too (they'll be set on Hostinger):

| Secret Name | Value |
|------------|-------|
| `MONGODB_URI` | `mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority` |
| `JWT_SECRET` | `ecommerce_jwt_secret_key_2026_production` |
| `NODE_ENV` | `production` |

---

## 🎯 Step 4: Configure Hostinger Node.js App

### 4.1 Access Hostinger hPanel

1. Log in to [Hostinger](https://hpanel.hostinger.com/)
2. Select your hosting plan

### 4.2 Setup Node.js Application

1. In hPanel, search for **"Setup Node.js App"**
2. Click **Create Application**
3. Configure:
   - **Node.js Version:** `18.x` or `20.x`
   - **Application Mode:** `Production`
   - **Application Root:** `/public_html` (or your chosen directory)
   - **Application URL:** Your domain or subdomain
   - **Application Startup File:** `server.js`
   - **Port:** Leave default (usually auto-assigned)

4. Click **Create**

### 4.3 Set Environment Variables in Hostinger

In the Node.js App settings, find **Environment Variables** section and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=ecommerce_jwt_secret_key_2026_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=ecommerce_refresh_secret_key_2026_production
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://yourdomain.com
```

**⚠️ Important:** Do NOT include Redis variables if Hostinger doesn't support Redis. We'll handle this in code.

---

## 🚀 Step 5: Deploy Using GitHub Actions

### Automatic Deployment

Every time you push to the `main` branch, GitHub Actions will automatically:
1. ✅ Checkout your code
2. ✅ Install dependencies
3. ✅ Upload files to Hostinger via FTP
4. ✅ Restart your Node.js application

### Manual Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Hostinger** workflow
4. Click **Run workflow** → **Run workflow**

---

## 🔧 Step 6: Handle Redis (Optional)

Since Hostinger Business plan doesn't include Redis, you have two options:

### Option A: Disable Redis (Recommended for now)

Update your code to make Redis optional. I can help you with this.

### Option B: Use External Redis Service

Use a free Redis service like:
- [Redis Labs](https://redis.com/try-free/) (Free tier: 30MB)
- [Upstash](https://upstash.com/) (Free tier: 10,000 commands/day)

Then add to environment variables:
```
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

---

## ✅ Step 7: Verify Deployment

### 7.1 Check if App is Running

Visit: `https://yourdomain.com/api/v1/health`

You should see:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-01-16T12:40:00.000Z"
}
```

### 7.2 Check Logs

In Hostinger hPanel:
1. Go to **Setup Node.js App**
2. Click on your application
3. Check **Application Logs** for any errors

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**
1. Check MongoDB Atlas Network Access
2. Add `0.0.0.0/0` to IP whitelist
3. Verify connection string in environment variables

### Issue: App Not Starting

**Solution:**
1. Check Hostinger logs
2. Verify `server.js` is the correct startup file
3. Ensure all environment variables are set
4. Check Node.js version compatibility

### Issue: GitHub Action Fails

**Solution:**
1. Verify all GitHub secrets are set correctly
2. Check FTP credentials in Hostinger
3. Ensure SSH access is enabled
4. Review GitHub Actions logs for specific errors

---

## 📝 Quick Commands Reference

### Push Changes and Deploy

```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

This will automatically trigger deployment to Hostinger!

### Check Git Status

```powershell
git status
```

### View Commit History

```powershell
git log --oneline
```

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas configured with IP whitelist
- [ ] Project pushed to GitHub
- [ ] GitHub secrets configured
- [ ] Hostinger Node.js app created
- [ ] Environment variables set in Hostinger
- [ ] First deployment successful
- [ ] API health check returns success
- [ ] Can access endpoints via Postman

---

## 📞 Need Help?

If you encounter any issues:
1. Check Hostinger logs first
2. Review GitHub Actions logs
3. Verify MongoDB Atlas connection
4. Check all environment variables

---

## 🔄 Workflow Summary

```
Local Changes → Git Commit → Git Push → GitHub Actions → FTP Upload → Hostinger → App Restart → Live! 🎉
```

**Deployment Time:** ~2-3 minutes per push

---

*Last Updated: January 16, 2026*
