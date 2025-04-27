import React, { createContext, useContext, useMemo } from 'react';
import { PageKitConfig } from './types';
import { defaultConfig } from './defaults';

// Create configuration context
const PageKitConfigContext = createContext<PageKitConfig>(defaultConfig);

// Provider props type
export interface PageKitConfigProviderProps {
  /**
   * Configuration object to override defaults
   */
  config?: Partial<PageKitConfig>;
  /**
   * Children components
   */
  children: React.ReactNode;
}

/**
 * Recursively merge configuration objects preserving defaults
 * @param target Default configuration object
 * @param source User-provided configuration object 
 * @returns Merged configuration
 */
function deepMergeConfig<T extends Record<string, any>>(
  target: T, 
  source?: Partial<T>
): T {
  if (!source) return { ...target };
  
  const result = { ...target } as T;
  
  Object.keys(source).forEach(key => {
    const k = key as keyof T;
    const targetValue = target[k];
    const sourceValue = source[k as keyof Partial<T>];
    
    if (
      sourceValue !== null && 
      typeof sourceValue === 'object' && 
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Recursively merge objects
      result[k] = deepMergeConfig(
        targetValue as Record<string, any>,
        sourceValue as Record<string, any>
      ) as any;
    } else {
      // Replace primitive values, arrays, or null values
      result[k] = (sourceValue !== undefined ? sourceValue : targetValue) as any;
    }
  });
  
  return result;
}

/**
 * Provider component for Page Kit configuration
 */
export const PageKitConfigProvider: React.FC<PageKitConfigProviderProps> = ({
  config = {},
  children
}) => {
  // Merge provided config with default config using deep merge
  const mergedConfig = useMemo(
    () => deepMergeConfig(defaultConfig, config),
    [config]
  );
  
  // Validate critical configuration values
  if (process.env.NODE_ENV !== 'production') {
    // Example validation (add more as needed)
    if (mergedConfig.layout.padding && typeof mergedConfig.layout.padding === 'object') {
      const { top, right, bottom, left } = mergedConfig.layout.padding;
      if (top !== undefined && top < 0) console.warn('PageKit: layout.padding.top should not be negative');
      if (right !== undefined && right < 0) console.warn('PageKit: layout.padding.right should not be negative');
      if (bottom !== undefined && bottom < 0) console.warn('PageKit: layout.padding.bottom should not be negative');
      if (left !== undefined && left < 0) console.warn('PageKit: layout.padding.left should not be negative');
    }
  }

  return (
    <PageKitConfigContext.Provider value={mergedConfig}>
      {children}
    </PageKitConfigContext.Provider>
  );
};

/**
 * Hook to access the Page Kit configuration
 */
export const usePageKitConfig = () => useContext(PageKitConfigContext); 