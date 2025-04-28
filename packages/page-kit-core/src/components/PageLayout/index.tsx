import React, { useEffect } from 'react';
import { cn } from '../../utils/react-helper';
import { ColumnDefinition } from '../Page';
import { validateColumnWidths } from '../../utils/column-helper';

/**
 * Props for PageLayout component (constrained to a single page)
 */
export interface PageLayoutProps {
  /**
   * Column definitions for this layout
   * Column widths should sum to 100%
   * If not provided, defaults to a single column layout
   */
  columns?: ColumnDefinition[];
  
  /**
   * Children elements (page items)
   */
  children: React.ReactNode;
  
  /**
   * Optional className for the layout container
   */
  className?: string;
}

/**
 * PageLayout component that defines a columnar structure within a single page
 * Used for page-specific layouts that don't span across pages
 */
export const PageLayout: React.FC<PageLayoutProps> = ({ 
  columns = [{ width: 100 }],
  children,
  className = ''
}) => {
  // Validate column definitions
  const validatedColumns = validateColumnWidths(columns, "PageLayout");
  
  // Add debug logging on mount
  useEffect(() => {
    console.log('[PageKit DEBUG] PageLayout mounted with:', {
      columnCount: validatedColumns?.length || 1,
      childrenCount: React.Children.count(children)
    });
  }, []);
  
  return (
    <div 
      className={cn('page-layout', className)}
      data-layout-type="page-column"
      data-column-count={validatedColumns?.length || 1}
      data-debug-id={`pageLayout-${Math.random().toString(36).slice(2, 7)}`}
    >
      {children}
    </div>
  );
};

// Set display name explicitly for better component recognition
PageLayout.displayName = 'PageLayout';

export default PageLayout; 