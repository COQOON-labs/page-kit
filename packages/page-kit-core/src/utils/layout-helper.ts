import { PageKitConfig } from '../config/types';
import { mmToPx } from './dimension-helper';

/**
 * Gets standardized padding values from configuration
 */
export function getPaddingValues(config: PageKitConfig): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const defaultPadding = 20; // Default 20mm padding
  
  if (!config.layout || !config.layout.padding) {
    return {
      top: defaultPadding,
      right: defaultPadding,
      bottom: defaultPadding,
      left: defaultPadding
    };
  }
  
  if (typeof config.layout.padding === 'number') {
    return {
      top: config.layout.padding,
      right: config.layout.padding,
      bottom: config.layout.padding,
      left: config.layout.padding
    };
  }
  
  // Handle string padding (like '10mm')
  if (typeof config.layout.padding === 'string') {
    const numericPadding = parseInt(config.layout.padding, 10) || defaultPadding;
    return {
      top: numericPadding,
      right: numericPadding,
      bottom: numericPadding,
      left: numericPadding
    };
  }
  
  // Handle object padding
  return {
    top: config.layout.padding.top || defaultPadding,
    right: config.layout.padding.right || defaultPadding,
    bottom: config.layout.padding.bottom || defaultPadding,
    left: config.layout.padding.left || defaultPadding
  };
}

/**
 * Calculates available content height for a page
 */
export function calculatePageContentHeight(
  pageWidth: number,
  config: PageKitConfig,
  addBuffer = true
): number {
  // DIN A4 has an aspect ratio of 1:√2
  const aspectRatio = Math.sqrt(2);
  const pageHeight = pageWidth * aspectRatio;
  
  // Get padding values
  const padding = getPaddingValues(config);
  
  // Convert mm to px
  const paddingTopPx = mmToPx(padding.top);
  const paddingBottomPx = mmToPx(padding.bottom);
  
  // Calculate header and footer heights
  const headerHeightPx = config.header?.show ? mmToPx(config.header.height || 0) : 0;
  const footerHeightPx = config.footer?.show ? mmToPx(config.footer.height || 0) : 0;
  
  // Increased buffer to provide more space for content and prevent too-early page breaks
  // This gives the pagination algorithm more room to work with
  const buffer = addBuffer ? 30 : 0; // Increased from 10 to 30
  
  // Calculate available content height
  const availableHeight = pageHeight - paddingTopPx - paddingBottomPx - headerHeightPx - footerHeightPx + buffer;
  
  // Add debug information with console.log instead of console.debug
  console.log(`[PageKit DEBUG] Page content calculation:
    - Page width: ${pageWidth}px
    - Page height: ${pageHeight}px
    - Padding top: ${paddingTopPx}px
    - Padding bottom: ${paddingBottomPx}px
    - Header height: ${headerHeightPx}px
    - Footer height: ${footerHeightPx}px
    - Buffer: ${buffer}px
    - Available height: ${availableHeight}px
  `);
  
  return availableHeight;
}

/**
 * Formats padding as CSS value
 */
export function formatPaddingCSS(padding: { top: number; right: number; bottom: number; left: number }): string {
  return `${padding.top}mm ${padding.right}mm ${padding.bottom}mm ${padding.left}mm`;
}

/**
 * Filters props to ensure only safe DOM props are passed to elements
 */
export function filterDOMProps(
  props: Record<string, unknown>, 
  customProps: string[] = []
): Record<string, unknown> {
  // Standard DOM props that are safe to use
  const standardDOMProps = [
    'id', 'className', 'style', 'onClick', 'onMouseOver', 'onMouseOut',
    'onKeyDown', 'onKeyUp', 'onFocus', 'onBlur', 'tabIndex', 
    'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 
    'aria-hidden', 'data-testid'
  ];
  
  const domSafeProps: Record<string, unknown> = {};
  
  Object.entries(props).forEach(([key, value]) => {
    // Only add props that are in standardDOMProps and not in customProps
    if (!customProps.includes(key) && standardDOMProps.includes(key)) {
      domSafeProps[key] = value;
    }
  });
  
  return domSafeProps;
} 