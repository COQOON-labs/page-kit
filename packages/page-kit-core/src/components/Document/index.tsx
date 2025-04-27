import React, { useState, useEffect, ReactElement, useRef, Children, isValidElement, useMemo } from 'react';
import { Page, PageProps, ColumnDefinition } from '../Page';
import { PageItemProps } from '../PageItem/types';
import { usePageKitConfig } from '../../config';
import { mmToPx, getDimensionInPx } from '../../utils/dimension-helper';
import { calculatePageContentHeight } from '../../utils/layout-helper';
import ErrorBoundary from '../ErrorBoundary';

// Validate column widths
const validateColumns = (columns?: ColumnDefinition[]): ColumnDefinition[] | undefined => {
  if (!columns || columns.length === 0) {
    return undefined;
  }
  
  // Calculate the sum of all widths
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  
  // Validate total width and warn if not 100%
  if (totalWidth !== 100) {
    console.warn(
      `Document columns: Widths should sum to 100%. Current sum is ${totalWidth}%. ` +
      `This may cause unexpected layout behavior.`
    );
  }
  
  return columns;
};

export interface DocumentProps {
  /**
   * Page props to be applied to all pages
   */
  pageProps?: Omit<PageProps, 'pageNumber' | 'totalPages'>;
  
  /**
   * Children elements (page items)
   */
  children: React.ReactNode;
  
  /**
   * Optional className for the document container
   */
  className?: string;
  
  /**
   * Optional error handler for the error boundary
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

  /**
   * Column definitions to be applied to all pages in the document
   * Page-specific columns will override these if defined
   * Column widths should sum to 100%
   */
  columns?: ColumnDefinition[];
}

/**
 * Document component that automatically distributes content across pages
 */
const DocumentContent: React.FC<DocumentProps> = React.memo(({ 
  pageProps = {}, 
  children,
  className = '',
  columns
}) => {
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const config = usePageKitConfig();
  const documentRef = useRef<HTMLDivElement>(null);
  
  // Validate document-level columns
  const validatedColumns = useMemo(() => 
    validateColumns(columns),
    [columns]
  );
  
  // Memoize the available height calculation
  const availableHeight = useMemo(() => {
    const maxWidth = pageProps.maxWidth || 800;
    return calculatePageContentHeight(maxWidth, config, true);
  }, [pageProps.maxWidth, config]);
  
  // Memoize the spacing calculation
  const itemSpacingPx = useMemo(() => 
    mmToPx(config.layout?.itemSpacing || 0),
    [config.layout]
  );
  
  // Helper function to get item height from dimensions
  const getItemHeight = (item: ReactElement): number => {
    if (!isValidElement(item)) {
      return mmToPx(10); // Default 10mm height
    }
    
    const itemProps = item.props as PageItemProps;
    if (itemProps.dimensions?.height) {
      return getDimensionInPx(itemProps.dimensions.height);
    }
    
    // Default height if none specified
    return mmToPx(10); // Default 10mm height
  };
  
  // Distribute items into pages based on their heights
  useEffect(() => {
    const childrenArray = Children.toArray(children);
    const paginatedPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentPageHeight = 0;
    
    // Process each item and distribute them to pages
    childrenArray.forEach((item) => {
      if (isValidElement(item)) {
        const itemHeight = getItemHeight(item);
        
        // Add spacing except for the first item on a page
        const heightWithSpacing = currentPage.length === 0 
          ? itemHeight 
          : itemHeight + itemSpacingPx;
        
        const anticipatedTotalHeight = currentPageHeight + heightWithSpacing;
        
        // Check if item fits on current page
        if (anticipatedTotalHeight <= availableHeight) {
          // Item fits on current page
          currentPage.push(item);
          currentPageHeight = anticipatedTotalHeight;
        } else {
          // Item doesn't fit, start a new page
          if (currentPage.length > 0) {
            paginatedPages.push([...currentPage]);
          }
          currentPage = [item];
          currentPageHeight = itemHeight;
        }
      }
    });
    
    // Add the last page if it has items
    if (currentPage.length > 0) {
      paginatedPages.push(currentPage);
    }
    
    setPages(paginatedPages);
  }, [children, availableHeight, itemSpacingPx]);
  
  return (
    <div ref={documentRef} className={className}>
      {pages.map((pageItems, index) => {
        // Check if any of the page items has a columns prop that would override document columns
        const pageSpecificColumnsItem = pageItems.find(item => {
          if (isValidElement(item) && (item.props as any).columns) {
            return true;
          }
          return false;
        });
        
        // Use page-specific columns if defined, otherwise use document columns
        let effectiveColumns = validatedColumns;
        
        if (pageSpecificColumnsItem) {
          const pageSpecificColumns = (pageSpecificColumnsItem as ReactElement).props.columns;
          // Validate page-specific columns
          if (pageSpecificColumns) {
            const totalWidth = pageSpecificColumns.reduce((sum: number, col: ColumnDefinition) => sum + col.width, 0);
            if (totalWidth !== 100) {
              console.warn(
                `Page ${index + 1} columns: Widths should sum to 100%. Current sum is ${totalWidth}%. ` +
                `This may cause unexpected layout behavior.`
              );
            }
          }
          effectiveColumns = pageSpecificColumns;
        }
          
        return (
          <Page
            key={`page-${index}`}
            {...pageProps}
            columns={effectiveColumns}
            pageNumber={index + 1}
            totalPages={pages.length}
            className={`${pageProps.className || ''} ${index > 0 ? 'mt-8' : ''}`}
          >
            {pageItems}
          </Page>
        );
      })}
    </div>
  );
});

// Set display name
DocumentContent.displayName = 'DocumentContent';

/**
 * Document component with error boundary
 */
export const Document: React.FC<DocumentProps> = ({ onError, ...props }) => {
  return (
    <ErrorBoundary onError={onError}>
      <DocumentContent {...props} />
    </ErrorBoundary>
  );
};

// Set display name
Document.displayName = 'Document';

export default Document; 