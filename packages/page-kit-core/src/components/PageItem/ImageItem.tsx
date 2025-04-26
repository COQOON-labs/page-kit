import React from 'react';
import { cn } from '../../utils/react-helper';
import { ImageItemProps } from './types';
import { PageItem } from './PageItem';

export const ImageItem = React.forwardRef<HTMLDivElement, ImageItemProps>(
  ({ 
    src,
    alt = '',
    objectFit = 'contain',
    className = '',
    ...props
  }, ref) => {
    return (
      <PageItem
        ref={ref}
        className={cn('page-image-item', className)}
        {...props}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full" 
          style={{ objectFit }}
        />
      </PageItem>
    );
  }
);

ImageItem.displayName = 'ImageItem'; 