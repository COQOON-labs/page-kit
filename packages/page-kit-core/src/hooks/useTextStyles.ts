import React from 'react';
import { ptToPx } from '../utils/dimension-helper';

interface TextStyleOptions {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number | string;
}

/**
 * Custom hook for generating text styles
 * @param options Text style options
 * @returns Style object for text elements
 */
export function useTextStyles({
  fontSize = 12,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  color = 'black',
  textAlign = 'left',
  lineHeight = 1.5
}: TextStyleOptions) {
  // Generate text styles object
  const textStyles = React.useMemo((): React.CSSProperties => {
    return {
      fontSize: `${ptToPx(fontSize)}px`,
      fontFamily,
      fontWeight,
      color,
      textAlign,
      lineHeight,
    };
  }, [fontSize, fontFamily, fontWeight, color, textAlign, lineHeight]);
  
  // Generate text-related class names based on alignment
  const textClasses = React.useMemo(() => {
    const classes = ['text-content', 'overflow-hidden'];
    
    // Add alignment classes
    if (textAlign === 'center') classes.push('text-center');
    if (textAlign === 'right') classes.push('text-right');
    if (textAlign === 'justify') classes.push('text-justify');
    
    return classes.join(' ');
  }, [textAlign]);
  
  return {
    textStyles,
    textClasses
  };
} 