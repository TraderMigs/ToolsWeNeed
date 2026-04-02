# Deployment Plan for ToolsWeNeed with Stripe Integration

This document outlines the steps needed to deploy the ToolsWeNeed application with Stripe payment integration.

## Prerequisites

1. A Stripe account with API keys
2. A Supabase project
3. Domain name (optional but recommended)

## Step 1: Set Up Environment Variables

In your Supabase project, set the following environment variables for your Edge Functions:

```bash
# In Supabase Dashboard > Project Settings > API > Edge Functions
```

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret

In your frontend hosting provider (e.g., Netlify), set these environment variables:

```bash
# In your hosting provider's dashboard > Environment variables
```

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `VITE_APP_ENV`: Set to "production"
- `VITE_GA_TRACKING_ID`: Your Google Analytics tracking ID

## Step 2: Deploy Supabase Edge Functions

Deploy the following Edge Functions to your Supabase project:

1. `stripe-checkout`: Handles creating Stripe checkout sessions
2. `stripe-webhook`: Processes webhook events from Stripe
3. `verify-payment`: Verifies payment status for successful checkouts
4. `get-checkout-session`: Retrieves checkout session details
5. `store-export-data`: Stores export data for post-payment download
6. `generate-secure-export`: Generates clean exports after payment verification

```bash
# Navigate to each function directory and deploy
cd supabase/functions/stripe-checkout
supabase functions deploy stripe-checkout --no-verify-jwt

cd ../stripe-webhook
supabase functions deploy stripe-webhook --no-verify-jwt

cd ../verify-payment
supabase functions deploy verify-payment --no-verify-jwt
```

## Step 3: Configure Stripe Webhooks

1. Go to the Stripe Dashboard > Developers > Webhooks
2. Add a new webhook endpoint: `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/functions/v1/stripe-webhook`
3. Select the following events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the signing secret and add it as the `STRIPE_WEBHOOK_SECRET` environment variable in Supabase

## Step 4: Build and Deploy the Frontend

```bash
# Build the production version
npm run build

# Deploy to your hosting provider (e.g., Netlify, Vercel, etc.)
# Make sure to set the following environment variables in your hosting provider:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

## Step 5: Test the Payment Flow

1. Navigate to your deployed application
2. Try to export a document using the "Pay & Download" option
3. Complete the Stripe checkout process
4. Verify that you're redirected to the success page and the download starts

## Step 6: Monitor and Troubleshoot

1. Check Supabase logs for any errors in the Edge Functions
2. Check Stripe Dashboard > Developers > Webhooks for any failed webhook deliveries
3. Monitor Stripe Dashboard > Payments for successful transactions

## Security Considerations

1. Ensure your Stripe secret key is never exposed in client-side code
2. Always verify payments server-side before providing access to paid content
3. Use HTTPS for all communications
4. Implement rate limiting to prevent abuse

## Maintenance

1. Regularly update the Stripe SDK to the latest version
2. Monitor for any deprecated API endpoints or features
3. Keep your webhook endpoint up to date with any new event types you need to handle