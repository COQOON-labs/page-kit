import React from 'react';
import { cn } from '../../utils/react-helper';
import { ShapeItemProps } from './types';
import { PageItem } from './PageItem';
import { useElementDimensions, useShapeStyles } from '../../hooks';

/**
 * A component for rendering various shapes on a page
 */
export const ShapeItem = React.forwardRef<HTMLDivElement, ShapeItemProps>(
  ({ 
    shapeType,
    backgroundColor = 'transparent',
    borderColor = 'black',
    borderWidth = 1,
    className = '',
    dimensions,
    ...props
  }, ref) => {
    // Use custom hooks for dimensions and shape styles
    const { dimensionClasses } = useElementDimensions(dimensions);
    
    const { shapeStyles, shapeClasses, containerClasses } = useShapeStyles({
      shapeType,
      backgroundColor,
      borderColor,
      borderWidth
    });
    
    return (
      <PageItem
        ref={ref}
        className={cn('page-shape-item', dimensionClasses, containerClasses, className)}
        {...props}
      >
        <div 
          className={cn(shapeClasses)}
          style={shapeStyles}
        />
      </PageItem>
    );
  }
);

ShapeItem.displayName = 'ShapeItem'; 