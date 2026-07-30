/**
 * Environment configuration utility
 * Provides type-safe access to environment variables
 */

// SECURITY FIX: Enhanced environment variable validation
import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required').optional(),
  APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GA_TRACKING_ID: z.string().optional()
});

interface EnvVariables {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  APP_ENV: 'development' | 'production' | 'test';
  GA_TRACKING_ID?: string;
}

// Parse and validate environment variables
const parseEnv = (): EnvVariables => {
  const rawEnv = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
    APP_ENV: process.env.NODE_ENV,
    GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || undefined
  };

  try {
    return envSchema.parse(rawEnv) as EnvVariables;
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration. Please check your environment variables.', { cause: error });
  }
};

// Get environment variables with validation
export const env: EnvVariables = parseEnv();

// Validate required environment variables
export const validateEnv = (): boolean => {
  try {
    parseEnv();
    
    // Additional production checks
    if (env.APP_ENV === 'production') {
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

// Check if we're in production
export const isProduction = (): boolean => env.APP_ENV === 'production';

// Check if we're in development
export const isDevelopment = (): boolean => env.APP_ENV === 'development';

// Check if we're in test
export const isTest = (): boolean => env.APP_ENV === 'test';

// Debug function to log environment status
export const debugEnvironment = (): void => {
  if (isDevelopment()) {
    console.log('Environment Debug:', {
      SUPABASE_URL: env.SUPABASE_URL ? `${env.SUPABASE_URL.substring(0, 20)}...` : 'MISSING',
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY ? `${env.SUPABASE_ANON_KEY.substring(0, 20)}...` : 'MISSING',
      APP_ENV: env.APP_ENV,
      GA_TRACKING_ID: env.GA_TRACKING_ID || 'NOT_SET'
    });
  }
};
