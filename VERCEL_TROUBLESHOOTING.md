# Vercel Deployment & Custom Domain Troubleshooting Guide

> **Critical Documentation**: This guide documents the resolution of a complex Vercel deployment issue with custom domains that took days to debug. Follow this guide to avoid repeating the same mistakes.

## 🚨 Problem Summary

**Issue**: Custom domains (`bruthol.com`, `www.bruthol.com`) showing 500 errors and authentication failures while preview deployments worked perfectly.

**Root Causes Discovered**:

1. Outdated "Current" production deployment (129 days old)
2. Missing environment variables causing backend crashes
3. Conflicting `builds` and `functions` in `vercel.json`
4. API routing configuration issues

---

## 🔍 Debugging Process

### Step 1: Identify the Core Issue

**Symptoms**:

- ✅ Preview deployments work: `https://kaalis-store-xxx.vercel.app`
- ❌ Custom domains fail: `https://bruthol.com`, `https://www.bruthol.com`
- Different JavaScript file names in browser logs indicate different builds

**Key Discovery**:

```bash
# Check which deployment your domain points to
vercel inspect www.bruthol.com
vercel inspect bruthol.com

# Check deployment aliases
vercel alias ls | grep bruthol
```

**Result**: Domains were pointing to a 129-day-old deployment without recent fixes.

### Step 2: Analyze Request Patterns

**Working Deployments**:

```javascript
// Browser logs showed:
Making request to: "https://bruthol.com/api/users/login" // External API call
baseURL: "https://bruthol.com/api"
POST /users/login: 200 ✅
```

**Failing Deployments**:

```javascript
// Browser logs showed:
Making request to: "/api/users/login" // Relative API call
baseURL: "/api"
POST /users/login: 500 ❌
```

**Insight**: Working deployments were using external API calls, failing ones were using same-origin calls to broken backends.

### Step 3: Check Backend Logs

```bash
# Check runtime logs for your domain
vercel logs https://bruthol.com

# Check specific deployment logs
vercel inspect --logs deployment-id
```

**Critical Discovery**: Backend was crashing due to missing environment variables:

```
Error: PayDunya API keys are missing in environment variables
Node.js process exited with exit status: 1
```

---

## ✅ Solution Implementation

### 1. Fix Environment Variables

**Add Missing Variables** in Vercel Dashboard → Settings → Environment Variables:

```env
# PayDunya Configuration (Required)
PAYDUNYA_MASTER_KEY=iIgnlT2w-P38F-ZCSr-FgSw-TVUC4OX4XPBS
PAYDUNYA_PUBLIC_KEY_TEST=test_public_frdFTlObmVx1hXoJ6yiOrEuFSbp
PAYDUNYA_PRIVATE_KEY_TEST=test_private_0ursez9mp93s9Yb4UgG36iql3gx
PAYDUNYA_TOKEN_TEST=tGFJfLHeOop1vSvBpKDK
PAYDUNYA_REDIRECT_URL=https://bruthol.com/api/paydunya/callback

# Other Required Variables
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PAYSTACK_SECRET_KEY=sk_test_...
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=secure_password
ADMIN_DEPLOYMENT_KEY=deployment-key-123
```

**⚠️ Important**: Set environment to **Production** for custom domains.

### 2. Fix vercel.json Configuration

**❌ Problematic Configuration**:

```json
{
  "builds": [...],
  "functions": {...},  // ← Conflict!
  "env": {...}         // ← Hardcoded values cause issues
}
```

**✅ Working Configuration**:

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
      "dest": "backend/server.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
      }
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

**Key Changes**:

- ✅ Use `builds` only (remove `functions`)
- ✅ Remove hardcoded `env` section
- ✅ Use environment variables from Vercel Dashboard
- ✅ Simplified routing configuration

### 3. Fix Axios Configuration

**Use Relative URLs** for same-origin requests:

```javascript
// frontend/src/api/axios.js
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || "http://localhost:7788/api";
  }

  // Production - use relative path so each deployment uses its own backend
  return "/api";
};
```

**Why This Works**:

- Each deployment gets its own backend function
- No circular dependencies between deployments
- Environment variables controlled via Vercel Dashboard

### 4. Deploy from Correct Directory

**❌ Wrong**: Deploy from `frontend/` directory

```bash
cd frontend
vercel --prod  # Only deploys frontend
```

**✅ Correct**: Deploy from project root

```bash
cd kaalis-store  # Project root
vercel --prod    # Deploys both frontend and backend
```

### 5. Promote Latest Deployment

**Check Current Production**:

```bash
vercel ls | head -5
```

**Promote Latest** via Vercel Dashboard:

1. Find latest deployment
2. Click "..." menu
3. Select "Promote to Production"
4. Confirm

---

## 🛠️ Debugging Commands Reference

### Essential Debugging Commands

```bash
# Check deployment list
vercel ls

# Check which deployment your domain points to
vercel inspect www.bruthol.com
vercel inspect bruthol.com

# Check domain aliases
vercel alias ls | grep yourdomain

# Check runtime logs
vercel logs https://yourdomain.com

# Check build logs
vercel inspect --logs deployment-id

# Check environment variables
vercel env ls

# Promote deployment to production
vercel promote deployment-id
```

### Frontend Debugging

Check browser logs for these key indicators:

```javascript
// ✅ Working deployment
Making request to: "/api/users/login"
baseURL: "/api"
POST /users/login: 200

// ❌ Failing deployment
Making request to: "/api/users/login"
baseURL: "/api"
Failed to load resource: 500
```

### Backend Debugging

Check for these common errors in logs:

```bash
# Missing environment variables
Error: PayDunya API keys are missing in environment variables
Node.js process exited with exit status: 1

# CORS issues
CORS Error - Origin blocked: https://yourdomain.com

# Database connection issues
MongoDB connection error: ...
```

---

## 🚨 Common Pitfalls & Solutions

### 1. Deployment Directory Issues

**Problem**: Deploying from wrong directory includes only frontend or backend.

**Solution**:

- Always deploy from project root
- Verify both `frontend/` and `backend/` directories exist
- Use `ls -la` to confirm project structure

### 2. Environment Variable Conflicts

**Problem**: Hardcoding environment variables in `vercel.json` causes all deployments to use same backend.

**Solution**:

- Remove `env` section from `vercel.json`
- Set variables in Vercel Dashboard
- Use different values for Preview vs Production

### 3. Configuration Conflicts

**Problem**: Having both `builds` and `functions` in `vercel.json`.

**Error**: `The functions property cannot be used in conjunction with the builds property`

**Solution**: Choose one approach and stick with it.

### 4. Outdated Current Deployment

**Problem**: Domain points to old deployment without recent fixes.

**Solution**:

- Always promote latest working deployment
- Check "Current" badge in Vercel Dashboard
- Use `vercel inspect` to verify domain assignments

### 5. Missing Critical Environment Variables

**Problem**: Backend crashes during startup due to missing required variables.

**Symptoms**: All API endpoints return 500 errors.

**Solution**:

- Check backend logs for missing variable errors
- Add all required environment variables
- Redeploy after adding variables

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Vercel Dashboard
- [ ] No conflicting properties in `vercel.json`
- [ ] Deploying from project root directory
- [ ] Backend starts successfully locally
- [ ] Frontend builds without errors
- [ ] Test on preview deployment first
- [ ] Check backend logs for startup errors

---

## 🎯 Success Indicators

When everything is working correctly:

### Frontend Logs

```javascript
Making request to: "/api/users/login"
baseURL: "/api"
POST /users/login: 200
Login response: {success: true, message: "Authentication successful"}
```

### Backend Logs

```bash
=== LOGIN ATTEMPT START ===
Database query completed
Password match result: true
Token generated successfully
=== LOGIN SUCCESS ===
```

### Vercel Dashboard

- Latest deployment marked as "Current"
- All domains showing "Configured Correctly"
- No 500 errors in runtime logs

---

## 📚 Additional Resources

- [Vercel Configuration Reference](https://vercel.com/docs/project-configuration)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Debugging Vercel Functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#node.js-runtime)

---

**Last Updated**: June 4, 2025  
**Issue Resolved**: Custom domain authentication now working perfectly ✅

---

---

---

❯ # Check logs for your production domain
vercel logs https://bruthol.com --follow
Vercel CLI 39.1.1
❗️ The "--follow" option was ignored because it is now deprecated. Please remove it.
WARN! This command now displays runtime logs. To access your build logs, run `vercel inspect --logs kaalis-store-8izwzrvg8-harzjuniors-projects.vercel.app`
Displaying runtime logs for deployment kaalis-store-8izwzrvg8-harzjuniors-projects.vercel.app (dpl_E2R8xcAXHyUA49WaDEmJTbP1XUWv) starting from Jun We 02:39:39.55

## 02:39:44.90 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

2025-06-04 01:39:39 info: PaystackService initialized

## 02:39:44.90 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

ADMIN_DEPLOYMENT_KEY not found in environment

## 02:39:45.00 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

=== CORS CHECK ===

## 02:39:45.00 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Allowed origins: [
'http://localhost:5173',
'http://localhost:3000',
'http://127.0.0.1:5173',
'http://127.0.0.1:3000',
'https://www.bruthol.com',
'https://bruthol.com',
'https://www.bruthol.com',
'https://bruthol.com',
'https://www.bruthol.com',
'https://bruthol.com',
'/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
'/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]_\\.vercel\\.app$/',
'/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]_-[a-zA-Z0-9-]\*\\.vercel\\.app$/'
]

## 02:39:45.01 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Origin allowed: true

## 02:39:45.03 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

=== LOGIN ATTEMPT START ===

## 02:39:45.22 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

} state: 'connected'Database',0.vjpyvzz.mongodb.net',

## 02:39:45.32 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Database query completed

## 02:39:45.32 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Found user: {
id: new ObjectId('66969f0aed76d3b4bf1f82e2'),
username: 'user1',
email: 'user1@example.com',
isBlocked: false
}

## 02:39:45.33 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Category indexes verified successfully

## 02:39:45.60 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Password match result: true

## 02:39:45.68 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

[ADMIN SETUP] SuperAdmin already exists, skipping creation

## 02:39:45.69 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Generating JWT token...

## 02:39:45.70 ℹ️ POST --- www.bruthol.com ƒ /api/users/login

Token generated successfully

## 02:39:46.16 ℹ️ GET --- www.bruthol.com ƒ /api/users/66969f0aed76d3b4bf1f82e2/profile

=== CORS CHECK ===

## 02:39:46.16 ℹ️ GET --- www.bruthol.com ƒ /api/users/66969f0aed76d3b4bf1f82e2/profile

Allowed origins: [
'http://localhost:5173',
'http://localhost:3000',
'http://127.0.0.1:5173',
'http://127.0.0.1:3000',
'https://www.bruthol.com',
'https://bruthol.com',
'https://www.bruthol.com',
'https://bruthol.com',
'https://www.bruthol.com',
'https://bruthol.com',
'/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
'/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]_\\.vercel\\.app$/',
'/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]_-[a-zA-Z0-9-]\*\\.vercel\\.app$/'
]

## 02:39:46.16 ℹ️ GET --- www.bruthol.com ƒ /api/users/66969f0aed76d3b4bf1f82e2/profile

Decoded token: {
userId: '66969f0aed76d3b4bf1f82e2',
iat: 1749001185,
exp: 1749087585
}

## 02:39:46.66 ℹ️ GET --- www.bruthol.com ƒ /api/products

=== CORS CHECK ===

## 02:39:47.49 ℹ️ GET --- www.bruthol.com ƒ /api/wishlists/user/66969f0aed76d3b4bf1f82e2

=== CORS CHECK ===

## 02:39:47.49 ℹ️ GET --- www.bruthol.com ƒ /api/wishlists/user/66969f0aed76d3b4bf1f82e2

Decoded token: {
userId: '66969f0aed76d3b4bf1f82e2',
iat: 1749001185,
exp: 1749087585
}

## 02:39:47.49 ℹ️ GET --- www.bruthol.com ƒ /api/wishlists/user/66969f0aed76d3b4bf1f82e2

Decoded token: {
userId: '66969f0aed76d3b4bf1f82e2',
iat: 1749001185,
exp: 1749087585
}

WARN! Command automatically interrupted after 5 minutes.

❯ # Create the file in your project
touch VERCEL_TROUBLESHOOTING.md

# Copy the content from the artifact above

  ~/Dow/kaalis-store   master ?1 ❯  system  02:48:24
