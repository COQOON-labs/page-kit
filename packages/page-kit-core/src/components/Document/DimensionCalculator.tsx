import React, { ReactElement } from 'react';
import { mmToPx } from '../../utils/dimension-helper';

interface DimensionProps {
  width?: number | string;
  height?: number | string;
}

/**
 * Calculates height for different component types
 * This utility consolidates dimension calculation logic in one place
 */
export function calculateItemHeight(
  item: ReactElement,
  pageMaxWidth = 800
): number {
  if (!item || !item.props) {
    return 0;
  }

  const itemType = item.type as any;
  const typeName = itemType?.displayName || (typeof itemType === 'string' ? itemType : 'Unknown');
  
  // Console log for debugging
  console.debug(`Calculating height for component type: ${typeName}`);
  
  // Specific handling for Layout components
  if (typeName === 'DocumentLayout' || typeName === 'PageLayout') {
    // For layout components, we should calculate based on children
    // But since this can be complex, assign a substantial initial height
    // The actual layout system will recalculate more precisely
    return mmToPx(40); // Start with larger base height for layouts
  }
  
  // Handle components with dimension props
  if (hasDimensions(item.props)) {
    // Convert mm dimensions to pixels if needed
    if (typeof item.props.height === 'number') {
      return mmToPx(item.props.height);
    }
    
    // If height is a string with percent, convert based on page size
    if (typeof item.props.height === 'string' && item.props.height.endsWith('%')) {
      const heightPercent = parseFloat(item.props.height);
      if (!isNaN(heightPercent)) {
        // Convert percent to pixels (assuming standard page height)
        return pageMaxWidth * (heightPercent / 100);
      }
    }
  }
  
  // Type-specific height calculations
  switch (typeName) {
    case 'TextItem':
    case 'ParagraphItem':
    case 'HeadingItem':
      return calculateTextItemHeight(item);
      
    case 'CalloutItem':
      return calculateCalloutItemHeight(item);
      
    case 'ShapeItem':
      return calculateShapeItemHeight(item);
      
    case 'ImageItem':
      return calculateImageItemHeight(item, pageMaxWidth);
      
    case 'TableItem':
      return calculateTableItemHeight(item);
      
    default:
      // Default height for unknown components - more generous to avoid clipping
      console.warn(`No specific height calculator for component type: ${typeName}`);
      return mmToPx(30); // Increased default height
  }
}

/**
 * Type guard for components with dimension props
 */
function hasDimensions(props: any): props is DimensionProps {
  return props && (
    (typeof props.height === 'number' || typeof props.height === 'string') ||
    (typeof props.width === 'number' || typeof props.width === 'string')
  );
}

/**
 * Calculate height for text items based on content and style
 */
function calculateTextItemHeight(item: ReactElement): number {
  const { fontSize = 16, lineHeight = 1.5, text } = item.props;
  
  // Get text content from either text prop or children
  let content = '';
  if (text) {
    // Use text prop if available
    content = typeof text === 'string' ? text : '';
  } else if (item.props.children) {
    // Otherwise try to extract from children
    if (typeof item.props.children === 'string') {
      content = item.props.children;
    } else if (Array.isArray(item.props.children)) {
      // Try to extract strings from array of children
      content = React.Children.toArray(item.props.children)
        .filter(child => typeof child === 'string')
        .join(' ');
    }
  }
  
  // Use more realistic algorithm for text height
  // Assume average char width is 60% of font size for proportional font
  const charWidth = fontSize * 0.6;
  // Assume a standard readable line width (characters per line)
  const charsPerLine = Math.floor(800 / charWidth);
  // Calculate approx number of lines needed
  const lineCount = Math.max(1, Math.ceil(content.length / charsPerLine));
  
  // Calculate height: lines × fontSize × lineHeight + extra padding
  const textHeight = lineCount * fontSize * lineHeight;
  // Add extra padding for paragraph spacing
  const paddingHeight = fontSize * 2;
  
  return Math.max(textHeight + paddingHeight, fontSize * lineHeight * 2);
}

/**
 * Calculate height for callout items
 */
function calculateCalloutItemHeight(item: ReactElement): number {
  const { calloutTitle, variant = 'info' } = item.props;
  
  // Base calculation with default heights
  const titleHeight = calloutTitle ? 32 : 0; // Title bar height
  
  // Get content text from children if available
  let content = '';
  if (item.props.children) {
    if (typeof item.props.children === 'string') {
      content = item.props.children;
    } else if (Array.isArray(item.props.children)) {
      content = React.Children.toArray(item.props.children)
        .filter(child => typeof child === 'string')
        .join(' ');
    }
  }
  
  // Calculate content height using similar approach to text items
  const fontSize = item.props.fontSize || 14; // Default font size for callouts
  const lineHeight = item.props.lineHeight || 1.5;
  const charWidth = fontSize * 0.6;
  const effectiveWidth = 800 * 0.9; // Callouts usually have some padding/margins
  const charsPerLine = Math.floor(effectiveWidth / charWidth);
  const lineCount = Math.max(2, Math.ceil(content.length / charsPerLine));
  
  const contentHeight = lineCount * fontSize * lineHeight;
  
  // Add margins and padding based on variant
  const basePadding = 48; // Standard padding for callouts
  
  return titleHeight + contentHeight + basePadding;
}

/**
 * Calculate height for shape items
 */
function calculateShapeItemHeight(item: ReactElement): number {
  const { shape = 'rectangle', height } = item.props;
  
  // Use explicit height if available
  if (typeof height === 'number') {
    return mmToPx(height);
  }
  
  // Default heights based on shape type
  switch (shape) {
    case 'circle':
      return mmToPx(50);
    case 'rectangle':
      return mmToPx(30);
    case 'line':
      return mmToPx(5);
    default:
      return mmToPx(30);
  }
}

/**
 * Calculate height for image items respecting aspect ratio
 */
function calculateImageItemHeight(item: ReactElement, pageMaxWidth: number): number {
  const { height, width, aspectRatio = 1 } = item.props;
  
  // Use explicit height if available
  if (typeof height === 'number') {
    return mmToPx(height);
  }
  
  // Calculate height based on width and aspect ratio
  if (typeof width === 'number') {
    const widthPx = mmToPx(width);
    return widthPx / aspectRatio;
  }
  
  // Default image height
  return pageMaxWidth / 2;
}

/**
 * Calculate height for table items
 */
function calculateTableItemHeight(item: ReactElement): number {
  const { rows = [], headerHeight = 40, rowHeight = 30 } = item.props;
  
  // Calculate based on header and rows
  const hasHeader = item.props.headers && item.props.headers.length > 0;
  const headerSize = hasHeader ? headerHeight : 0;
  const rowsSize = (rows.length || 1) * rowHeight;
  
  // Add border and padding
  return headerSize + rowsSize + 20;
} 