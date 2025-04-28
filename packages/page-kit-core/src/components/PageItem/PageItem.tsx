import React from 'react';
import { cn } from '../../utils/react-helper';
import { PageItemProps } from './types';
import { usePageContext } from '../Page';
import { filterDOMProps } from '../../utils/layout-helper';

export const PageItem = React.forwardRef<HTMLDivElement, PageItemProps>(
  ({ 
    id,
    className = '',
    onClick,
    children,
    style,
    ...props
  }, ref) => {
    // Filter out non-DOM props
    const domSafeProps = filterDOMProps(props as Record<string, unknown>, [
      'columnIndex', 'columns'
    ]);
    
    return (
      <div
        ref={ref}
        id={id}
        className={cn('page-item', className)}
        onClick={onClick}
        style={style}
        {...domSafeProps}
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