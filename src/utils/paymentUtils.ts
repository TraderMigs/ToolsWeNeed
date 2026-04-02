import { info, error, monitorCriticalError } from './logger';
import { env } from './env';
import { getProductByPriceId } from '../stripe-config';
import { storeExportData } from './storageUtils';

// SECURITY FIX: Remove all Stripe secret operations from client-side
// All Stripe secret operations now handled server-side via Supabase Edge Functions

/**
 * Utilities for handling payments and Stripe integration
 */

interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Stores export data in the database for later retrieval
 * Creates a Stripe checkout session using the Supabase Edge Function
 */
export const createCheckoutSession = async (params: CheckoutSessionParams): Promise<{ url: string }> => {
  const { priceId, successUrl, cancelUrl, metadata = {} } = params;
  
  // SECURITY: Validate required parameters
  if (!priceId || !successUrl || !cancelUrl) {
    throw new Error('Invalid payment parameters');
  }
  
  // Check if Stripe is configured
  if (!env.STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe is not configured. Please contact support.');
  }

  // Get the Supabase URL from environment variables
  const supabaseUrl = env.SUPABASE_URL;
  if (!supabaseUrl) {
    error('SUPABASE_URL is not defined');
    throw new Error('Service temporarily unavailable. Please try again later.');
  }
  
  // Get the Supabase anon key from environment variables
  const supabaseAnonKey = env.SUPABASE_ANON_KEY;
  if (!supabaseAnonKey) {
    error('SUPABASE_ANON_KEY is not defined');
    throw new Error('Service temporarily unavailable. Please try again later.');
  }
  
  // Construct the URL for the stripe-checkout function
  const functionUrl = `${supabaseUrl}/functions/v1/stripe-checkout`;
  
  try {
    info('Creating checkout session', { priceId, metadata });
    
    console.log('Checkout session parameters:', { priceId, successUrl, cancelUrl, metadata });
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
        metadata
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stripe checkout error:', errorData);
      throw new Error(errorData.error || 'Payment processing temporarily unavailable. Please try again later.');
    }
    
    const result = await response.json();
    console.log('Checkout session created successfully:', result);
    return result;
  } catch (err) {
    error('Error creating checkout session:', err);
    monitorCriticalError(err, 'createCheckoutSession');
    
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw new Error(err.message || 'Payment processing temporarily unavailable. Please try again later.');
  }
};

/**
 * Get checkout session details
 */
export const getCheckoutSession = async (sessionId: string): Promise<any> => {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseAnonKey = env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing');
  }
  
  const functionUrl = `${supabaseUrl}/functions/v1/get-checkout-session`;
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ sessionId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get checkout session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting checkout session:', error);
    throw error;
  }
};

/**
 * Verifies a completed checkout session
 */
export const verifyCheckoutSession = async (sessionId: string): Promise<boolean> => {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseAnonKey = env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing');
  }
  
  const functionUrl = `${supabaseUrl}/functions/v1/verify-payment`;
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        sessionId
      })
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.verified === true;
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    return false;
  }
};