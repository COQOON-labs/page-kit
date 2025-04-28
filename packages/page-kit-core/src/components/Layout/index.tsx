import React from 'react';
import { cn } from '../../utils/react-helper';
import { ColumnDefinition } from '../Page';
import { validateColumnWidths } from '../../utils/column-helper';

export interface LayoutProps {
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
 * Layout component that defines a columnar structure for page items
 * Can be used either directly inside Document or nested within other layouts
 */
export const Layout: React.FC<LayoutProps> = ({ 
  columns = [{ width: 100 }],
  children,
  className = ''
}) => {
  // Validate column definitions
  const validatedColumns = validateColumnWidths(columns, "Layout");
  
  return (
    <div 
      className={cn('page-layout', className)}
      data-layout-type="column"
      data-column-count={validatedColumns?.length || 0}
    >
      {children}
    </div>
  );
};

// Set display name
Layout.displayName = 'Layout';

export default Layout; 