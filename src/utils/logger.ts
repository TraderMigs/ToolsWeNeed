/**
 * Simple logging utility for the application
 * This helps with debugging and monitoring in production
 */

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// Current log level - can be set based on environment
const currentLogLevel = process.env.NODE_ENV === 'production' 
  ? LogLevel.INFO 
  : LogLevel.DEBUG;

/**
 * Log a message at the specified level
 */
export const log = (level: LogLevel, message: string, data?: any) => {
  if (level >= currentLogLevel) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} 🔍 DEBUG:`, message, data || '');
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ℹ️ INFO:`, message, data || '');
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ⚠️ WARNING:`, message, data || '');
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} 🔴 ERROR:`, message, data || '');
        break;
    }
  }
};

export const debug = (message: string, data?: any) => log(LogLevel.DEBUG, message, data);
export const info = (message: string, data?: any) => log(LogLevel.INFO, message, data);
export const warn = (message: string, data?: any) => log(LogLevel.WARN, message, data);
export const error = (message: string, data?: any) => log(LogLevel.ERROR, message, data);

// Add monitoring for critical errors
export const monitorCriticalError = (error: Error, context: string) => {
  // Log the error
  log(LogLevel.ERROR, `CRITICAL ERROR in ${context}`, {
    message: error.message,
    stack: error.stack,
    context
  });
  
  // In a production environment, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to a monitoring service
    // sendToMonitoringService(error, context);
    
    // For now, just log to console with high visibility
    console.error('%c CRITICAL ERROR ', 'background: #ff0000; color: white; font-size: 16px;', context, error);
  }
};

// Add error tracking for unhandled exceptions
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    error('Unhandled exception', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    error('Unhandled promise rejection', {
      reason: event.reason,
      stack: event.reason?.stack
    });
  });
}