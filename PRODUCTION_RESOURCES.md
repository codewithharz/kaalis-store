# Production Resource & Budget Guide - Kaalis Store

This guide details all the infrastructure, services, and third-party resources required to run the **Kaalis Store** (Bruthol Digital Marketplace) in production. It highlights active free tiers, recommended upgrades, pricing structures, and best practices to manage your budget as you scale.

---

## Summary of Production Costs

Here is a quick look at the hosting, database, email, 2FA, and payment services needed for launch, alongside their pricing tiers.

| Resource Category | Service Provider | Current Tier | Monthly Cost (Idle/Launch) | Upgrade Trigger | Projected Cost (Scaled) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hosting & API Deployment** | [Vercel](https://vercel.com) | Pro Team | **$20.00 / month** | Required for Team Ownership / Custom SSL / Cron | **$20.00 / month** (per developer) |
| **Custom Domain** | e.g. Namecheap / Cloudflare | Purchased | **~$1.00 - $2.00 / month** *(Paid annually: $10 - $20)* | Annual renewal | **~$1.50 / month** |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) | Shared (M0) | **$0.00** | Storage > 512MB or heavy query traffic | **~$57.00 / month** (M10 Dedicated) |
| **Product Media Storage** | [Cloudinary](https://cloudinary.com) | Free Tier | **$0.00** | Monthly credits exhausted (25 GB / 25,000 credits) | **$89.00 / month** (Plus Tier) or Pay-as-you-go |
| **Alternative Media Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) | Free Tier | **$0.00** | Storage > 10GB | **$0.015 / GB** per month *(No download fees)* |
| **Transactional Emails** | Gmail (App Password) / [Resend](https://resend.com) | Gmail / Free | **$0.00** | SMTP spam issues or volume > 100 emails/day | **$20.00 / month** (Resend Pro) |
| **SMS Verification & 2FA** | [Twilio](https://www.twilio.com) | Pay-as-you-go | **$0.00** (Only pays per SMS sent) | Active user registration & login flows | **~$0.05 - $0.10 / SMS** (varies by country) |
| **Payment Gateways** | [PayDunya](https://paydunya.com) / [Paystack](https://paystack.com) / [OPay](https://opaypayment.com) / AfriExchange | Live Accounts | **$0.00** | Deducted automatically per transaction | **1.5% to 3.5%** per transaction |
| **TOTAL** | — | — | **~$21.00 - $22.00 / month** | — | **~$187.50 / month** *(+ usage-based SMS/Egress fees)* |

---

## 1. Hosting & API Deployment: Vercel Pro
Vercel hosts the Vue.js frontend, runs the Express.js backend via Serverless Functions, manages routing, and automates builds.

*   **Production Tier Required**: **Vercel Pro ($20/month per user)**.
*   **Why it is needed in production**:
    *   **Custom Domains & SSL**: Secures custom domains (`bruthol.com` and `www.bruthol.com`) with automated SSL generation.
    *   **Execution Timeouts**: Increases serverless execution limits (up to 60s or more, compared to only 10s on the Hobby free tier). This is critical for complex tasks like batch payouts or multi-gateway queries.
    *   **Vercel Cron Jobs**: Powers the automated "alarm clock" (cron job) that pings the backend daily to trigger vendor payouts.
    *   **Bandwidth & Request Limits**: Provides 1TB of monthly bandwidth, preventing site downtime during traffic spikes.

---

## 2. Custom Domain
Your store needs a clean, branded address for customers and payment provider callbacks.

*   **Provider Options**: Namecheap, Cloudflare Registrar, GoDaddy, Hover.
*   **Cost**: **~$10.00 to $20.00 per year** (depends on extension, e.g., `.com`, `.store`, `.sn`).
*   **Production Role**:
    *   Acts as the central customer entry point.
    *   Provides secure redirects (`http` to `https` and `www` to root).
    *   Required by PayDunya and Paystack for verified redirect and webhook URLs (`/api/paydunya/callback`).

---

## 3. Database: MongoDB Atlas
MongoDB stores user profiles, product catalogs, categories, order logs, transaction records, and admin audit details.

*   **Launch Tier (M0 Shared)**: **$0.00 / month**
    *   *Includes*: 512MB storage, shared RAM/CPU.
*   **Production Upgrade Tier (M10 Dedicated)**: **~$57.00 / month**
    *   *Upgrade Trigger*: When your product catalog exceeds 1,000+ items, transaction history fills the database, or you require advanced backup restore points.
    *   *Benefits*: Dedicated RAM/CPU, automated daily backups, IP whitelisting for backend security, and no storage limits (pay-per-GB).

---

## 4. Media & Product Image Storage: Cloudinary
The application uploads product images and user profile/background assets directly to **Cloudinary** via `/api/upload/image` and `/api/upload/images` backend routes. It uses `multer` and `multer-storage-cloudinary` to manage files.

*   **Current Setup**: **Cloudinary Free Tier ($0.00 / month)**.
    *   *Includes*: 25 Monthly Promotional Credits (roughly translates to 25GB storage, 25,000 image transformations, or 25,000 monthly views).
*   **Why it is used in production**:
    *   **Automated Optimization**: Cloudinary automatically compresses images and delivers them in modern formats (like WebP/AVIF) based on browser support.
    *   **Global CDN**: Delivers media files instantly from global edge nodes to speed up your frontend.
*   **Upgrade Trigger**: When your active catalog size or visitor count exceeds the monthly free credits.
*   **Production Alternatives / Future Migrations**:
    *   **Cloudflare R2**: If Cloudinary's monthly limits become too restrictive or expensive to upgrade, the codebase can be migrated to Cloudflare R2 (which offers 10GB free storage, unlimited bandwidth/no egress download fees, and only $0.015/GB/mo above the free tier).
    *   *Note on Firebase*: While some legacy placeholder products in `BrandCarousel.vue` point to Firebase URLs and `backend/utils/firebaseConfig.js` remains in the codebase, the active upload system runs entirely on Cloudinary.

---

## 5. Transactional Email Service (Nodemailer Transports)
Emails are automatically sent for new user registration verification, password resets, order confirmations, and administrative updates.

*   **Current Setup**: Personal Gmail via App Password (**$0.00**).
*   **Why this must change in production**:
    *   **Rate Limits**: Gmail limits personal accounts to 500 emails/day.
    *   **Deliverability (Spam Filter)**: Personal Gmail relays lack proper SPF, DKIM, and DMARC configurations. Your order receipts and password resets will frequently land in the customers' **Spam** folder.
*   **Production Alternatives**:
    *   **Resend (Recommended)**: 
        *   *Free Tier*: 3,000 emails/month (100/day limit) — perfect for launch.
        *   *Pro Tier ($20/month)*: 50,000 emails/month, custom domain verification (`noreply@bruthol.com`), and higher sending limits.
    *   **Google Workspace**: 
        *   *Cost*: **~$6.00 / user / month**.
        *   Provides a professional mailbox (`contact@bruthol.com`) that can be integrated securely into Nodemailer.

---

## 6. SMS Verification & 2FA: Twilio
Twilio is used in `twoFactorController.js` to send security verification codes to users' phone numbers during registration, login, or sensitive operations.

*   **Current Setup**: **Pay-as-you-go ($0.00 / month idle)**.
*   **How Twilio Bills**:
    *   Twilio does not charge a flat monthly fee for basic API usage.
    *   You are charged a tiny fee for each SMS message dispatched.
    *   *Costs*: Approximately **$0.05 to $0.10 per SMS** depending on the destination country (e.g. Senegal, Nigeria).
*   **Production Setup**:
    *   Requires adding `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_SERVICE_SID` to your production environment variables.

---

## 7. Payment Gateways (Transaction-based Fees)
Payment processors do not charge monthly subscription fees. Instead, they deduct a percentage of each transaction.

*   **PayDunya (Senegal & West Africa Mobile Money)**:
    *   *Integration Status*: Code configured for Wave, Orange Money, Free Money, and Card payments.
    *   *Cost*: **0% Monthly Fee**. Standard transaction fees range from **2.0% to 3.5%** depending on the specific mobile money channel.
*   **Paystack (Nigeria & West Africa Card/Bank Transfer)**:
    *   *Integration Status*: Supported in environment variables.
    *   *Cost*: **0% Monthly Fee**. Standard fees are **1.5%** for local cards and **3.9%** for international cards (plus nominal flat fees).
*   **OPay**:
    *   *Integration Status*: Supported in OPay merchant configurations.
    *   *Cost*: **0% Monthly Fee**. Competitive transaction fees apply.
*   **AfriExchange (XOF Payout Gateway)**:
    *   *Integration Status*: Configured in the currency and payout services.
    *   *Cost*: **0% Monthly Fee**. Transaction/conversion commission fees apply when moving funds.

---

## Cost Optimization Checklist for Launch

To keep your operations at the minimum possible cost (**$20.00 to $22.00 / month** total), implement these best practices:

1.  **Image Compression**: Compress all images before uploading them to product listings. Keep files under 300KB instead of raw 5MB+ uploads. This preserves free-tier storage limits.
2.  **Log Cleanups**: Regularly clean up Express.js visitor logs and MongoDB audit logs. Keep logs for 30 days and archive or delete them to avoid bloating the database.
3.  **Use Cloudflare CDN**: Route your custom domain through Cloudflare's free plan. It caches static frontend code and assets, reducing the bandwidth load on Vercel.
4.  **Transition to Cloudflare R2**: Migrate image uploads from Cloudinary to Cloudflare R2 if your catalog grows and you require more storage without egress fee concerns.
