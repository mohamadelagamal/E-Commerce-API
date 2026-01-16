# 🚀 Quick Start - Push to GitHub & Deploy to Hostinger

## ✅ What's Been Configured

Your E-Commerce Backend is now ready for deployment with:

1. ✅ **MongoDB Atlas Integration** - Mongoose configured with your credentials
2. ✅ **GitHub Actions Workflow** - Auto-deploy to Hostinger
3. ✅ **Environment Variables** - Properly configured in .env
4. ✅ **.gitignore** - Sensitive files protected

---

## 📋 Before You Push - Quick Checklist

### 1. Get Correct MongoDB Connection String

⚠️ **IMPORTANT**: You need to get your cluster's exact hostname from MongoDB Atlas.

**Quick Steps**:
1. Go to https://cloud.mongodb.com/
2. Click **"Connect"** on Cluster0
3. Choose **"Connect your application"**
4. Copy the connection string
5. It will look like: `mongodb+srv://mohamadelgamaltech_db_user:<password>@cluster0.XXXXX.mongodb.net/...`
6. Replace `XXXXX` with your actual cluster ID from the connection string

**Then update your `.env` file** (line 7):
```env
MONGODB_URI=mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.XXXXX.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
```

📖 **See `MONGODB_SETUP.md` for detailed instructions**

---

## 🚀 Step-by-Step: Push to GitHub

### Option 1: Use the Automated Script (Recommended)

Run this command in PowerShell:

```powershell
.\push-to-github.ps1
```

This script will:
- ✅ Initialize Git (if needed)
- ✅ Add all files
- ✅ Create initial commit
- ✅ Set up remote repository
- ✅ Push to GitHub

### Option 2: Manual Commands

If you prefer to do it manually:

```bash
# 1. Check git status
git status

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit - E-Commerce Backend with MongoDB Atlas"

# 4. Set main branch
git branch -M main

# 5. Add remote (if not already added)
git remote add origin https://github.com/mohamadelagamal/E-Commerce-API.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🔐 After Pushing: Configure GitHub Secrets

Once your code is on GitHub, you need to add secrets for deployment:

### Required Secrets:

1. **Go to**: https://github.com/mohamadelagamal/E-Commerce-API/settings/secrets/actions

2. **Click**: "New repository secret"

3. **Add these secrets** (see `GITHUB_SECRETS.md` for complete list):

| Secret Name | Where to Get It |
|------------|-----------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a strong random string |
| `JWT_REFRESH_SECRET` | Generate another strong random string |
| `FTP_SERVER` | Hostinger control panel → FTP Accounts |
| `FTP_USERNAME` | Hostinger FTP username |
| `FTP_PASSWORD` | Hostinger FTP password |
| `FTP_SERVER_DIR` | Path on server (e.g., `/public_html/api/`) |
| `SSH_HOST` | Your domain or server IP |
| `SSH_USERNAME` | Hostinger SSH username |
| `SSH_PASSWORD` | Hostinger SSH password |
| `SSH_PORT` | Usually `22` |
| `APP_PATH` | Full path to app on server |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASSWORD` | Email password or app-specific password |
| `FRONTEND_URL` | Your frontend URL |

📖 **See `GITHUB_SECRETS.md` for detailed instructions**

---

## 🎯 Deploy to Hostinger

### Automatic Deployment

Every time you push to the `main` branch, GitHub Actions will automatically deploy!

```bash
# Make changes
git add .

# Commit with trigger phrase
git commit -m "upload to hostinger - added new features"

# Push
git push origin main
```

### Manual Deployment

1. Go to: https://github.com/mohamadelagamal/E-Commerce-API/actions
2. Click **"Deploy to Hostinger"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

---

## 📁 Important Files Created

| File | Purpose |
|------|---------|
| `HOSTINGER_DEPLOYMENT.md` | Complete deployment guide |
| `GITHUB_SECRETS.md` | All GitHub secrets you need to configure |
| `MONGODB_SETUP.md` | MongoDB Atlas connection setup |
| `push-to-github.ps1` | Automated script to push to GitHub |
| `.github/workflows/deploy-to-hostinger.yml` | GitHub Actions workflow |

---

## 🔄 Typical Workflow

```bash
# 1. Make changes to your code
# Edit files...

# 2. Test locally
npm run dev

# 3. Add and commit
git add .
git commit -m "upload to hostinger - description of changes"

# 4. Push to GitHub (triggers auto-deployment)
git push origin main

# 5. Monitor deployment
# Go to: https://github.com/mohamadelagamal/E-Commerce-API/actions
```

---

## ✅ Verification Steps

### After Pushing to GitHub:
- [ ] Repository visible at: https://github.com/mohamadelagamal/E-Commerce-API
- [ ] All files are there (except .env - it should be ignored)
- [ ] GitHub Actions tab shows workflows

### After Configuring Secrets:
- [ ] All required secrets added
- [ ] MongoDB Atlas IP whitelist includes Hostinger server IP
- [ ] FTP/SSH credentials tested

### After Deployment:
- [ ] App accessible at your Hostinger URL
- [ ] API health check works: `https://yourdomain.com/api/v1/health`
- [ ] MongoDB connection successful (check logs)

---

## 🐛 Troubleshooting

### Git Push Fails - Authentication Error

**Solution**: Use a Personal Access Token (PAT)
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Use token as password when pushing

### MongoDB Connection Fails

**Solution**: 
1. Get correct connection string from MongoDB Atlas
2. Update `.env` file with the correct cluster hostname
3. Whitelist your IP in MongoDB Atlas Network Access
4. See `MONGODB_SETUP.md` for details

### GitHub Actions Deployment Fails

**Solution**:
1. Check all GitHub secrets are configured
2. Verify Hostinger credentials
3. Check workflow logs in Actions tab
4. See `HOSTINGER_DEPLOYMENT.md` for details

---

## 📚 Documentation Reference

- **Full Deployment Guide**: `HOSTINGER_DEPLOYMENT.md`
- **GitHub Secrets Setup**: `GITHUB_SECRETS.md`
- **MongoDB Setup**: `MONGODB_SETUP.md`
- **API Documentation**: `API_DOCUMENTATION.md`
- **Arabic Guide**: `ARABIC_GUIDE.md`

---

## 🎉 Ready to Start?

### Step 1: Fix MongoDB Connection String
1. Open `.env` file
2. Get correct connection string from MongoDB Atlas
3. Update line 7 with the correct cluster hostname

### Step 2: Push to GitHub
```powershell
.\push-to-github.ps1
```

### Step 3: Configure GitHub Secrets
Follow instructions in `GITHUB_SECRETS.md`

### Step 4: Deploy!
```bash
git commit -m "upload to hostinger - initial deployment"
git push origin main
```

---

## 🆘 Need Help?

1. **MongoDB Issues**: See `MONGODB_SETUP.md`
2. **GitHub Issues**: See `GITHUB_SECRETS.md`
3. **Deployment Issues**: See `HOSTINGER_DEPLOYMENT.md`
4. **API Documentation**: See `API_DOCUMENTATION.md`

---

**Good luck with your deployment! 🚀**

---

**Created**: January 16, 2026
**Repository**: https://github.com/mohamadelagamal/E-Commerce-API
