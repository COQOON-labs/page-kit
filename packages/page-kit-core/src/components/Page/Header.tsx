import React from 'react';
import { cn } from '../../utils/react-helper';
import { usePageKitConfig } from '../../config';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Left section content
   */
  left?: React.ReactNode;
  /**
   * Center section content
   */
  center?: React.ReactNode;
  /**
   * Right section content
   */
  right?: React.ReactNode;
  /**
   * Header background color (overrides theme)
   */
  backgroundColor?: string;
  /**
   * Header text color (overrides theme)
   */
  textColor?: string;
  /**
   * Additional className
   */
  className?: string;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ 
    left, 
    center, 
    right, 
    backgroundColor, 
    textColor, 
    className = '',
    ...props 
  }, ref) => {
    const config = usePageKitConfig();
    
    // Only render if header is enabled in config
    if (!config.header.show) return null;
    
    // Merge props with config
    const bgColor = backgroundColor || config.header.backgroundColor;
    const txtColor = textColor || config.header.textColor;
    
    const style: React.CSSProperties = {
      backgroundColor: bgColor,
      color: txtColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    };
    
    return (
      <div
        ref={ref}
        className={cn('page-header-content', className)}
        style={style}
        {...props}
      >
        <div className="page-header-left">{left}</div>
        <div className="page-header-center">{center}</div>
        <div className="page-header-right">{right}</div>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader'; 