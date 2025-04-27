import React from 'react';
import { cn } from '../../utils/react-helper';
import { PageItemProps } from './types';
import { usePageContext } from '../Page';

export const PageItem = React.forwardRef<HTMLDivElement, PageItemProps>(
  ({ 
    id,
    className = '',
    onClick,
    children,
    style,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className={cn('page-item', className)}
        onClick={onClick}
        style={style}
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