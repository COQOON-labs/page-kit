import { ReactNode, CSSProperties } from 'react';
import React from 'react';
import { ColumnDefinition } from '../Page';

/**
 * Image dimensions
 */
export interface ImageDimensions {
  /**
   * Width in mm or CSS units (e.g. '200px', '50%')
   */
  width: number | string;
  /**
   * Height in mm or CSS units (e.g. '200px', '50%')
   */
  height: number | string;
}

/**
 * Base interface for all items that can be placed on a page
 */
export interface PageItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique identifier for the item
   */
  id?: string;
  /**
   * Content to render inside the item
   */
  children?: ReactNode;
  /**
   * Optional additional className
   */
  className?: string;
  /**
   * Optional onClick handler
   */
  onClick?: (event: React.MouseEvent) => void;
  /**
   * Optional inline styles
   */
  style?: CSSProperties;
  /**
   * Optional column index where this item should be placed
   * Only used when the parent Page has columns defined
   */
  columnIndex?: number;
  /**
   * Optional columns definition for a page
   * This is used when the PageItem represents a Page and wants to define columns
   */
  columns?: ColumnDefinition[];
}

/**
 * Text-specific page item properties
 */
export interface TextItemProps extends PageItemProps {
  /**
   * Font size in points
   */
  fontSize?: number;
  /**
   * Font family
   */
  fontFamily?: string;
  /**
   * Font weight
   */
  fontWeight?: 'normal' | 'bold' | number;
  /**
   * Text color
   */
  color?: string;
  /**
   * Text alignment
   */
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Line height
   */
  lineHeight?: number | string;
}

/**
 * Image-specific page item properties
 */
export interface ImageItemProps extends PageItemProps {
  /**
   * Source URL of the image
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt?: string;
  /**
   * How the image should fit within its container
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * Explicit dimensions for the image
   */
  dimensions?: ImageDimensions;
}

/**
 * Shape-specific page item properties
 */
export interface ShapeItemProps extends PageItemProps {
  /**
   * Type of shape
   */
  shapeType: 'rectangle' | 'ellipse' | 'line';
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Border color
   */
  borderColor?: string;
  /**
   * Border width in mm
   */
  borderWidth?: number;
  /**
   * Explicit dimensions for the shape
   */
  dimensions?: ImageDimensions;
}

export interface Dimensions {
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
} 