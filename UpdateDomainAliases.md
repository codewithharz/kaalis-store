The `vercel domains ls` command shows your registered domains, but not which deployments they're pointing to. Let's check the specific domain assignments:

## **Check Domain Assignments**

```bash
# Check which deployment your bruthol.com domains are pointing to
vercel inspect www.bruthol.com
vercel inspect bruthol.com
```

Or alternatively:

```bash
# List all aliases/assignments
vercel alias ls
```

## **The Real Issue: Different Code Versions**

Looking at your logs again, I notice something important:

**Working deployment:**

- File: `index-yqBYKVqK.js` (newer)
- Using: `"https://bruthol.com/api"`

**Failing domain:**

- File: `index-NfbYXOEX.js` (older)
- Using: `"/api"`

This confirms that `bruthol.com` is serving an **older build** that doesn't have your axios fix.

## **Force Domain Update**

Let's force your domains to point to the latest working deployment:

```bash
# Get your latest deployment ID
vercel ls | head -5

# Then force assign (use the actual deployment URL from your latest)
vercel alias https://kaalis-store-q54c6qvnr-harzjuniors-projects.vercel.app bruthol.com --force
vercel alias https://kaalis-store-q54c6qvnr-harzjuniors-projects.vercel.app www.bruthol.com --force
```

## **Or Simpler: Just Deploy Again**

```bash
# Deploy again to force domain update
vercel --prod
```

## **Check Build Timestamps**

The key indicator is the JavaScript file names:

- `index-yqBYKVqK.js` = New build with fix ✅
- `index-NfbYXOEX.js` = Old build without fix ❌

Your domain needs to serve the newer build. Try the commands above to force the update!

---

---

---

**Found the problem!** 🎯

Your domains are pointing to a **129-day-old deployment** (`kaalis-store-ldjkj8v8l`) instead of your latest working deployment (`kaalis-store-q54c6qvnr`)!

## **The Issue**

From your `vercel alias ls` output:

```
kaalis-store-ldjkj8v8l-harzjuniors-projects.vercel.app  →  bruthol.com         (129d old!)
kaalis-store-ldjkj8v8l-harzjuniors-projects.vercel.app  →  www.bruthol.com     (129d old!)
```

Your domains are pointing to an ancient deployment from **129 days ago** that obviously doesn't have your axios fix!

## **Fix: Update Domain Aliases**

Update your domains to point to your latest working deployment:

```bash
# Remove old aliases
vercel alias rm bruthol.com
vercel alias rm www.bruthol.com

# Add new aliases pointing to your working deployment
vercel alias https://kaalis-store-q54c6qvnr-harzjuniors-projects.vercel.app bruthol.com
vercel alias https://kaalis-store-q54c6qvnr-harzjuniors-projects.vercel.app www.bruthol.com
```

## **Alternative: Force Production Deployment**

Or just deploy again with force to auto-assign to your domains:

```bash
# This should automatically update your domain aliases
vercel --prod --force
```

## **Verify the Fix**

After running either solution, check the aliases again:

```bash
vercel alias ls | grep bruthol
```

You should see your domains pointing to a much newer deployment.

## **Why This Happened**

When you first set up your domains months ago, they were assigned to that old deployment and never got updated to point to your newer deployments. That's why your latest deployments work but your custom domains don't!

**Run those alias commands now and your domains will work perfectly!**
