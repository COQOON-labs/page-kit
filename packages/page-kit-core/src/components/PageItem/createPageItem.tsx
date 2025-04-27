import React from 'react';
import { cn } from '../../utils/react-helper';
import { PageItemProps } from './types';
import { PageItem } from './PageItem';
import { useElementDimensions } from '../../hooks';

/**
 * Options for creating a new page item component
 */
export interface CreatePageItemOptions<P extends PageItemProps = PageItemProps> {
  /**
   * The component's display name
   */
  displayName: string;
  
  /**
   * Base CSS class for the component
   */
  baseClassName: string;
  
  /**
   * Optional render function to customize the content
   * If not provided, children will be rendered directly
   */
  renderContent?: (props: P, dimensionInfo: ReturnType<typeof useElementDimensions>) => React.ReactNode;
  
  /**
   * Optional function to extract additional classes
   */
  getAdditionalClasses?: (props: P) => string;
  
  /**
   * Optional function to generate styles
   */
  getStyles?: (props: P) => React.CSSProperties;
  
  /**
   * Default props to merge
   */
  defaultProps?: Partial<P>;
}

/**
 * Factory function to create custom page item components
 * 
 * @example
 * ```tsx
 * const ButtonItem = createPageItem({
 *   displayName: 'ButtonItem',
 *   baseClassName: 'page-button-item',
 *   renderContent: (props) => (
 *     <button className="px-4 py-2 text-white bg-blue-500 rounded">
 *       {props.children}
 *     </button>
 *   ),
 *   defaultProps: { 
 *     color: 'blue'
 *   }
 * });
 * ```
 */
export function createPageItem<P extends PageItemProps>(options: CreatePageItemOptions<P>) {
  const {
    displayName,
    baseClassName,
    renderContent,
    getAdditionalClasses,
    getStyles,
    defaultProps
  } = options;
  
  // Create the component
  const CustomPageItem = React.forwardRef<HTMLDivElement, P>((props, ref) => {
    // Merge default props
    const mergedProps = { ...defaultProps, ...props } as P;
    const { className, dimensions, children, ...rest } = mergedProps;
    
    // Handle dimensions
    const dimensionInfo = useElementDimensions(dimensions);
    const { dimensionClasses } = dimensionInfo;
    
    // Get additional classes and styles
    const additionalClasses = getAdditionalClasses ? getAdditionalClasses(mergedProps) : '';
    const customStyles = getStyles ? getStyles(mergedProps) : {};
    
    return (
      <PageItem
        ref={ref}
        className={cn(baseClassName, dimensionClasses, additionalClasses, className)}
        style={customStyles}
        {...rest}
      >
        {renderContent ? renderContent(mergedProps, dimensionInfo) : children}
      </PageItem>
    );
  });
  
  // Set display name
  CustomPageItem.displayName = displayName;
  
  return CustomPageItem;
} 