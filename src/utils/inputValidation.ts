/**
 * SECURITY FIX: Server-side input validation and sanitization
 * Prevents XSS, injection attacks, and data corruption
 */

import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format').max(254);
export const nameSchema = z.string().min(1).max(100).regex(/^[a-zA-Z\s\-'\.]+$/, 'Invalid name format');
export const amountSchema = z.number().min(0).max(1000000);
export const percentageSchema = z.number().min(0).max(100);
export const textSchema = z.string().max(1000);
export const urlSchema = z.string().url('Invalid URL format');

// Sanitization functions
export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

export const sanitizeText = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

export const sanitizeNumber = (input: any): number => {
  const num = parseFloat(input);
  return isNaN(num) ? 0 : Math.max(0, Math.min(1000000, num));
};

export const sanitizeEmail = (input: string): string => {
  return input.toLowerCase().trim().substring(0, 254);
};

// Validation functions for tool inputs
export const validateToolInput = (toolId: string, data: any) => {
  const sanitized = { ...data };
  
  // Common sanitization for all tools
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeText(sanitized[key]);
    } else if (typeof sanitized[key] === 'number') {
      sanitized[key] = sanitizeNumber(sanitized[key]);
    }
  });
  
  // Tool-specific validation
  switch (toolId) {
    case 'budget-card-conveyor':
      return validateBudgetData(sanitized);
    case 'self-employed-tax-estimator':
      return validateTaxData(sanitized);
    case 'debt-snowball-tracker':
      return validateDebtData(sanitized);
    default:
      return sanitized;
  }
};

const validateBudgetData = (data: any) => {
  const schema = z.object({
    income: amountSchema.optional(),
    expenses: z.array(z.object({
      category: textSchema,
      amount: amountSchema,
      description: textSchema
    })).optional()
  });
  
  return schema.parse(data);
};

const validateTaxData = (data: any) => {
  const schema = z.object({
    income: amountSchema,
    deductions: amountSchema.optional(),
    filingStatus: z.enum(['single', 'married', 'head']),
    taxRate: percentageSchema.optional()
  });
  
  return schema.parse(data);
};

const validateDebtData = (data: any) => {
  const schema = z.object({
    debts: z.array(z.object({
      name: textSchema,
      balance: amountSchema,
      minPayment: amountSchema,
      interestRate: percentageSchema
    })).optional(),
    extraPayment: amountSchema.optional()
  });
  
  return schema.parse(data);
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    
    return true; // Request allowed
  };
};