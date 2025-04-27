import { ImageDimensions } from '../components/PageItem/types';
import { processDimensions } from '../utils/dimension-helper';

/**
 * Custom hook for managing element dimensions
 * @param dimensions The dimensions object from props
 * @returns Object with processed dimensions and classes
 */
export function useElementDimensions(dimensions?: ImageDimensions) {
  const { width, height, dimensionClasses } = processDimensions(dimensions);
  
  return {
    width,
    height,
    dimensionClasses,
    hasDefinedDimensions: !!dimensions
  };
} 