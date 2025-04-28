import React from 'react';
import { ColumnDefinition } from "../components/Page";

/**
 * Validates column definitions to ensure their widths sum to 100%
 * @param columns Column definitions to validate
 * @param source Optional source identifier for error messages (e.g., "Document", "Page")
 * @returns The original columns if valid, or a default single column if null/empty
 */
export function validateColumnWidths(
  columns?: ColumnDefinition[],
  source = "Component"
): ColumnDefinition[] {
  // Default to single column if no columns provided
  if (!columns || columns.length === 0) {
    return [{ width: 100 }];
  }
  
  // Validate that all columns have valid width values
  const invalidColumns = columns.filter(
    col => typeof col.width !== 'number' || isNaN(col.width) || col.width <= 0
  );
  
  if (invalidColumns.length > 0) {
    console.error(
      `${source} columns: ${invalidColumns.length} column(s) have invalid width values. ` +
      `Width must be a positive number.`
    );
    return [{ width: 100 }]; // Fallback to safe default
  }
  
  // Calculate the sum of all widths
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  
  // Validate total width and warn if not 100%
  if (Math.abs(totalWidth - 100) > 0.01) { // Allow for tiny floating point differences
    console.warn(
      `${source} columns: Widths should sum to 100%. Current sum is ${totalWidth.toFixed(2)}%. ` +
      `This may cause unexpected layout behavior.`
    );
  }
  
  return columns;
}

/**
 * Organizes React children into columns based on their columnIndex property
 * @param columns Column definitions
 * @param children React children to organize
 * @returns An array of arrays, where each inner array contains the items for a column
 */
export function organizeItemsByColumn(
  columns: ColumnDefinition[],
  children: React.ReactNode[]
): React.ReactNode[][] {
  const columnCount = columns.length;
  
  // Create arrays for each column
  const columnItems: React.ReactNode[][] = Array(columnCount)
    .fill(null)
    .map(() => []);
  
  // Items without a columnIndex or with invalid index
  const remainingItems: React.ReactNode[] = [];
  
  // First pass: organize items with specific columnIndex
  children.forEach((item) => {
    if (React.isValidElement(item) && typeof item.props.columnIndex === 'number') {
      const colIndex = item.props.columnIndex;
      // Only add to column if the index is valid
      if (colIndex >= 0 && colIndex < columnCount) {
        columnItems[colIndex].push(item);
      } else {
        // If column index is invalid, add to remaining items
        remainingItems.push(item);
      }
    } else {
      // Items without columnIndex are added to remaining items
      remainingItems.push(item);
    }
  });
  
  // Second pass: distribute remaining items evenly across columns
  if (remainingItems.length > 0) {
    const itemsPerColumn = Math.ceil(remainingItems.length / columnCount);
    
    remainingItems.forEach((item, idx) => {
      const targetColIndex = Math.floor(idx / itemsPerColumn);
      // Make sure we don't exceed column count
      const safeColIndex = Math.min(targetColIndex, columnCount - 1);
      columnItems[safeColIndex].push(item);
    });
  }
  
  return columnItems;
} 