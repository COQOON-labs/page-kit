import { ImageDimensions } from '../components/PageItem/types';

// Constants
export const DPI = 96; // Standard display DPI
export const MM_PER_INCH = 25.4;

// DIN A4 standard dimensions
export const DIN_A4_WIDTH_MM = 210;
export const DIN_A4_HEIGHT_MM = 297;

/**
 * Convert mm to pixels based on standard DPI
 * @param mm Value in millimeters
 * @returns Value in pixels
 */
export function mmToPx(mm: number): number {
  if (typeof mm !== 'number' || isNaN(mm)) {
    console.warn(`Invalid mm value provided to mmToPx: ${mm}`);
    return 0;
  }
  
  // 1 inch = 25.4 mm, so 1 mm = 96/25.4 ≈ 3.78 pixels at 96 DPI
  return mm * (DPI / MM_PER_INCH);
}

/**
 * Convert pixels to mm
 * @param px Value in pixels
 * @returns Value in millimeters
 */
export function pxToMm(px: number): number {
  if (typeof px !== 'number' || isNaN(px)) {
    console.warn(`Invalid px value provided to pxToMm: ${px}`);
    return 0;
  }
  
  return px * (MM_PER_INCH / DPI);
}

/**
 * Convert points to pixels
 * @param pt Value in points
 * @returns Value in pixels
 */
export function ptToPx(pt: number): number {
  if (typeof pt !== 'number' || isNaN(pt)) {
    console.warn(`Invalid pt value provided to ptToPx: ${pt}`);
    return 0;
  }
  
  // 1pt ≈ 1.33px
  return pt * 1.33;
}

/**
 * Validate dimensions to ensure they are usable
 * @param dimensions The dimensions object to validate
 * @returns True if dimensions are valid
 */
export function validateDimensions(dimensions?: ImageDimensions): boolean {
  if (!dimensions) return false;
  
  const { width, height } = dimensions;
  
  // Check if either dimension is missing
  if (width === undefined || height === undefined) {
    return false;
  }
  
  // For numeric values, ensure they're positive
  if (typeof width === 'number' && (isNaN(width) || width <= 0)) {
    return false;
  }
  
  if (typeof height === 'number' && (isNaN(height) || height <= 0)) {
    return false;
  }
  
  // For string values, try to parse as numbers
  if (typeof width === 'string') {
    const numWidth = parseFloat(width);
    if (isNaN(numWidth) || numWidth <= 0) {
      return false;
    }
  }
  
  if (typeof height === 'string') {
    const numHeight = parseFloat(height);
    if (isNaN(numHeight) || numHeight <= 0) {
      return false;
    }
  }
  
  return true;
}

/**
 * Process dimensions to generate style values
 * @param dimensions Dimensions object containing width and height
 * @returns Processed width and height as CSS-compatible strings
 */
export function processDimensions(dimensions?: ImageDimensions): {
  width: string | undefined;
  height: string | undefined;
  dimensionClasses: string;
} {
  if (!dimensions || !validateDimensions(dimensions)) {
    return { width: undefined, height: undefined, dimensionClasses: '' };
  }

  const widthValue = typeof dimensions.width === 'number'
    ? `${mmToPx(dimensions.width)}px`
    : dimensions.width;

  const heightValue = typeof dimensions.height === 'number'
    ? `${mmToPx(dimensions.height)}px`
    : dimensions.height;

  return {
    width: widthValue,
    height: heightValue,
    dimensionClasses: `w-[${widthValue}] h-[${heightValue}]`
  };
}

/**
 * Generate style object from dimensions
 * @param dimensions Dimensions object 
 * @returns Style object for direct application to elements
 */
export function dimensionsToStyle(dimensions?: ImageDimensions): React.CSSProperties {
  if (!dimensions || !validateDimensions(dimensions)) return {};
  
  const { width, height } = processDimensions(dimensions);
  
  return {
    width,
    height
  };
}

/**
 * Extract numeric dimension value in pixels
 * @param dimension Dimension value in mm or px string
 * @returns Numeric pixel value
 */
export function getDimensionInPx(dimension: number | string | undefined): number {
  if (dimension === undefined) {
    return 0;
  }
  
  if (typeof dimension === 'number') {
    return mmToPx(dimension);
  }
  
  // Handle string values with units
  if (typeof dimension === 'string') {
    if (dimension.endsWith('px')) {
      return parseFloat(dimension);
    }
    if (dimension.endsWith('mm')) {
      return mmToPx(parseFloat(dimension));
    }
    // Default: try to parse as number
    return parseFloat(dimension);
  }
  
  return 0;
}

/**
 * Generate dimension class names based on provided dimensions
 * @param width Width value in mm
 * @param height Height value in mm
 * @returns CSS class name string
 */
export function getDimensionClasses(width: number | string, height: number | string): string {
  return `w-[${typeof width === 'number' ? `${mmToPx(width as number)}px` : width}] h-[${typeof height === 'number' ? `${mmToPx(height as number)}px` : height}]`;
} 