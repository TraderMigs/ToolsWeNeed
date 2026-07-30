import { useCallback, useMemo, useState } from 'react';

export const usePerformanceOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const debounce = useCallback(<Args extends unknown[]>(func: (...args: Args) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  return { debounce, isOptimizing, setIsOptimizing };
};

export const useVirtualScrolling = <Item extends object>(items: Item[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
    return items.slice(startIndex, endIndex).map((item, index) => ({ ...item, index: startIndex + index }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  return { visibleItems, totalHeight: items.length * itemHeight, setScrollTop };
};
