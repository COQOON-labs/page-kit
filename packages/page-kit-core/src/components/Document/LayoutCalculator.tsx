import React, { ReactElement } from 'react';
import { getColumnHeights, distributeItemsToColumns, ColumnDefinition } from './ColumnManager';

export interface LayoutItem {
  id: string;
  height: number;
  type: string;
  element: ReactElement;
}

export interface PageDimensions {
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Calculates available height within page considering margins
 */
export function getAvailablePageHeight(pageDimensions: PageDimensions): number {
  const { height, margins } = pageDimensions;
  return height - margins.top - margins.bottom;
}

/**
 * Calculates available width within page considering margins
 */
export function getAvailablePageWidth(pageDimensions: PageDimensions): number {
  const { width, margins } = pageDimensions;
  return width - margins.left - margins.right;
}

/**
 * Divides items into pages based on height constraints
 */
export function paginateItems(
  items: LayoutItem[],
  pageDimensions: PageDimensions,
  columnConfig?: ColumnDefinition
): LayoutItem[][] {
  const result: LayoutItem[][] = [];
  const maxHeight = getAvailablePageHeight(pageDimensions);
  
  if (!columnConfig || !columnConfig.columnCount || columnConfig.columnCount <= 1) {
    return paginateSingleColumn(items, maxHeight);
  }
  
  return paginateMultiColumn(items, maxHeight, columnConfig, pageDimensions);
}

/**
 * Paginates items in a single column layout
 */
function paginateSingleColumn(
  items: LayoutItem[],
  maxHeight: number
): LayoutItem[][] {
  const pages: LayoutItem[][] = [];
  let currentPage: LayoutItem[] = [];
  let currentHeight = 0;
  
  for (const item of items) {
    // If item doesn't fit on current page, start a new page
    if (currentHeight + item.height > maxHeight && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }
    
    currentPage.push(item);
    currentHeight += item.height;
  }
  
  // Add remaining items as the last page
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
}

/**
 * Paginates items in a multi-column layout
 */
function paginateMultiColumn(
  items: LayoutItem[],
  maxHeight: number,
  columnConfig: ColumnDefinition,
  pageDimensions: PageDimensions
): LayoutItem[][] {
  const pages: LayoutItem[][] = [];
  let remainingItems = [...items];
  
  const getItemHeight = (item: LayoutItem) => item.height;
  
  while (remainingItems.length > 0) {
    const itemsForCurrentPage: LayoutItem[] = [];
    const columnHeights: number[] = Array(columnConfig.columnCount).fill(0);
    
    // Calculate which items fit on the current page
    for (let i = 0; i < remainingItems.length; i++) {
      const item = remainingItems[i];
      const shortestColumnIndex = getShortestColumnIndex(columnHeights);
      
      // Check if item fits in the shortest column
      if (columnHeights[shortestColumnIndex] + item.height <= maxHeight) {
        itemsForCurrentPage.push(item);
        columnHeights[shortestColumnIndex] += item.height;
      } else {
        // If the column is already too tall, try the next column
        let foundFit = false;
        for (let col = 0; col < columnConfig.columnCount!; col++) {
          if (col !== shortestColumnIndex && columnHeights[col] + item.height <= maxHeight) {
            itemsForCurrentPage.push(item);
            columnHeights[col] += item.height;
            foundFit = true;
            break;
          }
        }
        
        // If we couldn't fit this item, stop adding items
        if (!foundFit) {
          break;
        }
      }
    }
    
    // If we couldn't add any items to the page, add at least one item
    // (this handles cases where a single item is taller than maxHeight)
    if (itemsForCurrentPage.length === 0 && remainingItems.length > 0) {
      itemsForCurrentPage.push(remainingItems[0]);
    }
    
    // Add items to current page and remove them from remaining items
    pages.push(itemsForCurrentPage);
    remainingItems = remainingItems.slice(itemsForCurrentPage.length);
  }
  
  return pages;
}

/**
 * Gets the index of the column with the least height
 */
function getShortestColumnIndex(columnHeights: number[]): number {
  if (columnHeights.length === 0) return 0;
  
  let shortestIndex = 0;
  let shortestHeight = columnHeights[0];
  
  for (let i = 1; i < columnHeights.length; i++) {
    if (columnHeights[i] < shortestHeight) {
      shortestHeight = columnHeights[i];
      shortestIndex = i;
    }
  }
  
  return shortestIndex;
}

/**
 * Organizes items into columns for a page
 */
export function organizePageColumns(
  items: LayoutItem[],
  columnConfig: ColumnDefinition
): Map<number, LayoutItem[]> {
  if (!columnConfig.columnCount || columnConfig.columnCount <= 1) {
    return new Map([[0, items]]);
  }
  
  // Extract ReactElements from LayoutItems for distributeItemsToColumns
  const elements = items.map(item => item.element);
  
  // Create a mapping between elements and their original LayoutItems
  const elementToLayoutItemMap = new Map<ReactElement, LayoutItem>();
  items.forEach(item => {
    elementToLayoutItemMap.set(item.element, item);
  });
  
  // Distribute ReactElements to columns
  const distributedElements = distributeItemsToColumns(
    elements,
    (element) => elementToLayoutItemMap.get(element)?.height || 0,
    columnConfig
  );
  
  // Convert back to LayoutItems
  const result = new Map<number, LayoutItem[]>();
  distributedElements.forEach((elements, column) => {
    const layoutItems = elements.map(element => 
      elementToLayoutItemMap.get(element)!
    );
    result.set(column, layoutItems);
  });
  
  return result;
}

/**
 * Calculates total content height for a page
 */
export function calculatePageContentHeight(
  items: LayoutItem[],
  columnConfig?: ColumnDefinition
): number {
  if (!columnConfig || !columnConfig.columnCount || columnConfig.columnCount <= 1) {
    return items.reduce((sum, item) => sum + item.height, 0);
  }
  
  // Extract ReactElements from LayoutItems for getColumnHeights
  const elements = items.map(item => item.element);
  
  // Create a mapping between elements and their original LayoutItems
  const elementToLayoutItemMap = new Map<ReactElement, LayoutItem>();
  items.forEach(item => {
    elementToLayoutItemMap.set(item.element, item);
  });
  
  const columnHeights = getColumnHeights(
    elements, 
    (element) => elementToLayoutItemMap.get(element)?.height || 0,
    columnConfig
  );
  
  return Math.max(...columnHeights);
} 