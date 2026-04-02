# 🚀 Pre-Launch Manual Setup Checklist

## ⚠️ CRITICAL - Complete Before Publishing

### 1. **Environment Variables Setup**
You must manually set these in your hosting provider (Netlify/Vercel):

```bash
# Required for basic functionality
VITE_SUPABASE_URL=your-actual-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key

# Required for payments to work
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-actual-stripe-publishable-key

# Required for analytics
VITE_GA_TRACKING_ID=G-YOUR-ACTUAL-TRACKING-ID

# Set to production
VITE_APP_ENV=production
```

**❌ DO NOT PUBLISH without setting these - the app will not function properly**

### 2. **Supabase Database Migration**
Run this command in your terminal:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the new security migration
npx supabase db push
```

This creates the `security_events` table needed for security logging.

### 3. **Supabase Edge Functions Environment Variables**
Set these in your Supabase Dashboard > Project Settings > Edge Functions:

```bash
STRIPE_SECRET_KEY=sk_live_your-actual-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-actual-webhook-secret
```

### 4. **Deploy Edge Functions**
Run this command:

```bash
# Deploy all Edge Functions to Supabase
npm run deploy:functions
```

### 5. **Stripe Configuration**
In your Stripe Dashboard:

1. **Create Products & Prices:**
   - **$2 Tools We Need** (Product ID: prod_Sg1vqihidz4gme, Price ID: price_1RkfrqRrIlnVe6VQ9JIqfPm4)
   - **$7 Tools We Need - Resume** (Product ID: prod_Sg1wxYyiyWknGV, Price ID: price_1RkfscRrIlnVe6VQvu5kFiFo)

2. **Set up Webhook:**
   - URL: `https://[your-project-ref].supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Copy the webhook signing secret

### 6. **Google Analytics Setup**
1. Create a Google Analytics 4 property
2. Copy the Measurement ID (starts with G-)
3. Update the environment variable

### 7. **Content Security Policy Test**
After deployment, test that your site works with the new CSP headers by:
1. Opening browser dev tools
2. Checking for CSP violations in console
3. Ensuring all features work (especially Stripe checkout)

### 8. **Admin Account Setup**
1. Create your admin user in Supabase Auth
2. Add your user ID to the `admin_users` table:
```sql
INSERT INTO admin_users (user_id, role) 
VALUES ('your-user-id-from-auth', 'admin');
```

### 9. **Payment Flow Test**
Before going live, test the complete payment flow:
1. Try to export a file
2. Complete Stripe checkout with test card
3. Verify download works on success page
4. Check webhook receives events in Stripe Dashboard

### 10. **Security Verification**
Run these checks:
1. Verify no hardcoded secrets in built files
2. Test rate limiting on Edge Functions
3. Confirm admin panel requires proper authentication
4. Check that error messages don't expose sensitive info

---

## 🔍 How to Check if Setup is Complete

### Environment Variables Check:
```bash
# In your hosting provider's environment settings, verify:
echo $VITE_SUPABASE_URL          # Should be your Supabase URL
echo $VITE_STRIPE_PUBLISHABLE_KEY # Should start with pk_live_ or pk_test_
echo $VITE_GA_TRACKING_ID        # Should start with G-
```

### Supabase Check:
```bash
# Verify Edge Functions are deployed:
npx supabase functions list

# Should show:
# - stripe-checkout
# - stripe-webhook  
# - verify-payment
# - get-checkout-session
# - store-export-data
# - generate-secure-export
# - track-event
# - get-trending-tools
```

### Database Check:
```sql
-- Verify tables exist:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should include:
-- - admin_users
-- - export_data  
-- - export_downloads
-- - tool_requests
-- - tool_feedback
-- - tool_analytics
-- - security_events (new)
```

---

## ⚡ Quick Setup Commands

If you have Supabase CLI configured:

```bash
# 1. Push database changes
npx supabase db push

# 2. Deploy all functions
npm run deploy:functions

# 3. Set Stripe secrets (replace with your actual keys)
npx supabase secrets set STRIPE_SECRET_KEY="sk_live_..."
npx supabase secrets set STRIPE_WEBHOOK_SECRET="whsec_..."

# 4. Verify deployment
npx supabase functions list
```

---

## 🚫 DO NOT PUBLISH UNTIL:

- [ ] All environment variables are set with REAL values (Stripe products are pre-configured)
- [ ] Supabase database migration is complete
- [ ] All Edge Functions are deployed and responding
- [ ] Stripe products/prices are created and IDs are updated
- [ ] Stripe webhook is configured and receiving events
- [ ] Payment flow test completes successfully
- [ ] Admin authentication is working
- [ ] No hardcoded secrets remain in the codebase

---

## 🆘 If Something Goes Wrong

### Rollback Plan:
1. Revert to previous deployment
2. Check Supabase function logs: `npx supabase functions logs [function-name]`
3. Check Stripe webhook delivery status in Dashboard
4. Verify environment variables are correctly set

### Support Resources:
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Netlify Docs: https://docs.netlify.com

**Remember: It's better to delay launch and get security right than to rush and expose vulnerabilities.**