launchctl bootout gui/501 /Users/harz/Library/LaunchAgents/homebrew.mxcl.mongodb-community@4.4.plist || true && brew services start mongodb-community@4.4

brew services list | grep mongodb && ps aux | grep mongod | grep -v grep && /usr/local/opt/mongodb-community@4.4/bin/mongo --eval "db.adminCommand('ping')"

Walkthrough - MongoDB Service Restoration

The MongoDB service was failing to start due to a stale launchctl state ("Bootstrap failed: 5"). This has been resolved, and the service is now fully operational.

Changes Made

Service Restoration

Performed a manual startup to verify that the mongod binary, configuration, and data directory were healthy.
Cleared the stale service registration using launchctl bootout.
Successfully restarted the MongoDB community service via brew services.

Verification Results

Automated Tests

✅ Service Status: brew services list confirms mongodb-community@4.4 is started.
✅ Process Check: ps aux confirms the mongod process is running with the correct configuration.
✅ Database Ping: mongo --eval "db.adminCommand('ping')" returned { "ok" : 1 }, confirming the database is accepting connections.

Manual Verification

You can now connect using MongoDB Compass at localhost:27017.

I can help you set up authentication for Nodemailer with Gmail. Gmail no longer allows you to use your regular account password directly due to security restrictions. Here are your options:

## Option 1: App Password (Recommended for personal use)

If you have 2-Step Verification enabled on your Google account:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords** (at the bottom)
4. Select "Mail" as the app and your device
5. Click **Generate**
6. Copy the 16-character password (spaces don't matter)

Use it in Nodemailer like this:

```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password", // The 16-character password
  },
});
```

## Option 2: OAuth2 (More secure, recommended for production)

This is more complex but more secure:

```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "your-email@gmail.com",
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    refreshToken: "YOUR_REFRESH_TOKEN",
  },
});
```

You'll need to set up OAuth2 credentials in the Google Cloud Console.

**Important security notes:**

- Never commit passwords or app passwords to version control
- Store them in environment variables using a `.env` file
- Add `.env` to your `.gitignore`

Would you like help setting up either of these methods in more detail?

If you can't see the "App passwords" option, here are the most common reasons and solutions:

## 1. **2-Step Verification isn't enabled**

App passwords only appear after you enable 2-Step Verification:

- Go to https://myaccount.google.com/security
- Look for "2-Step Verification" and turn it ON
- After enabling it, wait a few minutes, then check again for "App passwords"

## 2. **Workspace/Organization account**

If you're using a work or school Google account, your administrator may have disabled app passwords. You'll need to:

- Contact your IT admin, or
- Use a personal Gmail account instead

## 3. **Advanced Protection Program**

If you're enrolled in Google's Advanced Protection Program, app passwords are disabled. You'd need to use OAuth2 instead.

## Quick troubleshooting steps:

1. **Verify 2-Step Verification is on:** https://myaccount.google.com/signinoptions/two-step-verification
2. **Direct link to App passwords:** https://myaccount.google.com/apppasswords (try this after enabling 2FA)
3. **Wait a bit:** Sometimes it takes 5-10 minutes for the option to appear after enabling 2FA

## Alternative: Less Secure Apps (Not recommended)

Google has deprecated this, but if you absolutely need a quick test in development:

- This option is no longer available for most accounts as of May 2022

**What type of Google account are you using?** (Personal Gmail, work/school, etc.) This will help me give you the most relevant solution.
