# Error Handling Guide

This guide outlines common errors that may occur in the application and how to address them.

## Payment Processing Errors

### Stripe Checkout Session Creation Fails

**Symptoms:**
- User clicks "Pay & Download" but is not redirected to Stripe
- Error message in console: "Failed to create checkout session"

**Possible Causes:**
- Stripe API key is invalid or missing
- Network error when communicating with Stripe API
- Required parameters are missing or invalid

**Solutions:**
1. Check that `VITE_STRIPE_PUBLISHABLE_KEY` is correctly set in your environment variables
2. Verify that the Stripe price ID is correct
3. Check the Stripe Dashboard for any account issues
4. Check the browser console and network tab for specific error messages

### Webhook Processing Fails

**Symptoms:**
- Payment succeeds but download doesn't start
- Error in Supabase Edge Function logs

**Possible Causes:**
- Webhook secret is invalid or missing
- Webhook URL is incorrect
- Edge Function has an error

**Solutions:**
1. Check that `STRIPE_WEBHOOK_SECRET` is correctly set in your Supabase environment variables
2. Verify that the webhook URL in the Stripe Dashboard is correct
3. Check the Supabase Edge Function logs for specific error messages

## Export Errors

### Export Generation Fails

**Symptoms:**
- User clicks export but no file is downloaded
- Error message in console

**Possible Causes:**
- Data format is incorrect
- Browser storage is full
- Third-party library error

**Solutions:**
1. Check the browser console for specific error messages
2. Verify that the data being exported is in the correct format
3. Clear browser storage if it's full
4. Update third-party libraries if they're outdated

### Secure Export Download Fails

**Symptoms:**
- Payment succeeds but download doesn't start
- Error message on success page

**Possible Causes:**
- Export data not found in database
- Edge Function error
- Network error

**Solutions:**
1. Check that `store-export-data` function is working correctly
2. Verify that the export data is being stored in the database
3. Check the Supabase Edge Function logs for specific error messages

## Database Errors

### Data Not Being Stored

**Symptoms:**
- Export data not found after payment
- Error in Supabase Edge Function logs

**Possible Causes:**
- Database permissions issue
- SQL error
- Network error

**Solutions:**
1. Check the Supabase database permissions
2. Verify that the SQL queries are correct
3. Check the Supabase Edge Function logs for specific error messages

## Environment Configuration Errors

### Missing Environment Variables

**Symptoms:**
- Application fails to start
- Error message in console: "Missing required environment variables"

**Possible Causes:**
- Environment variables not set
- Environment variables set incorrectly

**Solutions:**
1. Check that all required environment variables are set
2. Verify that the environment variables are correctly formatted
3. Restart the application after setting environment variables

## Network Errors

### CORS Issues

**Symptoms:**
- API calls fail with CORS errors
- Error message in console: "Access to fetch at '...' has been blocked by CORS policy"

**Possible Causes:**
- CORS headers not set correctly
- API endpoint not configured for CORS

**Solutions:**
1. Check that the CORS headers are correctly set in the Edge Functions
2. Verify that the API endpoint is configured to allow requests from your domain