# 🔐 GitHub Secrets Configuration Guide

This file contains all the secrets you need to configure in your GitHub repository for automatic deployment to Hostinger.

## 📍 Where to Add Secrets

1. Go to: https://github.com/mohamadelagamal/E-Commerce-API
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

---

## 🔑 Required Secrets

### MongoDB Atlas (Already Configured ✅)

**Secret Name**: `MONGODB_URI`
**Value**:
```
mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
```

---

### JWT Secrets (IMPORTANT: Change these for production!)

**Secret Name**: `JWT_SECRET`
**Value**: Generate a strong random string (at least 32 characters)
```
Example: ecommerce_production_jwt_secret_2026_very_secure_key_xyz123
```

**Secret Name**: `JWT_REFRESH_SECRET`
**Value**: Generate another strong random string (different from JWT_SECRET)
```
Example: ecommerce_production_refresh_secret_2026_very_secure_key_abc456
```

💡 **Tip**: Generate secure secrets using this command in PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

### Hostinger FTP Credentials

**Secret Name**: `FTP_SERVER`
**Value**: Your Hostinger FTP server address
```
Example: ftp.yourdomain.com
```

**Secret Name**: `FTP_USERNAME`
**Value**: Your FTP username from Hostinger
```
Example: user@yourdomain.com
```

**Secret Name**: `FTP_PASSWORD`
**Value**: Your FTP password from Hostinger
```
Your FTP password here
```

**Secret Name**: `FTP_SERVER_DIR`
**Value**: The directory path on your Hostinger server
```
Example: /public_html/api/
or: /domains/yourdomain.com/public_html/api/
```

---

### Hostinger SSH Credentials (Optional but Recommended)

**Secret Name**: `SSH_HOST`
**Value**: Your domain or server IP
```
Example: yourdomain.com
or: 123.456.789.012
```

**Secret Name**: `SSH_USERNAME`
**Value**: Your SSH username
```
Example: u123456789
```

**Secret Name**: `SSH_PASSWORD`
**Value**: Your SSH password
```
Your SSH password here
```

**Secret Name**: `SSH_PORT`
**Value**: SSH port (usually 22)
```
22
```

**Secret Name**: `APP_PATH`
**Value**: Full path to your application on the server
```
Example: /home/u123456789/domains/yourdomain.com/public_html/api
```

---

### Email Configuration (for sending emails)

**Secret Name**: `EMAIL_USER`
**Value**: Your email address
```
Example: your-email@gmail.com
```

**Secret Name**: `EMAIL_PASSWORD`
**Value**: Your email password or app-specific password
```
For Gmail, use App Password: https://myaccount.google.com/apppasswords
```

**Secret Name**: `EMAIL_FROM`
**Value**: The "from" email address
```
Example: noreply@yourdomain.com
```

---

### Frontend URL

**Secret Name**: `FRONTEND_URL`
**Value**: Your frontend application URL
```
Example: https://yourdomain.com
or: https://www.yourdomain.com
```

---

### Stripe Payment (Optional - if using Stripe)

**Secret Name**: `STRIPE_SECRET_KEY`
**Value**: Your Stripe secret key
```
Get from: https://dashboard.stripe.com/apikeys
Example: sk_live_xxxxxxxxxxxxx
```

**Secret Name**: `STRIPE_PUBLISHABLE_KEY`
**Value**: Your Stripe publishable key
```
Example: pk_live_xxxxxxxxxxxxx
```

**Secret Name**: `STRIPE_WEBHOOK_SECRET`
**Value**: Your Stripe webhook secret
```
Example: whsec_xxxxxxxxxxxxx
```

---

### Redis (Optional - if Hostinger supports Redis)

**Secret Name**: `REDIS_HOST`
**Value**: Redis host
```
Default: localhost
```

**Secret Name**: `REDIS_PORT`
**Value**: Redis port
```
Default: 6379
```

**Secret Name**: `REDIS_PASSWORD`
**Value**: Redis password (if required)
```
Leave empty if no password
```

---

## ✅ Verification Checklist

After adding all secrets, verify:

- [ ] MongoDB Atlas IP whitelist includes Hostinger server IP
- [ ] All FTP credentials are correct
- [ ] SSH credentials work (test with SSH client)
- [ ] JWT secrets are strong and unique
- [ ] Email credentials are valid (test sending an email)
- [ ] Frontend URL is correct
- [ ] Stripe keys are from the correct environment (test/live)

---

## 🚀 How to Get Hostinger Credentials

### FTP Credentials:
1. Log in to Hostinger control panel
2. Go to **Files** → **FTP Accounts**
3. Find or create an FTP account
4. Note the server, username, and password

### SSH Credentials:
1. Log in to Hostinger control panel
2. Go to **Advanced** → **SSH Access**
3. Enable SSH if not already enabled
4. Note the SSH username, host, and port
5. Use the same password as your Hostinger account or set a new one

### Server Path:
1. Log in via FTP or SSH
2. Navigate to find your public_html directory
3. Create a subdirectory for your API (e.g., `/public_html/api`)
4. Note the full path

---

## 🔒 Security Best Practices

1. **Never commit secrets to Git** - They're in .gitignore
2. **Use strong, unique passwords** for production
3. **Rotate secrets regularly** (every 90 days recommended)
4. **Use app-specific passwords** for email (not your main password)
5. **Limit MongoDB Atlas IP access** - Don't use 0.0.0.0/0 in production
6. **Use environment-specific Stripe keys** - Test keys for development, live keys for production

---

## 📝 Quick Setup Commands

After adding all secrets, test your deployment:

```bash
# Make a small change
echo "# Test" >> README.md

# Commit with the trigger phrase
git add .
git commit -m "upload to hostinger - testing deployment"

# Push to GitHub
git push origin main
```

Then check the **Actions** tab in your GitHub repository to see the deployment progress!

---

## 🆘 Need Help?

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Hostinger Support**: https://www.hostinger.com/tutorials/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Deployment Guide**: See `HOSTINGER_DEPLOYMENT.md`

---

**Last Updated**: January 16, 2026
