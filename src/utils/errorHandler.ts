/**
 * SECURITY FIX: Secure error handling
 * Prevents information disclosure through error messages
 */

import { env } from './env';

export interface SafeError {
  message: string;
  code?: string;
  timestamp: string;
}

// Generic error messages for production
const GENERIC_ERRORS = {
  NETWORK: 'Service temporarily unavailable. Please try again later.',
  VALIDATION: 'Invalid input provided. Please check your data and try again.',
  AUTH: 'Authentication failed. Please check your credentials.',
  PERMISSION: 'You do not have permission to perform this action.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  SERVER: 'An unexpected error occurred. Please try again later.',
  PAYMENT: 'Payment processing failed. Please try again or contact support.',
  NOT_FOUND: 'The requested resource was not found.'
};

export class SecureError extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly statusCode: number;

  constructor(
    message: string,
    code: string = 'GENERIC',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'SecureError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export const handleError = (error: any): SafeError => {
  const timestamp = new Date().toISOString();
  
  // Log full error details for debugging (server-side only)
  if (env.APP_ENV === 'development') {
    console.error('Full error details:', error);
  } else {
    // In production, log only essential info without sensitive data
    console.error('Error occurred:', {
      message: error.message,
      code: error.code,
      timestamp
    });
  }
  
  // Return safe error message to client
  if (error instanceof SecureError) {
    return {
      message: error.message,
      code: error.code,
      timestamp
    };
  }
  
  // Map common error types to safe messages
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return {
      message: GENERIC_ERRORS.NETWORK,
      code: 'NETWORK_ERROR',
      timestamp
    };
  }
  
  if (error.message?.includes('validation') || error.message?.includes('invalid')) {
    return {
      message: GENERIC_ERRORS.VALIDATION,
      code: 'VALIDATION_ERROR',
      timestamp
    };
  }
  
  if (error.message?.includes('auth') || error.message?.includes('unauthorized')) {
    return {
      message: GENERIC_ERRORS.AUTH,
      code: 'AUTH_ERROR',
      timestamp
    };
  }
  
  if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
    return {
      message: GENERIC_ERRORS.RATE_LIMIT,
      code: 'RATE_LIMIT_ERROR',
      timestamp
    };
  }
  
  if (error.message?.includes('payment') || error.message?.includes('stripe')) {
    return {
      message: GENERIC_ERRORS.PAYMENT,
      code: 'PAYMENT_ERROR',
      timestamp
    };
  }
  
  // Default safe error message
  return {
    message: GENERIC_ERRORS.SERVER,
    code: 'SERVER_ERROR',
    timestamp
  };
};

export const logSecurityEvent = (event: string, details: any = {}) => {
  const logData = {
    event,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    // Only log non-sensitive details
    details: sanitizeLogData(details)
  };
  
  console.warn('Security Event:', logData);
  
  // In production, send to security monitoring service
  if (env.APP_ENV === 'production') {
    // TODO: Send to security monitoring service
  }
};

const sanitizeLogData = (data: any): any => {
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'session'];
  
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  });
  
  return sanitized;
};