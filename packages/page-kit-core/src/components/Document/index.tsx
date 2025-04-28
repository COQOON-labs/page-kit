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

/**
 * Helper function to calculate an item's height based on its type and properties
 * Extracted for better separation of concerns
 */
function calculateItemHeight(
  item: ReactElement, 
  pageMaxWidth = 800
): number {
  if (!isValidElement(item)) {
    return mmToPx(10); // Default 10mm height
  }
  
  const componentType = item.type as any;
  const componentName = componentType?.displayName || '';
  
  console.log(`[PageKit DEBUG] Calculating height for component: ${componentName}`);
  
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
  
  // Special handling for Layout components
  if (componentName === 'DocumentLayout' || componentName === 'PageLayout') {
    // For layout components, calculate the height based on its children
    // We'll use a larger base height to ensure it's more likely to break across pages
    return mmToPx(40); // Increased height to better support pagination
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
    const fontSizePx = ptToPx(fontSize);
    const avgCharWidth = fontSizePx * 0.6;
    const contentWidthPx = pageMaxWidth - (mmToPx(40)); // Assuming 20mm padding on each side
    const charsPerLine = Math.floor(contentWidthPx / avgCharWidth);
    
    // Calculate number of lines
    const contentLength = content.length;
    // Ensure at least 2 lines for short text to prevent underestimation
    const lines = Math.max(2, Math.ceil(contentLength / charsPerLine));
    
    // Calculate height in pixels
    const heightPx = lines * fontSizePx * lineHeight;
    
    // Add more padding for container to prevent clipping
    return heightPx + fontSizePx; // Add extra padding proportional to font size
  }
  
  // For callout items, calculate based on content plus extra space
  if (componentName === 'CalloutItem') {
    // Base height for callout container
    const baseHeight = mmToPx(25); // Increased from 15mm to 25mm for padding/borders
    
    // Calculate content height if there's a child text
    const calloutContent = itemProps.children;
    if (calloutContent) {
      // Create a simpler mock calculation
      if (typeof calloutContent === 'string') {
        // More generous estimation based on content length
        return baseHeight + mmToPx(calloutContent.length / 30);
      }
      return baseHeight + mmToPx(20); // Increased default for complex content
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
   * Optional style object for the document container
   */
  style?: React.CSSProperties;
  
  /**
   * Column definitions to be applied to all pages in the document
   * Page-specific columns will override these if defined
   * Column widths should sum to 100%
   * @deprecated Use the Layout component instead
   */
  columns?: ColumnDefinition[];

  /**
   * Optional error handler for the error boundary
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Base layout information shared by both layout types
 */
interface BaseLayoutInfo {
  columns: ColumnDefinition[];
  items: React.ReactNode[];
  parent: ReactElement | null;
  id?: string;
}

/**
 * Layout information specific to DocumentLayout components
 */
interface DocumentLayoutInfo extends BaseLayoutInfo {
  pageBreakBefore?: boolean;
  pageBreakAfter?: boolean;
}

/**
 * Layout information specific to PageLayout components
 */
type PageLayoutInfo = BaseLayoutInfo;

/**
 * Document component that automatically distributes content across pages
 */
const DocumentContent: React.FC<DocumentProps> = React.memo(({ 
  pageProps = {}, 
  children,
  className = '',
  style,
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
    console.log(`[PageKit DEBUG] Calculating available height with maxWidth: ${maxWidth}px`);
    const height = calculatePageContentHeight(maxWidth, config, true);
    console.log(`[PageKit DEBUG] Available height calculated: ${height}px`);
    return height;
  }, [pageProps.maxWidth, config]);
  
  // Memoize the spacing calculation
  const itemSpacingPx = useMemo(() => 
    mmToPx(config.layout?.itemSpacing || 0),
    [config.layout]
  );
  
  // Helper function to get item height from dimensions
  const getItemHeight = useCallback((item: ReactElement): number => {
    return calculateItemHeight(item, pageProps.maxWidth || 800);
  }, [pageProps.maxWidth]);
  
  // Function to extract Layout components and their related information
  const processLayouts = useCallback((items: React.ReactNode[]): {
    documentLayouts: DocumentLayoutInfo[];
    pageLayouts: PageLayoutInfo[];
    remainingItems: React.ReactNode[];
  } => {
    const documentLayouts: DocumentLayoutInfo[] = [];
    const pageLayouts: PageLayoutInfo[] = [];
    const remainingItems: React.ReactNode[] = [];
    
    console.log('[PageKit DEBUG] Processing layouts for', items.length, 'items');
    
    // First pass: identify Layout components
    items.forEach((item, index) => {
      if (isValidElement(item)) {
        const componentType = item.type as any;
        const componentName = componentType?.displayName || '';
        
        console.log(`[PageKit DEBUG] Checking item ${index}, type: ${componentName}`);
        
        // Add additional checks for layout components
        const isDocumentLayout = 
          componentName === 'DocumentLayout' || 
          (item as any).props?.['data-layout-type'] === 'document-column';
        
        const isPageLayout = 
          componentName === 'PageLayout' || 
          (item as any).props?.['data-layout-type'] === 'page-column';
        
        if (isDocumentLayout) {
          console.log(`[PageKit DEBUG] Found DocumentLayout at index ${index}`);
          // Extract document-level layout
          const layoutProps = item.props as { 
            columns: ColumnDefinition[], 
            children: React.ReactNode,
            pageBreakBefore?: boolean
          };
          const columns = validateColumnWidths(layoutProps.columns, "DocumentLayout") || [];
          
          // Extract children of the layout
          const layoutChildren = React.Children.toArray(layoutProps.children);
          
          documentLayouts.push({
            columns,
            items: layoutChildren,
            parent: item as ReactElement,
            pageBreakBefore: layoutProps.pageBreakBefore ?? true,
            pageBreakAfter: false, // DocumentLayouts don't need explicit pageBreakAfter
            id: `doc-layout-${index}` // Add unique ID based on index
          });
        } else if (isPageLayout) {
          console.log(`[PageKit DEBUG] Found PageLayout at index ${index}`);
          // Extract page-specific layout (doesn't support cross-page flow)
          const layoutProps = item.props as { 
            columns: ColumnDefinition[], 
            children: React.ReactNode
          };
          const columns = validateColumnWidths(layoutProps.columns, "PageLayout") || [];
          
          // Extract children of the layout
          const layoutChildren = React.Children.toArray(layoutProps.children);
          
          pageLayouts.push({
            columns,
            items: layoutChildren,
            parent: item as ReactElement,
            id: `page-layout-${index}` // Add unique ID based on index
          });
        } else {
          // This is a regular item, not a layout
          remainingItems.push(item);
        }
      } else {
        // Non-element nodes (strings, etc.)
        remainingItems.push(item);
      }
    });
    
    // Additional diagnostic info
    if (documentLayouts.length === 0) {
      console.warn('[PageKit DEBUG] No DocumentLayout components found! Check your imports and component structure.');
    } else {
      console.log(`[PageKit DEBUG] Found ${documentLayouts.length} DocumentLayout and ${pageLayouts.length} PageLayout components`);
      documentLayouts.forEach((layout, idx) => {
        console.log(`[PageKit DEBUG] DocumentLayout ${idx} has ${layout.items.length} children`);
      });
    }
    
    return { documentLayouts, pageLayouts, remainingItems };
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
  
  // Function to distribute items within a layout's columns
  const distributeLayoutItems = useCallback((layout: DocumentLayoutInfo, availableHeight: number): React.ReactNode[] => {
    const { columns, items, parent } = layout;
    const columnCount = columns.length;
    
    console.log(`[PageKit DEBUG] Distributing layout items to columns. Available height: ${availableHeight}px`);
    
    // Cannot process invalid parent (should never happen)
    if (!parent || !isValidElement(parent)) {
      console.warn('Invalid layout parent element');
      return [];
    }
    
    // Keep track of which page we're on
    let currentPage = 0;
    const pageLayouts: React.ReactNode[] = [];
    
    // Pages of items, grouped by column
    const pageColumnItems: Array<Array<React.ReactNode[]>> = []; // [page][column][items]
    
    // Initialize first page's columns
    pageColumnItems[0] = Array(columnCount).fill(0).map(() => []);
    
    // Track current height of each column on current page
    let columnHeights = Array(columnCount).fill(0);
    
    console.log(`[PageKit DEBUG] Layout has ${items.length} items to distribute across ${columnCount} columns`);
    
    // Process items with specific column indices first
    items.forEach((item, itemIndex) => {
      if (!isValidElement(item)) {
        // Add non-elements to first column of current page
        pageColumnItems[currentPage][0].push(item);
        return;
      }
      
      try {
        const componentType = (item as ReactElement).type as any;
        const componentName = componentType?.displayName || 'Unknown';
        
        const itemHeight = getItemHeight(item);
        const columnIndex = getItemColumnIndex(item, columnCount);
        
        console.log(`[PageKit DEBUG] Item ${itemIndex} (${componentName}): Height=${itemHeight}px, ColumnIndex=${columnIndex}`);
        
        // Skip invalid column indices
        if (columnIndex < 0 || columnIndex >= columnCount) {
          // Default to first column
          const column = 0;
          const heightWithSpacing = columnHeights[column] > 0 
            ? itemHeight + itemSpacingPx 
            : itemHeight;
          
          // Check if it fits on current page
          if (columnHeights[column] + heightWithSpacing <= availableHeight) {
            // Add to current page
            pageColumnItems[currentPage][column].push(item);
            columnHeights[column] += heightWithSpacing;
            console.log(`[PageKit DEBUG] Item ${itemIndex} fits on page ${currentPage}, column ${column}. New column height: ${columnHeights[column]}px`);
          } else {
            // Start a new page
            currentPage++;
            console.log(`[PageKit DEBUG] Item ${itemIndex} doesn't fit on current page. Starting new page ${currentPage}`);
            
            // Initialize new page columns if needed
            if (!pageColumnItems[currentPage]) {
              pageColumnItems[currentPage] = Array(columnCount).fill(0).map(() => []);
            }
            
            // Reset column heights for new page
            columnHeights = Array(columnCount).fill(0);
            
            // Add item to the new page
            pageColumnItems[currentPage][column].push(item);
            columnHeights[column] = itemHeight;
            console.log(`[PageKit DEBUG] Added item ${itemIndex} to new page ${currentPage}, column ${column}. New column height: ${columnHeights[column]}px`);
          }
          
          return;
        }
        
        // Calculate height with spacing if not first item
        const heightWithSpacing = columnHeights[columnIndex] > 0 
          ? itemHeight + itemSpacingPx 
          : itemHeight;
        
        // Check if this item fits in the current page's column
        if (columnHeights[columnIndex] + heightWithSpacing <= availableHeight) {
          // Fits on current page
          pageColumnItems[currentPage][columnIndex].push(item);
          columnHeights[columnIndex] += heightWithSpacing;
          console.log(`[PageKit DEBUG] Item ${itemIndex} fits on page ${currentPage}, column ${columnIndex}. New column height: ${columnHeights[columnIndex]}px`);
        } else {
          // Doesn't fit - go to next page
          currentPage++;
          console.log(`[PageKit DEBUG] Item ${itemIndex} doesn't fit on current page. Starting new page ${currentPage}`);
          
          // Initialize new page columns if needed
          if (!pageColumnItems[currentPage]) {
            pageColumnItems[currentPage] = Array(columnCount).fill(0).map(() => []);
          }
          
          // Reset column heights for new page
          columnHeights = Array(columnCount).fill(0);
          
          // Add item to the new page
          pageColumnItems[currentPage][columnIndex].push(item);
          columnHeights[columnIndex] = itemHeight;
          console.log(`[PageKit DEBUG] Added item ${itemIndex} to new page ${currentPage}, column ${columnIndex}. New column height: ${columnHeights[columnIndex]}px`);
        }
      } catch (error) {
        console.warn(`[PageKit DEBUG] Error processing layout item ${itemIndex}:`, error);
      }
    });
    
    console.log(`[PageKit DEBUG] Layout distribution complete. Creating ${currentPage + 1} page layouts`);
    
    // Now create layout components for each page
    // IMPORTANT: Instead of nesting items inside a DocumentLayout wrapper,
    // we now just return the items for each page directly so they can be
    // rendered as-is on each page
    const paginatedItems: React.ReactNode[] = [];
    
    for (let pageIndex = 0; pageIndex <= currentPage; pageIndex++) {
      const pageItems = pageColumnItems[pageIndex];
      
      // Check if there are any items on this page
      const hasItems = pageItems.some(column => column.length > 0);
      if (!hasItems) continue;

      // Create direct items for this page with column metadata
      const flattenedItems = pageItems.flatMap((columnItems, colIdx) => {
        return columnItems.map(item => {
          // If the item is a valid element, clone it with columnIndex and metadata
          if (isValidElement(item)) {
            // Add columnIndex to props plus layout metadata
            const newProps = {
              ...item.props,
              columnIndex: colIdx,
              'data-layout-id': layout.id,
              'data-layout-page': pageIndex,
              'data-layout-total-pages': currentPage + 1, 
              key: `${layout.id}-page-${pageIndex}-col-${colIdx}-${Math.random().toString(36).slice(2, 7)}`
            };
            return React.cloneElement(item, newProps);
          }
          return item;
        });
      });

      // Add page break metadata for the Document component
      const pageBreakBefore = pageIndex === 0 ? layout.pageBreakBefore : true;
      const pageBreakAfter = pageIndex === currentPage ? layout.pageBreakAfter : false;
      
      // Create a wrapper with layout metadata but NOT a DocumentLayout component
      // This lets the items be rendered directly on the page
      const pageWrapper = React.createElement(
        'div',
        {
          'data-page-break-before': pageBreakBefore,
          'data-page-break-after': pageBreakAfter,
          'data-layout-id': layout.id,
          'data-layout-page': pageIndex,
          'data-layout-total-pages': currentPage + 1,
          'data-column-count': columnCount,
          className: 'document-layout-items',
          key: `layout-wrapper-${layout.id}-page-${pageIndex}`
        },
        ...flattenedItems
      );
      
      paginatedItems.push(pageWrapper);
    }
    
    console.log(`[PageKit DEBUG] Created ${paginatedItems.length} page item groups from ${currentPage + 1} pages`);
    return paginatedItems;
  }, [getItemHeight, getItemColumnIndex, itemSpacingPx]);
  
  // Distribute items into pages based on their heights - with layout awareness
  useEffect(() => {
    console.log('[PageKit DEBUG] Starting document pagination process');
    
    // Convert to array and filter out null/undefined items
    const childrenArray = Children.toArray(children).filter(Boolean);
    
    if (childrenArray.length === 0) {
      console.log('[PageKit DEBUG] No children to paginate');
      setPages([]);
      return;
    }
    
    console.log(`[PageKit DEBUG] Processing ${childrenArray.length} children items`);
    
    // Process layouts and extract items
    const { documentLayouts, pageLayouts, remainingItems } = processLayouts(childrenArray);
    
    console.log(`[PageKit DEBUG] Found ${documentLayouts.length} document layouts, ${pageLayouts.length} page layouts, and ${remainingItems.length} remaining items`);
    
    // Default to 1 column if no document-level columns defined
    const columnCount = validatedColumns?.length || 1;
    const paginatedPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    
    // Track height for each column separately
    let columnHeights: number[] = Array(columnCount).fill(0);
    
    // Track unassigned items (no specific columnIndex) for each page
    let unassignedItems: React.ReactNode[] = [];
    
    // Process all layouts to get layout components that may span multiple pages
    documentLayouts.forEach((layout, layoutIndex) => {
      // Distribute items within this layout
      const layoutComponents = distributeLayoutItems(layout, availableHeight);
      
      // Process each layout component (each represents a page of the layout)
      layoutComponents.forEach((layoutComponent, componentIndex) => {
        if (isValidElement(layoutComponent)) {
          // We now expect a div wrapper with metadata instead of a DocumentLayout component
          const props = layoutComponent.props;
          
          // Get metadata from the wrapper
          const needsPageBreakBefore = props['data-page-break-before'] === true;
          
          // Handle page break before if needed
          if (needsPageBreakBefore && currentPage.length > 0) {
            paginatedPages.push([...currentPage]);
            currentPage = [];
          }
          
          // Add the unprocessed items to the current page, preserving all children
          const layoutItems = React.Children.toArray(layoutComponent.props.children);
          
          // Create a reference to the layout for column information
          const layoutReference = React.createElement(
            'div',
            {
              'data-layout-reference': 'true',
              'data-column-count': props['data-column-count'] || 1,
              'data-layout-id': props['data-layout-id'],
              key: `layout-ref-${props['data-layout-id']}-${componentIndex}`
            }
          );
          
          // Add the reference first and then the items
          currentPage.push(layoutReference, ...layoutItems);
          
          // Handle page break after
          const needsPageBreakAfter = props['data-page-break-after'] === true;
          if (needsPageBreakAfter && currentPage.length > 0) {
            paginatedPages.push([...currentPage]);
            currentPage = [];
          }
        }
      });
    });
    
    // Add PageLayout components to remainingItems to be processed with regular page content
    // PageLayouts don't span pages and are treated as single page items
    pageLayouts.forEach(layout => {
      if (layout.parent) {
        remainingItems.push(layout.parent);
      }
    });
    
    // Then process remaining regular items
    remainingItems.forEach((item) => {
      if (isValidElement(item)) {
        try {
          // Handle page-specific columns (legacy support)
          const props = item.props as { columns?: ColumnDefinition[] };
          if (props.columns) {
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
          
          const itemHeight = getItemHeight(item);
          const columnIndex = getItemColumnIndex(item, columnCount);
          
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
        const itemHeight = isValidElement(item) ? getItemHeight(item) : mmToPx(10);
        
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
    
    // At the end of the function, log the results
    console.log(`[PageKit DEBUG] Pagination complete. Created ${paginatedPages.length} pages`);
    
    setPages(paginatedPages);
  }, [
    children, 
    availableHeight, 
    itemSpacingPx, 
    getItemHeight, 
    validatedColumns, 
    getItemColumnIndex, 
    processLayouts,
    distributeLayoutItems
  ]);
  
  // Handle empty document
  if (pages.length === 0) {
    return (
      <div ref={documentRef} className={className} style={style}>
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
    <div ref={documentRef} className={className} style={style}>
      {pages.map((pageItems, index) => {
        // Determine if this page has legacy column definition
        const pageSpecificColumns = pageItems.find(item => {
          if (isValidElement(item) && (item.props as any).columns) {
            const componentType = item.type as any;
            const componentName = componentType?.displayName || '';
            return componentName !== 'Layout';
          }
          return false;
        });
        
        // Get column definitions if found
        const legacyColumns = pageSpecificColumns ? 
          validateColumnWidths((pageSpecificColumns as ReactElement).props.columns, `Page ${index + 1}`) : 
          undefined;
          
        // Use legacy columns or document-level columns (for backward compatibility)
        const effectiveColumns = legacyColumns || validatedColumns;
          
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