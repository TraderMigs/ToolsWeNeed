# Stripe Webhook Configuration Guide

This guide will help you set up the Stripe webhook for your ToolsWeNeed application.

## Prerequisites

1. A Stripe account with API keys
2. Your Supabase project with deployed Edge Functions

## Step 1: Deploy the Stripe Webhook Function

Make sure you've deployed the `stripe-webhook` Edge Function to your Supabase project:

```bash
npm run deploy:functions
```

## Step 2: Create a Webhook in the Stripe Dashboard

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** > **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL:
   ```
   https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/functions/v1/stripe-webhook
   ```
   Replace `[YOUR_SUPABASE_PROJECT_REF]` with your Supabase project reference.
5. Select the following events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
6. Click **Add endpoint**

## Step 3: Get the Webhook Signing Secret

1. After creating the webhook, you'll see a **Signing secret** section
2. Click **Reveal** to view the signing secret
3. Copy this secret - you'll need it in the next step

## Step 4: Set the Webhook Secret in Supabase

1. Run the environment setup script:
   ```bash
   npm run setup:env
   ```
2. When prompted, enter your Stripe Secret Key and the Webhook Signing Secret you just copied

## Step 5: Test the Webhook

1. In the Stripe Dashboard, go to your webhook details page
2. Click **Send test webhook**
3. Select `checkout.session.completed` as the event type
4. Click **Send test webhook**
5. Check the Supabase logs to verify that the webhook was received and processed correctly:
   ```bash
   npx supabase functions logs stripe-webhook
   ```

## Troubleshooting

If you encounter any issues:

1. Check the Supabase function logs for errors
2. Verify that the webhook URL is correct
3. Ensure the signing secret is correctly set in your Supabase environment variables
4. Check that the `stripe-webhook` function is properly deployed

## Next Steps

Once your webhook is configured and tested, you can proceed with the rest of the deployment process.