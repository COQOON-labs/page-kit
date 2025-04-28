import React, { ReactElement, isValidElement } from 'react';
import { mmToPx } from '../../utils/dimension-helper';
import { ColumnDefinition } from '../Page';

/**
 * Process layout items and organize them into pages respecting available height
 * This is an extracted utility to keep pagination logic separate from component rendering
 */
export function distributeLayoutItemsToPages(
  layout: {
    columns: ColumnDefinition[];
    items: React.ReactNode[];
    parent: ReactElement | null;
    pageBreakBefore?: boolean;
    pageBreakAfter?: boolean;
    id?: string;
  }, 
  availableHeight: number,
  getItemHeight: (item: ReactElement) => number,
  getItemColumnIndex: (item: ReactElement, columnCount: number) => number,
  itemSpacingPx: number
): React.ReactNode[] {
  const { columns, items, parent } = layout;
  const columnCount = columns.length;
  
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
  
  // Process items with specific column indices first
  items.forEach(item => {
    if (!isValidElement(item)) {
      // Add non-elements to first column of current page
      pageColumnItems[currentPage][0].push(item);
      return;
    }
    
    try {
      const itemHeight = getItemHeight(item);
      const columnIndex = getItemColumnIndex(item, columnCount);
      
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
        } else {
          // Start a new page
          currentPage++;
          
          // Initialize new page columns if needed
          if (!pageColumnItems[currentPage]) {
            pageColumnItems[currentPage] = Array(columnCount).fill(0).map(() => []);
          }
          
          // Reset column heights for new page
          columnHeights = Array(columnCount).fill(0);
          
          // Add item to the new page
          pageColumnItems[currentPage][column].push(item);
          columnHeights[column] = itemHeight;
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
      } else {
        // Doesn't fit - go to next page
        currentPage++;
        
        // Initialize new page columns if needed
        if (!pageColumnItems[currentPage]) {
          pageColumnItems[currentPage] = Array(columnCount).fill(0).map(() => []);
        }
        
        // Reset column heights for new page
        columnHeights = Array(columnCount).fill(0);
        
        // Add item to the new page
        pageColumnItems[currentPage][columnIndex].push(item);
        columnHeights[columnIndex] = itemHeight;
      }
    } catch (error) {
      console.warn('Error processing layout item:', error);
    }
  });
  
  // Now create layout components for each page
  for (let pageIndex = 0; pageIndex <= currentPage; pageIndex++) {
    const pageItems = pageColumnItems[pageIndex];
    
    // Create column divs for this page
    const wrappedColumns = columns.map((column, colIdx) => {
      return React.createElement(
        'div',
        { 
          key: `layout-column-${colIdx}`,
          className: 'page-layout-column',
          style: {
            width: `${column.width}%`,
            backgroundColor: column.backgroundColor,
            display: 'flex',
            flexDirection: 'column',
            gap: `${itemSpacingPx}px`
          },
          'data-column-index': colIdx
        },
        pageItems[colIdx]
      );
    });
    
    // Set page break before only on first page if requested
    const pageBreakBefore = pageIndex === 0 ? layout.pageBreakBefore : true;
    
    // Set page break after only on last page if requested
    const pageBreakAfter = pageIndex === currentPage ? layout.pageBreakAfter : false;
    
    // Create layout element with columns for this page
    const layoutProps: any = {
      pageBreakBefore,
      pageBreakAfter,
      'data-layout-page': pageIndex,
      'data-layout-id': layout.id || Math.random().toString(36).substring(2, 9),
      columns: columns,
      className: parent.props && typeof parent.props === 'object' && 'className' in parent.props 
        ? parent.props.className 
        : '',
      key: `layout-${layout.id || Math.random().toString(36).substring(2, 9)}-page-${pageIndex}`
    };
    
    // Create a fresh Layout component instead of cloning
    const layoutElement = React.createElement(
      parent.type,
      layoutProps,
      ...wrappedColumns
    );
    
    pageLayouts.push(layoutElement);
  }
  
  return pageLayouts;
} 