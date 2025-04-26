import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional padding variation
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Optional border radius variation
   */
  radius?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Optional additional className
   */
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, padding = 'md', radius = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'bg-white border border-gray-200 shadow-sm';
    
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    
    const radiusStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
    };
    
    const combinedClassName = `${baseStyles} ${paddingStyles[padding]} ${radiusStyles[radius]} ${className}`;
    
    return (
      <div
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`mb-2 ${className}`}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t ${className}`}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter'; 