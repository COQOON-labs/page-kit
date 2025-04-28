import React, { useEffect } from 'react';
import { cn } from '../../utils/react-helper';
import { ColumnDefinition } from '../Page';
import { validateColumnWidths } from '../../utils/column-helper';

/**
 * Props for DocumentLayout component (can span multiple pages)
 */
export interface DocumentLayoutProps {
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
  
  /**
   * Force a page break before this layout section
   * Default: true - DocumentLayouts always start on a new page
   */
  pageBreakBefore?: boolean;

  /**
   * Force a page break after this layout section
   */
  pageBreakAfter?: boolean;

  /**
   * For pagination tracking - current page number in multi-page layout
   * @internal
   */
  'data-layout-page'?: number;
  
  /**
   * For pagination tracking - total pages in this layout
   * @internal
   */
  'data-total-pages'?: number;
  
  /**
   * For pagination tracking - current page in this layout
   * @internal
   */
  'data-current-page'?: number;
  
  /**
   * For pagination tracking - unique ID for this layout
   * @internal
   */
  'data-layout-id'?: string;
}

/**
 * DocumentLayout component that defines a columnar structure for document content
 * Used directly inside Document and can span multiple pages
 * Content flows across pages automatically when it exceeds page height
 */
export const DocumentLayout: React.FC<DocumentLayoutProps> = ({ 
  columns = [{ width: 100 }],
  children,
  className = '',
  pageBreakBefore = true,
  pageBreakAfter = false,
  'data-layout-page': dataLayoutPage,
  'data-total-pages': dataTotalPages,
  'data-current-page': dataCurrentPage,
  'data-layout-id': dataLayoutId,
  ...props
}) => {
  // Validate column definitions
  const validatedColumns = validateColumnWidths(columns, "DocumentLayout");
  
  const isMultiPage = dataTotalPages && dataTotalPages > 1;
  const currentPage = dataCurrentPage || 0;
  const totalPages = dataTotalPages || 1;

  // Add debug logging on mount
  useEffect(() => {
    console.log('[PageKit DEBUG] DocumentLayout mounted with:', {
      columnCount: validatedColumns?.length || 1,
      pageBreakBefore,
      childrenCount: React.Children.count(children),
      ...(isMultiPage ? {
        page: `${currentPage + 1} of ${totalPages}`,
        layoutId: dataLayoutId
      } : {})
    });
  }, []);
  
  // Organize children by column
  const renderColumns = () => {
    const itemsByColumn: React.ReactNode[][] = Array(validatedColumns.length)
      .fill(0)
      .map(() => []);
    
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        // Add text/non-element nodes to first column
        itemsByColumn[0].push(child);
        return;
      }
      
      const columnIndex = Number(child.props?.columnIndex || 0);
      if (columnIndex >= 0 && columnIndex < validatedColumns.length) {
        itemsByColumn[columnIndex].push(child);
      } else {
        // Default to first column
        itemsByColumn[0].push(child);
      }
    });
    
    return (
      <div className="document-layout-columns" style={{ 
        display: 'flex', 
        width: '100%',
        gap: '8px'
      }}>
        {validatedColumns.map((column, idx) => (
          <div 
            key={`column-${idx}`}
            className="document-layout-column"
            style={{
              width: `${column.width}%`,
              backgroundColor: column.backgroundColor,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {itemsByColumn[idx]}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className={cn('document-layout', className)}
      data-layout-type="document-column"
      data-column-count={validatedColumns?.length || 1}
      data-page-break-before={pageBreakBefore ? "true" : "false"}
      data-page-break-after={pageBreakAfter ? "true" : "false"}
      data-debug-id={dataLayoutId || `docLayout-${Math.random().toString(36).slice(2, 7)}`}
      data-layout-page={dataLayoutPage}
      data-current-page={dataCurrentPage}
      data-total-pages={dataTotalPages}
      {...props}
    >
      {renderColumns()}
    </div>
  );
};

// Set display name explicitly for better component recognition
DocumentLayout.displayName = 'DocumentLayout';

export default DocumentLayout; 