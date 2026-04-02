import { getUsageStats, getAnonymizedInsights } from './exportAnalytics';
import { env } from './env';

// Session storage utilities for data persistence
export const saveToSession = (key: string, data: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to session storage:', error);
  }
};

export const loadFromSession = (key: string) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from session storage:', error);
    return null;
  }
};

export const removeFromSession = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from session storage:', error);
  }
};

export const clearSession = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Failed to clear session storage:', error);
  }
};

// Auto-save utilities for tool data persistence
export const saveToolData = (toolName: string, data: any) => {
  try {
    const key = `twn_${toolName}_data`;
    const saveData = {
      data,
      timestamp: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(key, JSON.stringify(saveData));
  } catch (error) {
    console.error(`Failed to save ${toolName} data:`, error);
  }
};

export const loadToolData = (toolName: string) => {
  try {
    const key = `twn_${toolName}_data`;
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    
    // Auto-clear data after 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    if (parsed.timestamp < sevenDaysAgo) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Validate data structure
    if (!parsed.data || typeof parsed.data !== 'object') {
      console.warn('Invalid tool data structure, clearing:', toolName);
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error(`Failed to load ${toolName} data:`, error);
    // Clear corrupted data
    try {
      const key = `twn_${toolName}_data`;
      localStorage.removeItem(key);
    } catch (clearError) {
      console.error(`Failed to clear corrupted ${toolName} data:`, clearError);
    }
    return null;
  }
};

export const clearToolData = (toolName: string) => {
  try {
    const key = `twn_${toolName}_data`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear ${toolName} data:`, error);
  }
};

export const hasToolData = (toolName: string): boolean => {
  try {
    const key = `twn_${toolName}_data`;
    const saved = localStorage.getItem(key);
    if (!saved) return false;
    
    const parsed = JSON.parse(saved);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return parsed.timestamp >= sevenDaysAgo;
  } catch (error) {
    return false;
  }
};

// Analytics integration for tool data
export const saveToolDataWithAnalytics = (toolName: string, data: any) => {
  try {
    const key = `twn_${toolName}_data`;
    const saveData = {
      data,
      timestamp: Date.now(),
      version: '1.0',
      analytics: getAnonymizedInsights() // Include usage insights
    };
    localStorage.setItem(key, JSON.stringify(saveData));
  } catch (error) {
    console.error(`Failed to save ${toolName} data with analytics:`, error);
  }
};

// Get usage insights for tool optimization
export const getToolUsageInsights = () => {
  return getUsageStats();
};

// Export data storage for payment processing
export const storeExportDataLocal = async (sessionId: string, data: any): Promise<boolean> => {
  try {
    const key = `export_data_${sessionId}`;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to store export data:', error);
    return false;
  }
};

/**
 * Stores export data in Supabase database for later retrieval after payment
 */
export const storeExportData = async (sessionId: string, data: any, exportKey?: string): Promise<boolean> => {
  try {
    // 🔥 NUCLEAR FIX: Store with both sessionId and exportKey
    const storageKey = exportKey || sessionId;
    localStorage.setItem(`export_data_${storageKey}`, JSON.stringify(data));
    
    // Get environment variables
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseAnonKey = env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase configuration missing, using localStorage only');
      return true; // localStorage worked
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/store-export-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        sessionId,
        data,
        exportKey
      })
    });
    
    if (!response.ok) {
      console.warn('Failed to store export data on server, localStorage backup available');
      return true; // localStorage still worked
    }
    
    console.log('Export data successfully stored on server');
    return true;
  } catch (err) {
    console.error('Error storing export data:', err);
    return true; // localStorage fallback should still work
  }
};