import { PageKitConfig } from './types';

/**
 * Default configuration for Page Kit
 */
export const defaultConfig: PageKitConfig = {
  typography: {
    fontFamily: 'Arial, sans-serif',
    baseFontSize: 12,
    headingFontFamily: 'Arial, sans-serif',
    headingFontWeight: 'bold',
    lineHeight: 1.5
  },
  header: {
    show: true,
    height: 20,
    backgroundColor: '#f8f9fa',
    textColor: '#212529'
  },
  footer: {
    show: true,
    height: 20,
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    showPageNumbers: true
  },
  layout: {
    padding: 20,
    itemSpacing: 10
  },
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529',
    info: '#0ea5e9',
    success: '#10b981',
    warning: '#f97316',
    error: '#dc2626'
  }
}; 