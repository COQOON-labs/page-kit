import React from 'react';
import { cn } from '../../utils/react-helper';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The variant of the badge
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /**
   * Optional additional className
   */
  className?: string;
}

// Unstyled Badge - no styling applied
export const UnstyledBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className = '', ...props }, ref) => (
    <span
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </span>
  )
);

UnstyledBadge.displayName = 'UnstyledBadge';

// Styled Badge with Tailwind styling
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-purple-100 text-purple-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge'; 