import React from 'react';
import { cn } from '../../utils/react-helper';
import { ShapeItemProps } from './types';
import { PageItem } from './PageItem';

export const ShapeItem = React.forwardRef<HTMLDivElement, ShapeItemProps>(
  ({ 
    shapeType,
    backgroundColor = 'transparent',
    borderColor = 'black',
    borderWidth = 1,
    className = '',
    ...props
  }, ref) => {
    // Convert mm to px
    const mmToPx = (mm: number) => mm * (96 / 25.4);
    
    const shapeStyle: React.CSSProperties = {
      backgroundColor,
      border: `${mmToPx(borderWidth)}px solid ${borderColor}`,
    };
    
    // Apply specific styles based on shape type
    if (shapeType === 'rectangle') {
      // Rectangle is the default div shape
    } else if (shapeType === 'ellipse') {
      shapeStyle.borderRadius = '50%';
    } else if (shapeType === 'line') {
      // For a line, we use a div with height=borderWidth and remove side borders
      shapeStyle.height = `${mmToPx(borderWidth)}px`;
      shapeStyle.border = 'none';
      shapeStyle.backgroundColor = borderColor;
      // Center the line vertically
      shapeStyle.position = 'absolute';
      shapeStyle.top = '50%';
      shapeStyle.transform = 'translateY(-50%)';
      shapeStyle.width = '100%';
    }
    
    return (
      <PageItem
        ref={ref}
        className={cn('page-shape-item', className)}
        {...props}
      >
        <div 
          className="h-full w-full"
          style={shapeStyle}
        />
      </PageItem>
    );
  }
);

ShapeItem.displayName = 'ShapeItem'; 