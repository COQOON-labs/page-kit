import React, { ReactElement } from 'react';

/**
 * Interface for defining column configurations
 */
export interface ColumnDefinition {
  width: number | string;
  gap?: number;
  columnCount?: number;
}

/**
 * Determines the appropriate column for an item based on its index and column configuration
 */
export function getItemColumn(
  index: number,
  columns: ColumnDefinition
): number {
  // If no multi-column setup, always use column 0
  if (!columns.columnCount || columns.columnCount <= 1) {
    return 0;
  }
  
  // Calculate column index based on item index
  return index % columns.columnCount;
}

/**
 * Calculates column width in pixels based on container width and column definition
 */
export function calculateColumnWidth(
  containerWidth: number,
  columns: ColumnDefinition
): number {
  if (!columns.columnCount || columns.columnCount <= 1) {
    return containerWidth;
  }
  
  const gapSize = columns.gap || 20;
  const totalGapWidth = gapSize * (columns.columnCount - 1);
  return (containerWidth - totalGapWidth) / columns.columnCount;
}

/**
 * Calculates the column styles based on column definitions
 */
export function getColumnStyles(
  columns: ColumnDefinition,
  containerWidth: number
): React.CSSProperties {
  if (!columns.columnCount || columns.columnCount <= 1) {
    return { width: '100%' };
  }
  
  const columnWidth = calculateColumnWidth(containerWidth, columns);
  
  return {
    width: `${columnWidth}px`,
    marginRight: `${columns.gap || 20}px`,
  };
}

/**
 * Groups items by their column index
 */
export function groupItemsByColumn(
  items: ReactElement[],
  columns: ColumnDefinition
): Map<number, ReactElement[]> {
  const columnGroups = new Map<number, ReactElement[]>();
  
  // Initialize column groups
  for (let i = 0; i < (columns.columnCount || 1); i++) {
    columnGroups.set(i, []);
  }
  
  // Add items to their respective columns
  items.forEach((item, index) => {
    const columnIndex = getItemColumn(index, columns);
    const columnItems = columnGroups.get(columnIndex) || [];
    columnItems.push(item);
    columnGroups.set(columnIndex, columnItems);
  });
  
  return columnGroups;
}

/**
 * Calculates column heights for a set of items
 */
export function getColumnHeights(
  items: ReactElement[],
  getItemHeight: (item: ReactElement) => number,
  columns: ColumnDefinition
): number[] {
  const columnHeights: number[] = Array((columns.columnCount || 1)).fill(0);
  const columnItems = groupItemsByColumn(items, columns);
  
  // Calculate height for each column
  for (let col = 0; col < (columns.columnCount || 1); col++) {
    const colItems = columnItems.get(col) || [];
    
    columnHeights[col] = colItems.reduce((height, item) => {
      const itemHeight = getItemHeight(item);
      return height + itemHeight;
    }, 0);
  }
  
  return columnHeights;
}

/**
 * Gets the index of the column with the least height
 */
export function getShortestColumnIndex(columnHeights: number[]): number {
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
 * Distributes items to columns using a "shortest column" algorithm
 * for better balance than strict round-robin
 */
export function distributeItemsToColumns(
  items: ReactElement[],
  getItemHeight: (item: ReactElement) => number,
  columns: ColumnDefinition
): Map<number, ReactElement[]> {
  // If single column, no need for complex distribution
  if (!columns.columnCount || columns.columnCount <= 1) {
    return new Map([[0, [...items]]]);
  }
  
  const columnItems = new Map<number, ReactElement[]>();
  const columnHeights: number[] = [];
  
  // Initialize column groups and heights
  for (let i = 0; i < columns.columnCount; i++) {
    columnItems.set(i, []);
    columnHeights.push(0);
  }
  
  // Distribute items to the shortest column
  items.forEach((item) => {
    const shortestColIndex = getShortestColumnIndex(columnHeights);
    const colItems = columnItems.get(shortestColIndex) || [];
    
    // Add item to column
    colItems.push(item);
    columnItems.set(shortestColIndex, colItems);
    
    // Update column height
    columnHeights[shortestColIndex] += getItemHeight(item);
  });
  
  return columnItems;
} 