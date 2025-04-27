import React from 'react';
import { mmToPx } from '../utils/dimension-helper';

type ShapeType = 'rectangle' | 'ellipse' | 'line';

interface ShapeStyleOptions {
  shapeType: ShapeType;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Custom hook for calculating shape styles based on shape type
 * @param options Shape configuration options
 * @returns Object with styles and classes for shape rendering
 */
export function useShapeStyles({
  shapeType,
  backgroundColor = 'transparent',
  borderColor = 'black',
  borderWidth = 1
}: ShapeStyleOptions) {
  // Convert mm to px for borderWidth
  const borderWidthPx = `${mmToPx(borderWidth)}px`;
  
  // Get Tailwind classes based on shape type
  const shapeClasses = React.useMemo(() => {
    const classes = ['shape-content'];
    
    if (shapeType === 'ellipse') {
      classes.push('rounded-full');
    }
    
    if (shapeType === 'line') {
      classes.push('flex-center');
    }
    
    return classes.join(' ');
  }, [shapeType]);
  
  // Get container classes based on shape type
  const containerClasses = React.useMemo(() => {
    if (shapeType === 'line') {
      return 'flex items-center';
    }
    return '';
  }, [shapeType]);
  
  // Get styles based on shape type
  const shapeStyles = React.useMemo((): React.CSSProperties => {
    if (shapeType === 'rectangle') {
      return {
        backgroundColor,
        borderColor,
        borderWidth: borderWidthPx,
        borderStyle: 'solid',
        width: '100%',
        height: '100%'
      };
    } else if (shapeType === 'ellipse') {
      return {
        backgroundColor,
        borderColor, 
        borderWidth: borderWidthPx,
        borderStyle: 'solid',
        width: '100%',
        height: '100%'
      };
    } else if (shapeType === 'line') {
      return {
        height: borderWidthPx,
        backgroundColor: borderColor,
        width: '100%',
        margin: 'auto 0'
      };
    }
    
    // Default fallback
    return {
      backgroundColor,
      borderColor,
      borderWidth: borderWidthPx,
      borderStyle: 'solid'
    };
  }, [shapeType, backgroundColor, borderColor, borderWidthPx]);
  
  return {
    shapeStyles,
    shapeClasses,
    containerClasses
  };
} 