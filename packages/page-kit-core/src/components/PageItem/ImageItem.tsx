import React from 'react';
import { cn } from '../../utils/react-helper';
import { ImageItemProps } from './types';
import { createPageItem } from './createPageItem';

/**
 * Component for displaying images with various sizing and display options
 */
export const ImageItem = createPageItem<ImageItemProps>({
  displayName: 'ImageItem',
  baseClassName: 'page-image-item',
  supportsDimensions: true,
  renderContent: (props, dimensionInfo) => {
    const { src, alt = '', objectFit = 'contain' } = props;
    
    // Map objectFit to Tailwind classes
    const objectFitClass = {
      'contain': 'object-contain',
      'cover': 'object-cover',
      'fill': 'object-fill',
      'none': 'object-none',
      'scale-down': 'object-scale-down'
    }[objectFit] || 'object-contain';
    
    return (
      <img 
        src={src} 
        alt={alt} 
        className={cn('w-full h-full', objectFitClass)}
      />
    );
  },
  customProps: ['src', 'alt', 'objectFit']
}); 