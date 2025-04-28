import React, { useState, useEffect, ReactElement, useRef, Children, isValidElement, useMemo, useCallback } from 'react';
import { Page, PageProps, ColumnDefinition } from '../Page';
import { PageItemProps, ImageDimensions, TextItemProps } from '../PageItem/types';
import { usePageKitConfig } from '../../config';
import { mmToPx, getDimensionInPx, ptToPx } from '../../utils/dimension-helper';
import { calculatePageContentHeight } from '../../utils/layout-helper';
import { validateColumnWidths } from '../../utils/column-helper';
import ErrorBoundary from '../ErrorBoundary';

// Interface for props that might have dimensions
interface ItemWithDimensions {
  dimensions?: ImageDimensions;
}

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
   * Column definitions to be applied to all pages in the document
   * Page-specific columns will override these if defined
   * Column widths should sum to 100%
   */
  columns?: ColumnDefinition[];

  /**
   * Optional error handler for the error boundary
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
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
  
  // Validate document-level columns using our utility function
  const validatedColumns = useMemo(() => 
    validateColumnWidths(columns, "Document"),
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
  const getItemHeight = useCallback((item: ReactElement): number => {
    if (!isValidElement(item)) {
      return mmToPx(10); // Default 10mm height
    }
    
    const componentType = item.type as any;
    const componentName = componentType?.displayName || '';
    
    // Cast to a type that might have dimensions
    const itemProps = item.props as PageItemProps & ItemWithDimensions;
    
    // Handle explicit dimensions if provided (for backward compatibility)
    if (itemProps.dimensions?.height) {
      const height = getDimensionInPx(itemProps.dimensions.height);
      
      // Validate height to ensure it's positive
      if (isNaN(height) || height <= 0) {
        console.warn(`Item has invalid height: ${itemProps.dimensions.height}. Using calculated height.`);
        // Fall through to calculated height
      } else {
        return height;
      }
    }
    
    // Calculate height for text items (ParagraphItem, HeadingItem, TextItem)
    if (
      componentName === 'TextItem' || 
      componentName === 'ParagraphItem' || 
      componentName === 'HeadingItem'
    ) {
      // Cast to TextItemProps for proper typing
      const textProps = item.props as TextItemProps;
      
      // Get text properties
      const fontSize = textProps.fontSize || 12; // Default font size
      const lineHeight = typeof textProps.lineHeight === 'number' 
        ? textProps.lineHeight 
        : 1.5; // Default line height
      
      // Get the actual content
      let content = '';
      if (typeof textProps.children === 'string') {
        content = textProps.children;
      } else if (Array.isArray(textProps.children)) {
        // Flatten children array to get all text content
        content = React.Children.toArray(textProps.children)
          .filter(child => typeof child === 'string')
          .join(' ');
      }
      
      // Calculate approximate characters per line (assuming average char width is 60% of font height)
      const maxWidth = pageProps.maxWidth || 800;
      const fontSizePx = ptToPx(fontSize);
      const avgCharWidth = fontSizePx * 0.6;
      const contentWidthPx = maxWidth - (mmToPx(40)); // Assuming 20mm padding on each side
      const charsPerLine = Math.floor(contentWidthPx / avgCharWidth);
      
      // Calculate number of lines
      const contentLength = content.length;
      const lines = Math.max(1, Math.ceil(contentLength / charsPerLine));
      
      // Calculate height in pixels
      const heightPx = lines * fontSizePx * lineHeight;
      
      // Add some padding for container and return
      return heightPx + 10; // Adding 10px padding
    }
    
    // For callout items, calculate based on content plus extra space
    if (componentName === 'CalloutItem') {
      // Base height for callout container
      const baseHeight = mmToPx(15); // Starting with 15mm for padding/borders
      
      // Calculate content height if there's a child text
      const calloutContent = itemProps.children;
      if (calloutContent) {
        // Create a simpler mock calculation
        if (typeof calloutContent === 'string') {
          // Rough estimation based on content length
          return baseHeight + mmToPx(calloutContent.length / 50);
        }
        return baseHeight + mmToPx(10); // Default for complex content
      }
      
      return baseHeight;
    }
    
    // For other item types
    // Use a height estimation based on component type
    switch (componentName) {
      case 'ShapeItem':
        return mmToPx(15); // Default shape height
      case 'ImageItem':
        return mmToPx(50); // Default image height
      case 'TableItem': {
        // For tables, estimate based on approximate rows
        // Safely access rows if available
        const tableProps = item.props as any;
        const rowCount = tableProps.rows?.length || 3;
        return mmToPx(10 + rowCount * 8);
      }
      default:
        return mmToPx(20); // Default height for unknown components
    }
  }, [pageProps.maxWidth]);
  
  // Function to find page-specific column definitions
  const findPageSpecificColumns = useCallback((pageItems: React.ReactNode[]): ColumnDefinition[] | undefined => {
    const pageSpecificColumnsItem = pageItems.find(item => {
      if (isValidElement(item) && (item.props as any).columns) {
        return true;
      }
      return false;
    });
    
    if (pageSpecificColumnsItem) {
      const pageSpecificColumns = (pageSpecificColumnsItem as ReactElement).props.columns;
      // Validate page-specific columns
      return validateColumnWidths(pageSpecificColumns, `Page ${pageItems.indexOf(pageSpecificColumnsItem) + 1}`);
    }
    
    return undefined;
  }, []);
  
  // Helper to get column index from an item
  const getItemColumnIndex = useCallback((item: ReactElement, columnCount: number): number => {
    try {
      const props = item.props as { columnIndex?: number };
      if (props.columnIndex !== undefined && typeof props.columnIndex === 'number') {
        // Make sure it's a valid column index
        if (props.columnIndex >= 0 && props.columnIndex < columnCount) {
          return props.columnIndex;
        }
      }
    } catch (error) {
      console.warn('Error checking columnIndex:', error);
    }
    return -1; // -1 means no specific column (will be auto-assigned)
  }, []);
  
  // Distribute items into pages based on their heights - with column awareness
  useEffect(() => {
    // Convert to array and filter out null/undefined items
    const childrenArray = Children.toArray(children).filter(Boolean);
    
    if (childrenArray.length === 0) {
      setPages([]);
      return;
    }
    
    // Default to 1 column if no columns defined
    const columnCount = validatedColumns?.length || 1;
    const paginatedPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    
    // Track height for each column separately
    let columnHeights: number[] = Array(columnCount).fill(0);
    
    // Track unassigned items (no specific columnIndex) for each page
    let unassignedItems: React.ReactNode[] = [];
    
    // Process each item and distribute them across columns and pages
    childrenArray.forEach((item) => {
      if (isValidElement(item)) {
        try {
          // Check if this item defines page-specific columns
          const props = item.props as { columns?: ColumnDefinition[] };
          if (props.columns) {
            // If we have content on the current page, finalize it
            if (currentPage.length > 0 || unassignedItems.length > 0) {
              // Add unassigned items to the page first
              currentPage = [...currentPage, ...unassignedItems];
              unassignedItems = [];
              
              paginatedPages.push([...currentPage]);
              currentPage = [];
            }
            
            // Add the item that defines columns to the new page
            currentPage.push(item);
            
            // Reset column heights for the new page with the new column count
            const newColumnCount = validateColumnWidths(props.columns, "Page")?.length || 1;
            columnHeights = Array(newColumnCount).fill(0);
            return;
          }
          
          const itemHeight = getItemHeight(item as ReactElement);
          const columnIndex = getItemColumnIndex(item as ReactElement, columnCount);
          
          // Handle item with specific column index
          if (columnIndex >= 0) {
            // Calculate height with spacing
            const heightWithSpacing = columnHeights[columnIndex] === 0 
              ? itemHeight 
              : itemHeight + itemSpacingPx;
            
            // Check if item fits in its assigned column
            if (columnHeights[columnIndex] + heightWithSpacing <= availableHeight) {
              // Item fits in the current page and column
              currentPage.push(item);
              columnHeights[columnIndex] += heightWithSpacing;
            } else {
              // This column is full, start a new page
              
              // Add any unassigned items to the current page before finalizing
              if (unassignedItems.length > 0) {
                currentPage = [...currentPage, ...unassignedItems];
                unassignedItems = [];
              }
              
              // Finish the current page
              if (currentPage.length > 0) {
                paginatedPages.push([...currentPage]);
              }
              
              // Start a new page with this item
              currentPage = [item];
              columnHeights = Array(columnCount).fill(0);
              columnHeights[columnIndex] = itemHeight;
            }
          } else {
            // For items without a specific column, collect them to distribute later
            unassignedItems.push(item);
          }
        } catch (error) {
          console.warn('Error processing item:', error);
        }
      }
    });
    
    // Distribute any remaining unassigned items across columns
    if (unassignedItems.length > 0) {
      // Calculate how many items can fit in each column based on current heights
      let itemsAdded = 0;
      let failSafe = 0; // Prevent infinite loops
      const maxFailSafe = unassignedItems.length * 2; // Reasonable limit
      
      while (itemsAdded < unassignedItems.length && failSafe < maxFailSafe) {
        failSafe++;
        
        // Find the column with the least height
        const minHeightColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Get the next unassigned item
        const item = unassignedItems[itemsAdded];
        const itemHeight = isValidElement(item) ? getItemHeight(item as ReactElement) : mmToPx(10);
        
        // Calculate height with spacing if needed
        const heightWithSpacing = columnHeights[minHeightColumnIndex] === 0 
          ? itemHeight 
          : itemHeight + itemSpacingPx;
        
        // Check if it fits in the current page's least-filled column
        if (columnHeights[minHeightColumnIndex] + heightWithSpacing <= availableHeight) {
          // Add it to the current page
          currentPage.push(item);
          columnHeights[minHeightColumnIndex] += heightWithSpacing;
          itemsAdded++;
        } else {
          // Start a new page if remaining items don't fit
          if (currentPage.length > 0) {
            paginatedPages.push([...currentPage]);
          }
          
          // Restart column tracking for the new page
          columnHeights = Array(columnCount).fill(0);
          currentPage = [];
          
          // We'll try again with a fresh page
        }
      }
      
      // Handle any truly unassignable items (should be rare)
      if (itemsAdded < unassignedItems.length) {
        const remainingItems = unassignedItems.slice(itemsAdded);
        currentPage = [...currentPage, ...remainingItems];
      }
    }
    
    // Add the last page if it has items
    if (currentPage.length > 0) {
      paginatedPages.push(currentPage);
    }
    
    setPages(paginatedPages);
  }, [children, availableHeight, itemSpacingPx, getItemHeight, validatedColumns, getItemColumnIndex]);
  
  // Handle empty document
  if (pages.length === 0) {
    return (
      <div ref={documentRef} className={className}>
        <Page
          {...pageProps}
          pageNumber={1}
          totalPages={1}
          className={`${pageProps.className || ''}`}
        >
          <div className="py-4 text-center text-gray-500">
            No content to display
          </div>
        </Page>
      </div>
    );
  }
  
  return (
    <div ref={documentRef} className={className}>
      {pages.map((pageItems, index) => {
        // Determine effective columns for this page
        const pageSpecificColumns = findPageSpecificColumns(pageItems);
        const effectiveColumns = pageSpecificColumns || validatedColumns;
          
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
 * Document component that automatically distributes content across pages
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