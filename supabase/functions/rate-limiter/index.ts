/**
 * SECURITY FIX: Rate limiting for Supabase Edge Functions
 * Prevents DoS attacks and resource exhaustion
 */

import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string;
}

class RateLimiter {
  private requests = new Map<string, number[]>();

  isAllowed(config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    if (!this.requests.has(config.identifier)) {
      this.requests.set(config.identifier, []);
    }
    
    const userRequests = this.requests.get(config.identifier)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= config.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(config.identifier, validRequests);
    
    return true; // Request allowed
  }

  cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Clean up old entries
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > oneHourAgo);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Clean up old entries every 10 minutes
setInterval(() => rateLimiter.cleanup(), 10 * 60 * 1000);

export const checkRateLimit = (req: Request, maxRequests: number = 100, windowMs: number = 60000): boolean => {
  // Get client identifier (IP address or user ID)
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const identifier = `${clientIP}:${userAgent}`;
  
  return rateLimiter.isAllowed({
    maxRequests,
    windowMs,
    identifier
  });
};

export const createRateLimitResponse = (): Response => {
  return new Response(
    JSON.stringify({ 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: 60 
    }), 
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": "60"
      }
    }
  );
};