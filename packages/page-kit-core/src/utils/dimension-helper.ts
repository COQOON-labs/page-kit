import { ImageDimensions } from '../components/PageItem/types';

/**
 * Convert mm to pixels based on standard DPI
 * @param mm Value in millimeters
 * @returns Value in pixels
 */
export function mmToPx(mm: number): number {
  // Standard DPI for screens is 96 dpi
  // 1 inch = 25.4 mm, so 1 mm = 96/25.4 ≈ 3.78 pixels
  return mm * (96 / 25.4);
}

/**
 * Convert points to pixels
 * @param pt Value in points
 * @returns Value in pixels
 */
export function ptToPx(pt: number): number {
  // 1pt ≈ 1.33px
  return pt * 1.33;
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
  if (!dimensions) {
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
  if (!dimensions) return {};
  
  const { width, height } = processDimensions(dimensions);
  
  return {
    width,
    height
  };
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