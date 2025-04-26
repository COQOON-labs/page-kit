import { ReactNode } from 'react';

/**
 * Position of an item on the page (in mm)
 */
export interface PageItemPosition {
  x: number;
  y: number;
}

/**
 * Size of an item on the page (in mm)
 */
export interface PageItemSize {
  width: number;
  height: number;
}

/**
 * Base interface for all items that can be placed on a page
 */
export interface PageItemProps {
  /**
   * Unique identifier for the item
   */
  id?: string;
  /**
   * Position of the item on the page (in mm)
   */
  position?: PageItemPosition;
  /**
   * Size of the item (in mm)
   */
  size?: PageItemSize;
  /**
   * Content to render inside the item
   */
  children?: ReactNode;
  /**
   * Whether the item can be resized
   */
  resizable?: boolean;
  /**
   * Whether the item can be moved
   */
  movable?: boolean;
  /**
   * Z-index for stacking items
   */
  zIndex?: number;
  /**
   * Optional rotation in degrees
   */
  rotation?: number;
  /**
   * Optional additional className
   */
  className?: string;
  /**
   * Optional onClick handler
   */
  onClick?: (event: React.MouseEvent) => void;
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
} 