import { env } from './env';

/**
 * Tool usage analytics utility
 * Tracks user interactions with tools for popularity tracking and UI optimization
 */

// Event types
export type EventType = 'view' | 'submit' | 'export' | 'feedback' | 'share';

// Analytics event interface
export interface AnalyticsEvent {
  tool_id: string;
  event_type: EventType;
  timestamp: number;
  session_id: string;
  user_id?: string;
  referrer?: string;
}

// Generate or retrieve session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('toolsweneed_session_id');
  
  if (!sessionId) {
    // Use crypto.randomUUID() for modern browsers
    if (window.crypto && 'randomUUID' in window.crypto) {
      sessionId = window.crypto.randomUUID();
    } else {
      // Fallback for older browsers
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    sessionStorage.setItem('toolsweneed_session_id', sessionId);
  }
  
  return sessionId;
};

// Get referrer from URL if present
export const getReferrer = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref') || undefined;
};

// Track an event
export const trackEvent = async (
  toolId: string, 
  eventType: EventType,
  userId?: string
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const referrer = getReferrer();
    
    const event: AnalyticsEvent = {
      tool_id: toolId,
      event_type: eventType,
      timestamp: Date.now(),
      session_id: sessionId,
      user_id: userId,
      referrer
    };
    
    // Get the Supabase URL from environment variables
    const supabaseUrl = env.SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('SUPABASE_URL is not defined');
      return;
    }
    
    // Get the Supabase anon key from environment variables
    const supabaseAnonKey = env.SUPABASE_ANON_KEY;
    if (!supabaseAnonKey) {
      console.error('SUPABASE_ANON_KEY is not defined');
      return;
    }
    
    // Send the event to the track-event function
    const functionUrl = `${supabaseUrl}/functions/v1/track-event`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track event: ${response.statusText}`);
    }
    
    // Also track in Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventType, {
        'event_category': 'tool_usage',
        'event_label': toolId,
        'tool_id': toolId
      });
    }
    
    // Store locally for immediate UI updates
    storeLocalEvent(event);
    
  } catch (error) {
    console.error('Error tracking event:', error);
    // Still store locally even if the API call fails
    storeLocalEvent({
      tool_id: toolId,
      event_type: eventType,
      timestamp: Date.now(),
      session_id: getSessionId()
    });
  }
};

// Store event locally for immediate UI updates
const storeLocalEvent = (event: AnalyticsEvent): void => {
  try {
    const key = `toolsweneed_events_${event.event_type}`;
    const events = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (!events[event.tool_id]) {
      events[event.tool_id] = 0;
    }
    
    events[event.tool_id]++;
    localStorage.setItem(key, JSON.stringify(events));
  } catch (error) {
    console.error('Error storing local event:', error);
  }
};

// Get local event counts for a specific event type
export const getLocalEventCounts = (eventType: EventType): Record<string, number> => {
  try {
    const key = `toolsweneed_events_${eventType}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch (error) {
    console.error('Error getting local event counts:', error);
    return {};
  }
};

// Get trending tools from the API
export const getTrendingTools = async (
  days: number = 7,
  limit: number = 10,
  eventType: EventType = 'submit'
): Promise<Array<{ tool_id: string; count: number }>> => {
  try {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseAnonKey = env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase configuration is missing, using fallback data');
      return [];
    }
    
    // Validate URL format
    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.warn('Invalid Supabase URL format, using fallback data');
      return [];
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/get-trending-tools?days=${days}&limit=${limit}&eventType=${eventType}`;
    
    const response = await fetch(functionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.warn(`Failed to get trending tools: ${response.statusText}, using fallback data`);
      return [];
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.warn('Error getting trending tools, using fallback data:', error.message || error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

// Check if a tool is trending (for badges)
export const isToolTrending = (
  toolId: string,
  trendingTools: Array<{ tool_id: string; count: number }>,
  threshold: number = 3
): boolean => {
  const tool = trendingTools.find(t => t.tool_id === toolId);
  return !!tool && tool.count >= threshold;
};