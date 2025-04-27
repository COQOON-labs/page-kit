import React from 'react';
import { cn } from '../../utils/react-helper';
import { usePageKitConfig } from '../../config';
import { usePageContext } from './index';

export interface PageFooterProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Footer background color (overrides theme)
   */
  backgroundColor?: string;
  /**
   * Footer text color (overrides theme)
   */
  textColor?: string;
  /**
   * Whether to show page numbers (overrides config)
   */
  showPageNumbers?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

export const PageFooter = React.forwardRef<HTMLDivElement, PageFooterProps>(
  ({ 
    left, 
    center, 
    right, 
    backgroundColor, 
    textColor,
    showPageNumbers,
    className = '',
    ...props 
  }, ref) => {
    const config = usePageKitConfig();
    const pageContext = usePageContext();
    
    // Only render if footer is enabled in config
    if (!config.footer.show) return null;
    
    // Merge props with config
    const bgColor = backgroundColor || config.footer.backgroundColor;
    const txtColor = textColor || config.footer.textColor;
    const shouldShowPageNumbers = showPageNumbers !== undefined 
      ? showPageNumbers 
      : config.footer.showPageNumbers;
    
    const style: React.CSSProperties = {
      backgroundColor: bgColor,
      color: txtColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    };
    
    // Generate default page numbers if needed
    const pageNumbers = (shouldShowPageNumbers && pageContext.pageNumber && pageContext.totalPages) ? 
      `Page ${pageContext.pageNumber} of ${pageContext.totalPages}` : 
      null;
    
    return (
      <div
        ref={ref}
        className={cn('page-footer-content', className)}
        style={style}
        {...props}
      >
        <div className="page-footer-left">{left}</div>
        <div className="page-footer-center">{center}</div>
        <div className="page-footer-right">
          {right !== undefined ? right : pageNumbers}
        </div>
      </div>
    );
  }
);

PageFooter.displayName = 'PageFooter'; 