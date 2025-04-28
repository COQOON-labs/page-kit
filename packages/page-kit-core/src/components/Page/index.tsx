import React, { useEffect, useState, useRef, createContext, useContext, useMemo, useCallback, ReactElement } from 'react';
import { cn } from '../../utils/react-helper';
import { usePageKitConfig } from '../../config';
import { DIN_A4_WIDTH_MM, DIN_A4_HEIGHT_MM } from '../../utils/dimension-helper';
import { getPaddingValues, formatPaddingCSS, filterDOMProps } from '../../utils/layout-helper';
import { validateColumnWidths, organizeItemsByColumn } from '../../utils/column-helper';

// DIN A4 has an aspect ratio of 1:√2 (height:width)
export const DIN_A4_RATIO = Math.sqrt(2);

// Create a context to provide the current scale factor to all child components
interface PageContextType {
  scale: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  pageNumber?: number;
  totalPages?: number;
  columns?: ColumnDefinition[];
}

const PageContext = createContext<PageContextType>({
  scale: 1,
  width: DIN_A4_WIDTH_MM,
  height: DIN_A4_HEIGHT_MM,
  originalWidth: DIN_A4_WIDTH_MM,
  originalHeight: DIN_A4_HEIGHT_MM,
});

// Hook to consume the page context
export const usePageContext = () => useContext(PageContext);

// Column definition type
export interface ColumnDefinition {
  /**
   * Width of the column relative to the page width (0-100)
   */
  width: number;
  /**
   * Optional gap between columns in mm
   */
  gap?: number;
  /**
   * Optional background color for the column
   */
  backgroundColor?: string;
}

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the page in pixels. The height will be calculated based on DIN A4 ratio.
   */
  maxWidth?: number;
  /**
   * Optional className for styling the page container
   */
  className?: string;
  /**
   * Optional background color of the page
   */
  background?: string;
  /**
   * Optional className for styling the page itself
   */
  pageClassName?: string;
  /**
   * Optional container width in percentage (0-100)
   */
  containerWidth?: number;
  /**
   * Enable or disable page shadow
   */
  shadow?: boolean;
  /**
   * Current page number (for multi-page documents)
   */
  pageNumber?: number;
  /**
   * Total number of pages (for multi-page documents)
   */
  totalPages?: number;
  /**
   * Custom header content
   */
  headerContent?: React.ReactNode;
  /**
   * Custom footer content
   */
  footerContent?: React.ReactNode;
  /**
   * Column definitions for this page
   * Column widths should sum to 100%
   */
  columns?: ColumnDefinition[];
}

/**
 * Page component that renders a DIN A4 page with responsive scaling
 */
export const Page = React.memo(React.forwardRef<HTMLDivElement, PageProps>(
  ({ 
    children, 
    maxWidth = 800, 
    className = '', 
    background, 
    pageClassName = '',
    containerWidth = 100,
    shadow = true,
    pageNumber,
    totalPages,
    headerContent,
    footerContent,
    columns,
    ...props 
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    
    // Get configuration from context
    const config = usePageKitConfig();
    
    // Process columns and provide default if needed - using our centralized utility
    const processedColumns = useMemo(() => 
      validateColumnWidths(columns, "Page"),
      [columns]
    );
    
    // Use configuration values with props as override
    const backgroundColor = background || (config.colors ? config.colors.background : undefined) || 'white';
    
    // Calculate the actual width of the page based on container width
    const actualMaxWidth = (maxWidth * containerWidth) / 100;
    
    // Calculate the height based on DIN A4 ratio
    const pageHeight = actualMaxWidth * DIN_A4_RATIO;
    
    // Get padding values using utility
    const padding = useMemo(() => 
      getPaddingValues(config),
      [config]
    );
    
    // Format padding for CSS
    const paddingCSS = useMemo(() => 
      formatPaddingCSS(padding),
      [padding]
    );
    
    // Filter out non-DOM props
    const domSafeProps = useMemo(() => 
      filterDOMProps(props as Record<string, unknown>, [
        'maxWidth', 'background', 'pageClassName', 'containerWidth',
        'shadow', 'pageNumber', 'totalPages', 'headerContent', 'footerContent',
        'columns'
      ]),
      [props]
    );
    
    // Update scale based on container size
    const updateScale = useCallback(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Calculate scale factor based on the container's width and the page's original width
        const newScale = containerWidth / actualMaxWidth;
        setScale(newScale);
        setContainerSize({
          width: containerWidth,
          height: containerWidth * DIN_A4_RATIO,
        });
      }
    }, [actualMaxWidth]);
    
    useEffect(() => {
      // Initial calculation
      updateScale();
      
      // Add resize listener for responsiveness
      window.addEventListener('resize', updateScale);
      
      return () => {
        window.removeEventListener('resize', updateScale);
      };
    }, [updateScale]);
    
    // Style for the container
    const containerStyle = useMemo(() => ({
      width: `${containerWidth}%`,
      maxWidth: `${actualMaxWidth}px`,
    }), [containerWidth, actualMaxWidth]);
    
    // Style for the actual page
    const pageStyle = useMemo(() => {
      // Base style
      const style: React.CSSProperties = {
        width: `${actualMaxWidth}px`,
        height: `${pageHeight}px`,
        padding: paddingCSS,
        backgroundColor,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'relative',
      };

      // Add page number label for debugging
      if (pageNumber !== undefined) {
        // Add subtle alternating background color for even/odd pages
        if (pageNumber % 2 === 0) {
          style.backgroundColor = 'var(--debug-even-page-color, #f8f8f8)';
        } else {
          style.backgroundColor = 'var(--debug-odd-page-color, #ffffff)';
        }
      }

      return style;
    }, [actualMaxWidth, pageHeight, paddingCSS, backgroundColor, scale, pageNumber]);
    
    // The overall height that accommodates the scaled content
    const scaledHeight = pageHeight * scale;
    
    // Style for the wrapper div that accommodates the scaled page
    const wrapperStyle = useMemo(() => ({
      height: `${scaledHeight}px`,
      width: `${containerSize.width}px`,
    }), [scaledHeight, containerSize.width]);
    
    // Calculate header, footer and content heights
    const headerHeight = config.header?.show ? config.header.height : 0;
    const footerHeight = config.footer?.show ? config.footer.height : 0;
    
    // Determine column layout or default content style
    const contentStyle = useMemo(() => {
      const itemSpacing = config.layout?.itemSpacing || 0;
      
      // Default content style
      const style: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: `${itemSpacing}mm`
      };
      
      // Add contentMaxWidth if available and no columns are defined
      const contentMaxWidth = config.layout?.contentMaxWidth;
      if (contentMaxWidth && !processedColumns.length) {
        style.maxWidth = `${contentMaxWidth}mm`;
        style.margin = '0 auto';
      }
      
      // If columns are defined, use different layout
      if (processedColumns && processedColumns.length > 0) {
        style.flexDirection = 'row';
        style.gap = `${processedColumns[0].gap || itemSpacing}mm`;
      }
      
      return style;
    }, [config.layout, processedColumns]);
    
    // Memoize children array to avoid unnecessary re-renders
    const childrenArray = useMemo(() => 
      React.Children.toArray(children),
      [children]
    );
    
    // Memoize column items distribution
    const columnItems = useMemo(() => {
      if (!processedColumns || processedColumns.length === 0) {
        return null;
      }
      
      return organizeItemsByColumn(processedColumns, childrenArray);
    }, [processedColumns, childrenArray]);
    
    // Render the header component if enabled
    const renderHeader = () => {
      if (!config.header?.show) return null;
      
      const header = config.header;
      
      const headerStyle: React.CSSProperties = {
        height: `${headerHeight}mm`,
        backgroundColor: header.backgroundColor || '#f8f9fa',
        color: header.textColor || '#212529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        marginBottom: `${config.layout?.itemSpacing || 0}mm`
      };
      
      return (
        <div className="page-header" style={headerStyle}>
          {headerContent || <div>Header</div>}
        </div>
      );
    };
    
    // Render the footer component if enabled
    const renderFooter = () => {
      if (!config.footer?.show) return null;
      
      const footer = config.footer;
      
      const footerStyle: React.CSSProperties = {
        height: `${footerHeight}mm`,
        backgroundColor: footer.backgroundColor || '#f8f9fa',
        color: footer.textColor || '#212529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        marginTop: `${config.layout?.itemSpacing || 0}mm`
      };
      
      return (
        <div className="page-footer" style={footerStyle}>
          {footerContent || (
            <>
              <div></div>
              {footer.showPageNumbers && pageNumber && totalPages ? (
                <div>Page {pageNumber} of {totalPages}</div>
              ) : (
                <div></div>
              )}
            </>
          )}
        </div>
      );
    };
    
    // Render column layout if columns are defined - using our extracted function
    const renderContent = () => {
      // If no columns defined, return children directly
      if (!processedColumns || processedColumns.length === 0) {
        return (
          <div className="page-content" style={contentStyle}>
            {children}
          </div>
        );
      }
      
      // Check for layout references to handle DocumentLayout content
      const childArray = React.Children.toArray(children);
      const layoutReferences = childArray.filter(
        child => React.isValidElement(child) && (child as ReactElement).props?.['data-layout-reference'] === 'true'
      ) as ReactElement[];
      
      // If we have layout references, we need to organize items by column
      if (layoutReferences.length > 0) {
        // Get layout reference metadata
        const layoutReference = layoutReferences[0];
        const columnCount = Number(layoutReference.props?.['data-column-count'] || processedColumns.length);
        
        // Create columns array
        const cols: React.ReactNode[][] = Array(columnCount).fill(0).map(() => []);
        
        // Group items by column
        childArray.forEach(child => {
          // Skip layout references
          if (React.isValidElement(child) && (child as ReactElement).props?.['data-layout-reference'] === 'true') {
            return;
          }
          
          if (React.isValidElement(child)) {
            const columnIndex = Number((child as ReactElement).props?.columnIndex || 0);
            if (columnIndex >= 0 && columnIndex < columnCount) {
              cols[columnIndex].push(child);
            } else {
              cols[0].push(child);
            }
          } else {
            cols[0].push(child);
          }
        });
        
        // Render columns with items
        return (
          <div className="page-content columns" style={contentStyle}>
            {Array.from({length: columnCount}).map((_, idx) => {
              const column = processedColumns[idx] || { width: 100 / columnCount };
              
              const columnStyle: React.CSSProperties = {
                width: `${column.width}%`,
                backgroundColor: column.backgroundColor,
                display: 'flex',
                flexDirection: 'column',
                gap: `${config.layout?.itemSpacing || 0}mm`
              };
              
              return (
                <div key={`column-${idx}`} className="page-column" style={columnStyle}>
                  {cols[idx]}
                </div>
              );
            })}
          </div>
        );
      }
      
      // If we don't have layout references, use the standard column organization
      return (
        <div className="page-content columns" style={contentStyle}>
          {processedColumns.map((column, idx) => {
            const columnStyle: React.CSSProperties = {
              width: `${column.width}%`,
              backgroundColor: column.backgroundColor,
              display: 'flex',
              flexDirection: 'column',
              gap: `${config.layout?.itemSpacing || 0}mm`
            };
            
            return (
              <div key={`column-${idx}`} className="page-column" style={columnStyle}>
                {columnItems?.[idx]}
              </div>
            );
          })}
        </div>
      );
    };
    
    // Create memoized page context value to prevent unnecessary re-renders
    const pageContextValue = useMemo(() => ({
      scale, 
      width: actualMaxWidth, 
      height: pageHeight,
      originalWidth: DIN_A4_WIDTH_MM,
      originalHeight: DIN_A4_HEIGHT_MM,
      pageNumber,
      totalPages,
      columns: processedColumns
    }), [scale, actualMaxWidth, pageHeight, pageNumber, totalPages, processedColumns]);
    
    // Add a debug element to show page number and dimensions
    const DebugInfo = pageNumber !== undefined ? (
      <div 
        style={{
          position: 'absolute',
          top: '2mm',
          right: '2mm',
          background: 'rgba(0,0,0,0.1)',
          color: 'rgba(0,0,0,0.6)',
          padding: '1mm 2mm',
          borderRadius: '2mm',
          fontSize: '8pt',
          fontWeight: 'bold',
          zIndex: 1000,
          pointerEvents: 'none'
        }}
      >
        Page {pageNumber} of {totalPages}
      </div>
    ) : null;
    
    return (
      <div 
        ref={ref}
        {...domSafeProps}
        className={cn('page-container', className)}
        style={containerStyle}
      >
        <div 
          className="page-scaling-wrapper"
          style={wrapperStyle}
        >
          <div
            ref={containerRef}
            className={cn(
              'page', 
              'overflow-hidden',
              shadow && 'shadow-lg',
              pageClassName
            )}
            style={pageStyle}
          >
            <PageContext.Provider value={pageContextValue}>
              {DebugInfo}
              {renderHeader()}
              {renderContent()}
              {renderFooter()}
            </PageContext.Provider>
          </div>
        </div>
      </div>
    );
  }
));

// Set display name
Page.displayName = 'Page';

export default Page;

export const UnstyledPage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

UnstyledPage.displayName = 'UnstyledPage';

export * from './Header';
export * from './Footer'; 