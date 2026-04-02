/**
 * Simple performance monitoring utility
 * This helps track performance metrics for critical operations
 */

import { info } from './logger';

// Store performance marks
const marks: Record<string, number> = {};

/**
 * Start timing an operation
 */
export const startTiming = (operationName: string): void => {
  marks[operationName] = performance.now();
};

/**
 * End timing an operation and log the result
 */
export const endTiming = (operationName: string): number | null => {
  if (!marks[operationName]) {
    return null;
  }
  
  const endTime = performance.now();
  const duration = endTime - marks[operationName];
  
  // Log the performance metric
  info(`Performance: ${operationName} took ${duration.toFixed(2)}ms`);
  
  // Clean up
  delete marks[operationName];
  
  return duration;
};

/**
 * Measure the execution time of a function
 */
export const measure = async <T>(
  operationName: string, 
  fn: () => Promise<T> | T
): Promise<T> => {
  startTiming(operationName);
  
  try {
    const result = await fn();
    endTiming(operationName);
    return result;
  } catch (e) {
    endTiming(operationName);
    throw e;
  }
};