import React, { createContext, useContext, ReactNode } from 'react';
import { defaultConfig } from './defaults';
import type { PageKitConfig } from './types';

// Helper function to deep merge objects
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;
  
  if (!source) {
    return output;
  }

  Object.keys(source).forEach(key => {
    const targetValue = output[key as keyof T];
    const sourceValue = source[key as keyof T];

    if (
      targetValue && 
      sourceValue && 
      typeof targetValue === 'object' && 
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) && 
      !Array.isArray(sourceValue)
    ) {
      output[key as keyof T] = deepMerge(targetValue, sourceValue) as any;
    } else if (sourceValue !== undefined) {
      output[key as keyof T] = sourceValue as any;
    }
  });

  return output;
}

// Create Context with default config
const PageKitConfigContext = createContext<PageKitConfig>(defaultConfig);

/**
 * Provider component for PageKit configuration
 */
export function PageKitConfigProvider({
  children,
  config = {},
}: {
  children: ReactNode;
  config?: Partial<PageKitConfig>;
}) {
  // Merge provided config with default config
  const mergedConfig = deepMerge(defaultConfig, config);
  
  return (
    <PageKitConfigContext.Provider value={mergedConfig}>
      {children}
    </PageKitConfigContext.Provider>
  );
}

/**
 * Hook to access the PageKit configuration
 */
export function usePageKitConfig(): PageKitConfig {
  return useContext(PageKitConfigContext);
} 