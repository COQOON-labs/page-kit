import React, { createContext, useContext, ReactNode } from 'react';
import { defaultConfig } from './defaults';
import { deepMerge } from '../utils/object-helper';

/**
 * Type definition for text styling options
 */
export interface TextStyleOptions {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number;
}

/**
 * Type definition for color options
 */
export interface ColorOptions {
  primary?: string;
  secondary?: string;
  success?: string;
  danger?: string;
  warning?: string;
  info?: string;
  light?: string;
  dark?: string;
  [key: string]: string | undefined;
}

/**
 * Type definition for PageKit config
 */
export interface PageKitConfig {
  header?: {
    show?: boolean;
    height?: number;
    content?: ReactNode;
  };
  footer?: {
    show?: boolean;
    height?: number;
    content?: ReactNode;
  };
  layout?: {
    padding?: number | string | { top?: number; right?: number; bottom?: number; left?: number };
    itemSpacing?: number;
  };
  typography?: {
    heading?: TextStyleOptions;
    paragraph?: TextStyleOptions;
  };
  colors?: ColorOptions;
  [key: string]: Record<string, unknown> | undefined;
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