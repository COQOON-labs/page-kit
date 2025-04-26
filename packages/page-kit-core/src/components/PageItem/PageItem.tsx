import React from 'react';
import { cn } from '../../utils/react-helper';
import { PageItemProps } from './types';
import { usePageContext } from '../Page';

export const PageItem = React.forwardRef<HTMLDivElement, PageItemProps>(
  ({ 
    id,
    position = { x: 0, y: 0 },
    size = { width: 50, height: 50 },
    children,
    zIndex = 1,
    rotation = 0,
    className = '',
    onClick,
    ...props
  }, ref) => {
    // Get the page context to access scaling factors
    const pageContext = usePageContext();
    
    // Calculate position and size based on mm to pixel conversion
    // Standard DPI for screens is 96 dpi, which means 1 inch = 96 pixels
    // 1 inch = 25.4 mm, so 1 mm = 96/25.4 ≈ 3.78 pixels
    const mmToPx = (mm: number) => mm * (96 / 25.4);
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${mmToPx(position.x)}px`,
      top: `${mmToPx(position.y)}px`,
      width: `${mmToPx(size.width)}px`,
      height: `${mmToPx(size.height)}px`,
      zIndex,
      transform: rotation ? `rotate(${rotation}deg)` : undefined,
      transformOrigin: 'center center',
    };
    
    return (
      <div
        ref={ref}
        id={id}
        className={cn('page-item', className)}
        style={style}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PageItem.displayName = 'PageItem';

export const UnstyledPageItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

UnstyledPageItem.displayName = 'UnstyledPageItem'; 