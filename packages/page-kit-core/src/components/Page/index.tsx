import React, { useEffect, useState, useRef, createContext, useContext, useMemo } from 'react';
import { cn } from '../../utils/react-helper';
import { usePageKitConfig } from '../../config';
import { DIN_A4_WIDTH_MM, DIN_A4_HEIGHT_MM } from '../../utils/dimension-helper';
import { getPaddingValues, formatPaddingCSS, filterDOMProps } from '../../utils/layout-helper';

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
    ...props 
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    
    // Get configuration from context
    const config = usePageKitConfig();
    
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
        'shadow', 'pageNumber', 'totalPages', 'headerContent', 'footerContent'
      ]),
      [props]
    );
    
    useEffect(() => {
      const updateScale = () => {
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
      };
      
      // Initial calculation
      updateScale();
      
      // Add resize listener for responsiveness
      window.addEventListener('resize', updateScale);
      
      return () => {
        window.removeEventListener('resize', updateScale);
      };
    }, [actualMaxWidth]);
    
    // Style for the container
    const containerStyle = useMemo(() => ({
      width: `${containerWidth}%`,
      maxWidth: `${actualMaxWidth}px`,
    }), [containerWidth, actualMaxWidth]);
    
    // Style for the actual page
    const pageStyle = useMemo(() => ({
      width: `${actualMaxWidth}px`,
      height: `${pageHeight}px`,
      padding: paddingCSS,
      backgroundColor,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      display: 'flex',
      flexDirection: 'column' as const,
    }), [actualMaxWidth, pageHeight, paddingCSS, backgroundColor, scale]);
    
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
    
    // Style for the content area
    const contentStyle = useMemo(() => {
      const itemSpacing = config.layout?.itemSpacing || 0;
      
      // Default content style
      const style: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: `${itemSpacing}mm`
      };
      
      // Add contentMaxWidth if available
      const contentMaxWidth = config.layout?.contentMaxWidth;
      if (contentMaxWidth) {
        style.maxWidth = `${contentMaxWidth}mm`;
        style.margin = '0 auto';
      }
      
      return style;
    }, [config.layout]);
    
    return (
      <div 
        ref={ref} 
        className={cn('page-container', className)} 
        style={containerStyle}
        {...domSafeProps}
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
            <PageContext.Provider 
              value={{ 
                scale, 
                width: actualMaxWidth, 
                height: pageHeight,
                originalWidth: DIN_A4_WIDTH_MM,
                originalHeight: DIN_A4_HEIGHT_MM,
                pageNumber,
                totalPages
              }}
            >
              {renderHeader()}
              <div className="page-content" style={contentStyle}>
                {children}
              </div>
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