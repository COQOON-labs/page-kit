import React from 'react';
import { cn } from '../../utils/react-helper';
import { ShapeItemProps } from './types';
import { createPageItem } from './createPageItem';
import { useShapeStyles } from '../../hooks';

/**
 * A component for rendering various shapes on a page
 */
export const ShapeItem = createPageItem<ShapeItemProps>({
  displayName: 'ShapeItem',
  baseClassName: 'page-shape-item',
  supportsDimensions: true,
  renderContent: (props) => {
    const { 
      shapeType,
      backgroundColor = 'transparent',
      borderColor = 'black',
      borderWidth = 1
    } = props;
    
    const { shapeStyles, shapeClasses, containerClasses } = useShapeStyles({
      shapeType,
      backgroundColor,
      borderColor,
      borderWidth
    });
    
    return (
      <div 
        className={cn(shapeClasses, containerClasses)}
        style={shapeStyles}
      />
    );
  },
  getAdditionalClasses: (props) => {
    const { 
      shapeType,
      backgroundColor = 'transparent',
      borderColor = 'black',
      borderWidth = 1
    } = props;
    
    const { containerClasses } = useShapeStyles({
      shapeType,
      backgroundColor,
      borderColor,
      borderWidth
    });
    
    return containerClasses;
  },
  customProps: ['shapeType', 'backgroundColor', 'borderColor', 'borderWidth']
}); 