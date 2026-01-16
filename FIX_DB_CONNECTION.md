# 🌐 Fix MongoDB Connection (IP Whitelisting)

Your application is running, but MongoDB Atlas is blocking the connection. You need to verify your Hostinger Server IP and add it to the whitelist.

## ✅ Step 1: Get Your Server IP

I have added a special page to your API to tell you the IP address.

1.  Wait a few minutes for the latest deployment to finish.
2.  Visit this link:
    👉 **[https://shopapi.kammelhatwsl.com/ip](https://shopapi.kammelhatwsl.com/ip)**

3.  Copy the IP address shown on that page.

---

## ✅ Step 2: Whitelist IP in MongoDB Atlas

1.  Go to **[MongoDB Atlas](https://cloud.mongodb.com)**.
2.  Click on **Network Access** in the left sidebar.
3.  Click the green **+ Add IP Address** button.
4.  Paste the IP you copied.
5.  Add a comment like "Hostinger Server".
6.  Click **Confirm**.

---

## ⚡ Fast Alternative: Allow All IPs

If you are having trouble finding the IP, you can temporarily allow ALL connections to fix it instantly:

1.  Go to **Network Access** -> **Add IP Address**.
2.  Click **Allow Access from Anywhere** (or enter `0.0.0.0/0`).
3.  Click **Confirm**.

⚠️ **Note**: This is less secure than a specific IP, but it GUARANTEES your app will work immediately.
