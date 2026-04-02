import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Performance optimization hook for heavy calculations and data processing
 */
export const usePerformanceOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Debounce heavy calculations
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Memoized calculation wrapper
  const memoizeCalculation = useCallback((calculation: Function, dependencies: any[]) => {
    return useMemo(() => calculation(), dependencies);
  }, []);

  // Web Worker for heavy computations
  const useWebWorker = useCallback((workerScript: string, data: any) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerScript);
      worker.postMessage(data);
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = reject;
    });
  }, []);

  return {
    debounce,
    memoizeCalculation,
    useWebWorker,
    isOptimizing,
    setIsOptimizing
  };
};

/**
 * Virtual scrolling hook for large datasets
 */
export const useVirtualScrolling = (items: any[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    setScrollTop
  };
};