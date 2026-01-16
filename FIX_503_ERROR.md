# 🔧 Fixing 503 Service Unavailable Error

If you are seeing a **503 Service Unavailable** error page on your Hostinger URL (`shopapi.kammelhatwsl.com`), it means your application failed to start correctly.

This is 99% likely caused by **missing environment variables** in your Hostinger dashboard.

---

## 🛑 The Problem

Your application needs secrets (like MongoDB password, JWT keys) to run. These secrets are in your `.env` file locally, but **git ignores .env files** for security.

So, when you deployed to Hostinger, the server started with **empty secrets**, tried to connect to the database with no URL, failed, and crashed.

---

## ✅ The Fix (Do this immediately!)

You must manually add your environment variables in the Hostinger control panel.

### 1. Go to Hostinger Dashboard
Navigate to your VPS or Cloud deployment settings where "shopapi" is hosted.

### 2. Find "Environment Variables"
Look for a section called **Environment Variables**, **Env Vars**, or **Configuration**.

### 3. Add These Variables (Copy/Paste):

| Variable | Value (Copy exact values from your local .env) |
|----------|-----------------------------------------------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` (or leave empty if Hostinger handles it) |
| `MONGODB_URI` | `mongodb+srv://mohamadelgamaltech_db_user:JFWC7vo2dok12QEu@cluster0.ickywlq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | (Your strong random string) |
| `JWT_REFRESH_SECRET` | (Your strong random string) |
| `FRONTEND_URL` | `https://kammelhatwsl.com` |

**💡 Tip:** If you can't find individual fields, look for a bulk editor/paste option and paste your `.env.production` content there.

### 4. Restart the Application
After adding the variables, you **must restart** the application for them to take effect. Find the "Restart" or "Redeploy" button.

---

## 🔍 Step 2: Whitelist Hostinger IP

If the env vars are correct but it still fails, Hostinger might be blocked by MongoDB Atlas.

1. **Check Application Logs** in Hostinger.
   - If you see `MongooseServerSelectionError`, `connection timed out`, or `querySrv ENOTFOUND`, it's an IP issue.

2. **Add IP to Mongo Atlas**:
   - Go to Hostinger -> See your Server IP.
   - Go to MongoDB Atlas -> Network Access -> Add IP Address.
   - Add the Hostinger IP.

---

## ⚡ Recent Code Fixes

I have just updated your code to prevent crashes even if the database fails:

1. **Updated `server.js`**: It will now start even if MongoDB fails initially.
2. **Updated `/health`**: You can now visit `https://shopapi.kammelhatwsl.com/api/v1/health` to see the status.

**Result**: instead of a 503 error page, you should now see:
```json
{
  "status": "success",
  "message": "Server is running",
  "database": "disconnected" 
}
```
This confirms the server is UP, but the database is DOWN (which means you need to fix the IP whitelist or URI).

---

## 🚀 Action Plan

1. **Push the recent code fixes** (I will do this now).
2. **Add Environment Variables** in Hostinger (You do this).
3. **Restart** Hostinger app.
4. **Check** `https://shopapi.kammelhatwsl.com/api/v1/health`.
