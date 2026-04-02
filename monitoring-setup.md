# Monitoring Setup Guide

This guide outlines how to set up monitoring for your application to ensure you can quickly identify and address any issues.

## Error Monitoring

### Console Logging

The application includes a custom logging utility (`src/utils/logger.ts`) that provides structured logging with different log levels. In production, only INFO, WARN, and ERROR logs are displayed.

### Supabase Edge Function Logs

To view logs from your Supabase Edge Functions:

```bash
npx supabase functions logs stripe-webhook
npx supabase functions logs verify-payment
npx supabase functions logs generate-secure-export
npx supabase functions logs store-export-data
```

### Netlify Function Logs

If you're using Netlify Functions, you can view logs in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Functions
3. Click on a function to view its logs

## Performance Monitoring

The application includes a simple performance monitoring utility (`src/utils/performance.ts`) that measures the execution time of critical operations.

To view performance metrics:

1. Open your browser's developer console
2. Look for logs with the prefix "Performance:"

For more comprehensive performance monitoring, consider integrating with a service like New Relic, Datadog, or Sentry.

## Stripe Webhook Monitoring

To monitor Stripe webhook events:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > Webhooks
3. Click on your webhook endpoint
4. View recent webhook events and their status

## Database Monitoring

To monitor your Supabase database:

1. Go to your Supabase project dashboard
2. Navigate to Database > Monitoring
3. View metrics for database performance and usage

## Custom Analytics

The application tracks various events using the custom analytics utility (`src/utils/exportAnalytics.ts`). This data is stored in localStorage and can be exported for analysis.

To view this data:

1. Open your browser's developer console
2. Run `localStorage.getItem('toolsweneed_exports')` to view export events
3. Run `localStorage.getItem('toolsweneed_session')` to view session data

## Setting Up Alerts

### Stripe Alerts

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Settings > Alerts
3. Set up alerts for failed payments, disputes, and other important events

### Supabase Alerts

1. Go to your Supabase project dashboard
2. Navigate to Database > Monitoring
3. Set up alerts for database performance issues

### Custom Alerts

For custom alerts based on application metrics, consider integrating with a service like PagerDuty or Opsgenie.