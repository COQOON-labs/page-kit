import { ReactNode, CSSProperties } from 'react';

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
export interface PageItemProps {
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
   * Explicit dimensions for the item
   */
  dimensions?: ImageDimensions;
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
  /**
   * Explicit dimensions for the text element
   */
  dimensions?: ImageDimensions;
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