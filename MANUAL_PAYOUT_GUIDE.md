# Manual Payout Processing Guide

## Overview

The automated daily cron job has been **disabled** to reduce server costs and resource usage. Payouts are now processed **manually** via the admin dashboard.

**Cost Savings**: $15-30/month  
**Control**: Full admin oversight of payout processing

---

## How to Process Payouts

### Option 1: Via API (Postman/cURL)

**Endpoint**: `POST /api/admin/process-payouts`

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Example cURL**:
```bash
curl -X POST https://bruthol.com/api/admin/process-payouts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Response**:
```json
{
  "success": true,
  "message": "Payout processing completed successfully",
  "results": {
    "processed": 15,
    "failed": 2,
    "skipped": 1
  }
}
```

---

### Option 2: Via Admin Dashboard (Future)

A button will be added to the admin dashboard:
- Navigate to **Admin → Payouts**
- Click **"Process Pending Payouts"**
- View real-time processing results

---

## When to Run Payouts

### Recommended Schedule

| Frequency | Best For |
|-----------|----------|
| **Weekly** (Sundays) | Most startups |
| **Bi-weekly** | Low volume |
| **Daily** | High volume (100+ vendors) |
| **On-demand** | Special cases |

### Set a Reminder

Add a recurring calendar event:
- **Title**: "Process Vendor Payouts"
- **Frequency**: Weekly (Sunday 10 AM)
- **Action**: Call the API endpoint or use dashboard button

---

## What Gets Processed

The system will:
1. ✅ Find all payouts with `status: "pending"` and `scheduledDate <= today`
2. ✅ Group by vendor and payment method
3. ✅ Process in batches (50-100 at a time)
4. ✅ Call payment gateway APIs (Paystack/Opay/PayDunya/OrangeMoney)
5. ✅ Update payout statuses
6. ✅ Send vendor notifications
7. ✅ Handle retries for failed payouts

---

## Monitoring

### Check Pending Payouts

**Endpoint**: `GET /api/vendor/payouts?status=pending`

This shows how many payouts are waiting to be processed.

### View Processing Logs

Check Vercel Function Logs:
1. Go to Vercel Dashboard
2. Navigate to **Functions → Logs**
3. Filter by `/api/admin/process-payouts`

---

## Troubleshooting

### Issue: "No pending payouts found"

**Cause**: All payouts have been processed or none are scheduled yet.

**Solution**: Check if vendors have completed orders and if holding periods have passed.

### Issue: "Payment gateway rate limit"

**Cause**: Too many payouts processed at once.

**Solution**: 
- Process payouts more frequently (daily instead of weekly)
- Reduce batch size in `payoutConfig.js`

### Issue: "Vendor has no payment setup"

**Cause**: Vendor hasn't configured Paystack/bank details.

**Solution**: System will skip and notify vendor to complete setup.

---

## Future Enhancements

When you're ready to automate again:

1. **External Cron Service** (Free)
   - Use Cron-job.org
   - Schedule weekly API calls
   - No Vercel function costs

2. **Event-Driven** (Premium)
   - Trigger on order delivery
   - Instant payouts for VIP vendors

3. **Admin Dashboard Button**
   - One-click processing
   - Real-time progress tracking

---

## Security

- ✅ Only **Super Admins** can trigger payouts
- ✅ All processing is logged
- ✅ API endpoint requires authentication
- ✅ Rate limiting prevents abuse

---

## Quick Reference

```bash
# Process payouts manually
POST /api/admin/process-payouts

# Check pending payouts count
GET /api/vendor/payouts?status=pending

# View payout history
GET /api/vendor/payouts

# Check specific vendor payouts
GET /api/vendor/payouts?vendorId=VENDOR_ID
```

---

**Last Updated**: January 9, 2026  
**Status**: Active - Manual Processing Enabled  
**Cron Job**: Disabled
