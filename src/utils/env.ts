/**
 * Environment configuration utility
 * Provides type-safe access to environment variables
 */

import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GA_TRACKING_ID: z.string().optional()
});

interface EnvVariables {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  APP_ENV: 'development' | 'production' | 'test';
  GA_TRACKING_ID?: string;
}

const parseEnv = () => {
  const rawEnv = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    APP_ENV: import.meta.env.VITE_APP_ENV,
    GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID
  };

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration. Please check your environment variables.');
  }
};

export const env: EnvVariables = parseEnv();

export const validateEnv = (): boolean => {
  try {
    parseEnv();
    if (env.APP_ENV === 'production') {
      if (!env.STRIPE_PUBLISHABLE_KEY) {
        console.warn('Stripe not configured - payment features will be disabled');
      }
      if (!env.GA_TRACKING_ID || env.GA_TRACKING_ID === 'G-XXXXXXXXXX') {
        console.warn('Google Analytics not configured - analytics will be disabled');
      }
    }
    return true;
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
};

export const isProduction = (): boolean => env.APP_ENV === 'production';
export const isDevelopment = (): boolean => env.APP_ENV === 'development';
export const isTest = (): boolean => env.APP_ENV === 'test';

export const debugEnvironment = (): void => {
  if (isDevelopment()) {
    console.log('Environment Debug:', {
      SUPABASE_URL: env.SUPABASE_URL ? `${env.SUPABASE_URL.substring(0, 20)}...` : 'MISSING',
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY ? `${env.SUPABASE_ANON_KEY.substring(0, 20)}...` : 'MISSING',
      STRIPE_PUBLISHABLE_KEY: env.STRIPE_PUBLISHABLE_KEY ? `${env.STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...` : 'MISSING',
      APP_ENV: env.APP_ENV,
      GA_TRACKING_ID: env.GA_TRACKING_ID || 'NOT_SET'
    });
  }
};
