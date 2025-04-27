import React from 'react';
import { cn } from '../../utils/react-helper';
import { ImageItemProps } from './types';
import { PageItem } from './PageItem';
import { useElementDimensions } from '../../hooks';

/**
 * Component for displaying images with various sizing and display options
 */
export const ImageItem = React.forwardRef<HTMLDivElement, ImageItemProps>(
  ({ 
    src,
    alt = '',
    objectFit = 'contain',
    className = '',
    dimensions,
    ...props
  }, ref) => {
    // Use custom hook for dimensions
    const { dimensionClasses } = useElementDimensions(dimensions);
    
    // Map objectFit to Tailwind classes
    const objectFitClass = React.useMemo(() => {
      const fitMap = {
        'contain': 'object-contain',
        'cover': 'object-cover',
        'fill': 'object-fill',
        'none': 'object-none',
        'scale-down': 'object-scale-down'
      };
      
      return fitMap[objectFit] || 'object-contain';
    }, [objectFit]);
    
    return (
      <PageItem
        ref={ref}
        className={cn('page-image-item', dimensionClasses, className)}
        {...props}
      >
        <img 
          src={src} 
          alt={alt} 
          className={cn('w-full h-full', objectFitClass)}
        />
      </PageItem>
    );
  }
);

ImageItem.displayName = 'ImageItem'; 