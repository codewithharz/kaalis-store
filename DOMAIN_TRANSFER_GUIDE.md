# Domain Transfer Guide - Moving to New Vercel Account

## Overview

This guide will help you transfer your custom domain from your old Vercel account to your new Vercel account where the updated Kaalis Store is deployed.

**Current Status**:
- ✅ Old Vercel Account: Has your custom domain
- ✅ New Vercel Account: Has working deployment at `kaalis-store-frontend.vercel.app`
- 🎯 Goal: Move domain to new account

---

## Prerequisites

Before starting, ensure you have:
- [ ] Access to both Vercel accounts (old and new)
- [ ] Your custom domain name (e.g., `kaalis-store.com`)
- [ ] Access to your domain registrar (where you bought the domain)
- [ ] The new deployment is working at `kaalis-store-frontend.vercel.app`

---

## Step-by-Step Transfer Process

### Step 1: Remove Domain from Old Vercel Account

1. **Log into your OLD Vercel account**
2. Go to the old project dashboard
3. Navigate to **Settings → Domains**
4. Find your custom domain in the list
5. Click the **three dots (⋮)** next to the domain
6. Select **Remove Domain**
7. Confirm the removal

> ⚠️ **Important**: Your website will temporarily be unavailable on the custom domain during the transfer. It will still be accessible via the old Vercel URL.

---

### Step 2: Add Domain to New Vercel Account

1. **Log into your NEW Vercel account**
2. Go to your new project: `kaalis-store-frontend`
3. Navigate to **Settings → Domains**
4. Click **Add Domain**
5. Enter your custom domain (e.g., `kaalis-store.com`)
6. Click **Add**

Vercel will now show you DNS configuration instructions.

---

### Step 3: Configure DNS Records

Vercel will provide you with DNS records to configure. There are two methods:

#### Method A: Using Vercel Nameservers (Recommended - Easiest)

If Vercel offers to manage your DNS:

1. Vercel will provide nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. **Go to your domain registrar** (e.g., Namecheap, GoDaddy, Google Domains)
3. Find **DNS Settings** or **Nameservers**
4. Change nameservers to Vercel's nameservers
5. Save changes

**Propagation Time**: 24-48 hours (usually faster)

#### Method B: Using A and CNAME Records (Manual)

If you prefer to keep your current nameservers:

1. Vercel will provide records like:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

2. **Go to your domain registrar's DNS management**
3. **Delete old Vercel records** (if any exist)
4. **Add new A record**:
   - Type: `A`
   - Name: `@` (or leave blank for root domain)
   - Value: `76.76.21.21` (Vercel's IP)
   - TTL: `3600` (or automatic)

5. **Add new CNAME record** (for www subdomain):
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `3600` (or automatic)

6. **Save all changes**

**Propagation Time**: 1-24 hours

---

### Step 4: Verify Domain Configuration

1. In your **NEW Vercel account**, go to **Settings → Domains**
2. You should see your domain with a status indicator
3. Wait for the status to change from "Pending" to "Valid"
4. Vercel will automatically provision an SSL certificate

**Status Indicators**:
- 🟡 **Pending**: DNS propagation in progress
- 🟢 **Valid**: Domain is working correctly
- 🔴 **Invalid Configuration**: DNS records are incorrect

---

### Step 5: Test Your Domain

Once the domain shows as "Valid":

1. **Clear your browser cache** (or use incognito mode)
2. Visit your custom domain: `https://yourdomain.com`
3. Verify the site loads correctly
4. Test both:
   - `https://yourdomain.com` (root domain)
   - `https://www.yourdomain.com` (www subdomain)

**Checklist**:
- [ ] Homepage loads
- [ ] Products display
- [ ] Images and CSS load correctly
- [ ] API endpoints work
- [ ] SSL certificate is active (🔒 padlock in browser)

---

## Common Issues & Solutions

### Issue 1: Domain shows "Invalid Configuration"

**Solution**:
1. Double-check DNS records match exactly what Vercel provided
2. Ensure old Vercel DNS records are completely removed
3. Wait 1-2 hours for DNS propagation
4. Use [DNS Checker](https://dnschecker.org) to verify propagation

### Issue 2: Site shows old version

**Solution**:
1. Clear browser cache
2. Try incognito/private browsing mode
3. Wait for DNS propagation (up to 48 hours)
4. Check you removed domain from old Vercel account

### Issue 3: SSL Certificate Error

**Solution**:
1. Wait 10-15 minutes after domain becomes "Valid"
2. Vercel auto-provisions SSL certificates
3. If still showing error after 1 hour, remove and re-add domain

### Issue 4: www subdomain not working

**Solution**:
1. Ensure CNAME record for `www` is added
2. In Vercel, add both `yourdomain.com` and `www.yourdomain.com`
3. Set one as primary (usually non-www)

---

## DNS Propagation Checker

To check if your DNS changes have propagated globally:

1. Visit: https://dnschecker.org
2. Enter your domain name
3. Select record type: `A` or `CNAME`
4. Click **Search**
5. Green checkmarks = propagated, Red X = not yet propagated

---

## Recommended Domain Configuration

For best results, configure both root and www:

1. **Add both domains in Vercel**:
   - `yourdomain.com`
   - `www.yourdomain.com`

2. **Set redirect preference**:
   - Option A: Redirect `www` → non-www (recommended)
   - Option B: Redirect non-www → `www`

3. **Vercel will handle redirects automatically**

---

## Environment Variables Update

After domain transfer, update these environment variables in Vercel:

```bash
FRONTEND_URL=https://yourdomain.com
PAYDUNYA_REDIRECT_URL=https://yourdomain.com/api/paydunya/callback
```

**Steps**:
1. Go to **Settings → Environment Variables**
2. Edit `FRONTEND_URL`
3. Edit `PAYDUNYA_REDIRECT_URL`
4. **Redeploy** the project for changes to take effect

---

## Rollback Plan (If Needed)

If something goes wrong, you can rollback:

1. **Remove domain from NEW Vercel account**
2. **Re-add domain to OLD Vercel account**
3. **Update DNS records** back to old configuration
4. Wait for DNS propagation

---

## Timeline Expectations

| Step | Time Required |
|------|---------------|
| Remove domain from old account | Immediate |
| Add domain to new account | Immediate |
| DNS propagation (Nameservers) | 24-48 hours |
| DNS propagation (A/CNAME) | 1-24 hours |
| SSL certificate provisioning | 10-15 minutes |
| **Total estimated time** | **1-48 hours** |

---

## Post-Transfer Checklist

After successful transfer:

- [ ] Domain loads correctly on both www and non-www
- [ ] SSL certificate is active (🔒 padlock)
- [ ] All pages load correctly
- [ ] Images and assets load
- [ ] API endpoints respond
- [ ] Payment features work
- [ ] Update any external links pointing to old Vercel URL
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Test on multiple devices/browsers
- [ ] Monitor Vercel Function Logs for errors

---

## Support Resources

- **Vercel Domain Docs**: https://vercel.com/docs/concepts/projects/domains
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html
- **Vercel Support**: https://vercel.com/support

---

## Quick Reference: Common DNS Records

```
# Root domain (A Record)
Type: A
Name: @ (or blank)
Value: 76.76.21.21
TTL: 3600

# WWW subdomain (CNAME Record)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## Notes

- DNS propagation times vary by provider
- Some registrars cache DNS records longer than others
- Mobile networks may cache DNS longer than WiFi
- Use incognito mode to avoid browser caching issues
- Vercel automatically handles SSL certificates
- No downtime is required if you plan carefully

---

**Last Updated**: January 8, 2026  
**Status**: Ready for Domain Transfer  
**New Deployment**: https://kaalis-store-frontend.vercel.app
