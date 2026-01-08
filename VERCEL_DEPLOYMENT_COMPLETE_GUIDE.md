# Vercel Deployment Complete Guide - Kaalis Store

## 🎉 Final Status: FULLY DEPLOYED & WORKING

**Live Site**: https://kaalis-store-frontend.vercel.app

---

## The Journey: Problems & Solutions

### Problem 1: "No Output Directory named 'dist' found"

**Error Message**:
```
Error: No Output Directory named "dist" found after the Build completed.
```

**Root Cause**: 
The Vercel Root Directory was set to `frontend`, but our `vercel.json` configuration expected it to be empty. This caused path mismatches where Vercel couldn't find the built `dist` folder.

**Solution**:
1. **Delete the Vercel project** and redeploy
2. **Critical Setting**: Set Root Directory to **EMPTY** (not `frontend`)
3. Update `vercel.json` to use the legacy `builds` system

**Key Learning**: When using `vercel.json` with the `builds` array, the Root Directory MUST be empty for monorepo projects.

---

### Problem 2: Firebase Service Account Missing

**Error Message**:
```
Cannot find module '../config/serviceAccountKey.json'
Node.js process exited with exit status: 1
```

**Root Cause**:
The backend tried to load `serviceAccountKey.json` file which:
- Contains sensitive Firebase credentials
- Should NOT be committed to Git
- Doesn't exist in Vercel deployment

**Solution**: Made Firebase initialization optional

**File Modified**: `backend/utils/firebaseConfig.js`

```javascript
let bucket = null;

try {
  const serviceAccount = require("../config/serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "kaalis-store.appspot.com",
  });
  bucket = admin.storage().bucket();
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.warn("⚠️  Firebase service account not found - Firebase features will be disabled");
  console.warn("   This is normal for Vercel deployments without Firebase configured");
}

module.exports = { admin, bucket };
```

---

### Problem 3: PayDunya API Keys Missing

**Error Message**:
```
Error: PayDunya API keys are missing in environment variables
at new PayDunyaService (/var/task/backend/services/PayDunyaService.js:24:13)
Node.js process exited with exit status: 1
```

**Root Cause**:
PayDunya service threw an error in the constructor when API keys were missing, crashing the entire backend.

**Solution**: Made PayDunya service optional with graceful degradation

**File Modified**: `backend/services/PayDunyaService.js`

```javascript
class PayDunyaService {
  #isConfigured = false;

  constructor() {
    if (!this.#masterKey || !this.#publicKey || !this.#privateKey || !this.#token) {
      logger.warn("⚠️  PayDunya API keys are missing - PayDunya payment features will be disabled");
      logger.warn("   This is normal for Vercel deployments without PayDunya configured");
      this.#isConfigured = false;
      return;
    }
    this.#isConfigured = true;
    logger.info("PayDunyaService initialized with test keys");
  }

  async initializePayment(order, customerEmail, customerPhone) {
    if (!this.#isConfigured) {
      throw new Error("PayDunya is not configured. Please add API keys to environment variables.");
    }
    // ... rest of the method
  }
}
```

---

### Problem 4: Missing PayDunya Token Environment Variable

**Error**: Backend still crashed even after making services optional

**Root Cause**: The `PAYDUNYA_TOKEN_TEST` environment variable was not added to Vercel

**Solution**: Added the missing environment variable in Vercel Settings

---

## Complete Vercel Configuration

### 1. Project Settings (Manual Configuration Required)

Navigate to: **Vercel Dashboard → Your Project → Settings → General**

```
Framework Preset: Vue.js
Root Directory: [LEAVE EMPTY - CRITICAL!]
Build Command: npm run build
Output Directory: frontend/dist
Install Command: npm install --prefix=..
Development Command: vue-cli-service serve
Node.js Version: 20.x
```

### 2. Production Overrides

Navigate to: **Settings → General → Build & Development Settings**

```
Build Command: npm run build
Output Directory: frontend/dist
```

### 3. Environment Variables

Navigate to: **Settings → Environment Variables**

Add the following variables for **Production**, **Preview**, and **Development**:

#### Required Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (for CORS)
FRONTEND_URL=https://kaalis-store-frontend.vercel.app

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
```

#### PayDunya Variables (Required for Payment Features)

```bash
PAYDUNYA_MASTER_KEY=your-master-key
PAYDUNYA_PUBLIC_KEY_TEST=your-public-key
PAYDUNYA_PRIVATE_KEY_TEST=your-private-key
PAYDUNYA_TOKEN_TEST=tGFJfLHeOop1vSvBpKDK
PAYDUNYA_REDIRECT_URL=https://kaalis-store-frontend.vercel.app/api/paydunya/callback
```

#### Optional Variables

```bash
# Store Information
STORE_PHONE=+221000000000
STORE_ADDRESS=Your Store Address

# Firebase (if using Firebase features)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

---

## Files Modified

### 1. `vercel.json`

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["backend/**/*"],
        "maxDuration": 60
      }
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "buildCommand": "cd ../frontend && npm run build",
        "maxLambdaSize": "15mb",
        "memory": 3008
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/assets/(.*\\.css)",
      "dest": "/frontend/assets/$1"
    },
    {
      "src": "/assets/(.*\\.js)",
      "dest": "/frontend/assets/$1"
    },
    {
      "src": "/assets/(.*\\.(png|jpg|jpeg|gif|ico|svg|webp))",
      "dest": "/frontend/assets/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/index.html"
    }
  ]
}
```

### 2. `backend/utils/firebaseConfig.js`

Made Firebase optional with try-catch wrapper.

### 3. `backend/services/PayDunyaService.js`

Added `#isConfigured` flag and graceful degradation.

---

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "fix: vercel deployment configuration"
git push origin master
```

### Step 2: Configure Vercel Project

1. Go to Vercel Dashboard
2. Import your GitHub repository
3. **CRITICAL**: Set Root Directory to **EMPTY**
4. Set Framework Preset to **Vue.js**
5. Configure Build Settings as shown above

### Step 3: Add Environment Variables

1. Go to Settings → Environment Variables
2. Add all required variables listed above
3. Make sure to add them for all environments (Production, Preview, Development)

### Step 4: Deploy

1. Trigger deployment from Vercel Dashboard or push to GitHub
2. Wait for build to complete
3. Check deployment logs for any errors

### Step 5: Verify Deployment

1. **Frontend**: Visit https://kaalis-store-frontend.vercel.app
2. **Backend API**: Test https://kaalis-store-frontend.vercel.app/api/health
3. **Products**: Check https://kaalis-store-frontend.vercel.app/api/products
4. **Categories**: Verify https://kaalis-store-frontend.vercel.app/api/categories

---

## Common Issues & Troubleshooting

### Issue: "No Output Directory found"

**Solution**: Ensure Root Directory is **EMPTY** in Vercel settings

### Issue: Backend crashes with module not found

**Solution**: Check that all required environment variables are set

### Issue: CORS errors

**Solution**: Verify `FRONTEND_URL` environment variable matches your Vercel deployment URL

### Issue: Payment features not working

**Solution**: Ensure all PayDunya environment variables are correctly set, especially `PAYDUNYA_TOKEN_TEST`

---

## Success Checklist

- ✅ Frontend builds successfully
- ✅ Frontend assets load (CSS, JS, images)
- ✅ Backend API responds
- ✅ Products display on homepage
- ✅ Categories load correctly
- ✅ No crashes in Vercel Function Logs
- ✅ Payment services initialized (if keys provided)
- ✅ MongoDB connection works

---

## Key Takeaways

1. **Root Directory MUST be empty** when using `vercel.json` builds configuration
2. **Asset paths** don't include `/dist` when Root Directory is empty
3. **Optional services** should gracefully degrade when not configured
4. **Environment variables** are critical - double-check all are set
5. **PayDunya token** was the final missing piece that prevented full functionality

---

## Repository Structure

```
kaalis-store/
├── frontend/           # Vue.js frontend
│   ├── dist/          # Build output (generated)
│   ├── src/
│   └── package.json
├── backend/           # Express.js backend
│   ├── server.js
│   ├── services/
│   └── utils/
├── vercel.json        # Vercel configuration
└── package.json       # Root package.json
```

---

## Final Notes

This deployment uses Vercel's legacy `builds` system because:
1. We have a monorepo structure (frontend + backend)
2. We need explicit control over build processes
3. We need to deploy both static frontend and serverless backend

The configuration is now stable and working. Any future deployments should follow this same pattern.

**Deployment Date**: January 8, 2026  
**Status**: ✅ Production Ready  
**Live URL**: https://kaalis-store-frontend.vercel.app
