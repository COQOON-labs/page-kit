import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { cn } from '../../utils/react-helper';
import { usePageKitConfig } from '../../config';

// DIN A4 has an aspect ratio of 1:√2 (height:width)
const DIN_A4_RATIO = Math.sqrt(2);
// DIN A4 standard dimensions in mm
const DIN_A4_WIDTH_MM = 210;
const DIN_A4_HEIGHT_MM = 297;

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

export const Page = React.forwardRef<HTMLDivElement, PageProps>(
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
    const backgroundColor = background || config.colors?.background || 'white';
    
    // Get padding from configuration
    const getPadding = () => {
      const layoutPadding = config.layout.padding;
      if (typeof layoutPadding === 'number') {
        return `${layoutPadding}mm`;
      } else if (layoutPadding) {
        const { top = 0, right = 0, bottom = 0, left = 0 } = layoutPadding;
        return `${top}mm ${right}mm ${bottom}mm ${left}mm`;
      }
      return '20mm'; // Default fallback
    };
    
    // Calculate the actual width of the page based on container width
    const actualMaxWidth = (maxWidth * containerWidth) / 100;
    
    // Calculate the height based on DIN A4 ratio
    const pageHeight = actualMaxWidth * DIN_A4_RATIO;
    
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
    const containerStyle = {
      width: `${containerWidth}%`,
      maxWidth: `${actualMaxWidth}px`,
    };
    
    // Style for the actual page
    const pageStyle = {
      width: `${actualMaxWidth}px`,
      height: `${pageHeight}px`,
      padding: getPadding(),
      backgroundColor,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      display: 'flex',
      flexDirection: 'column' as const,
    };
    
    // The overall height that accommodates the scaled content
    const scaledHeight = pageHeight * scale;
    
    // Style for the wrapper div that accommodates the scaled page
    const wrapperStyle = {
      height: `${scaledHeight}px`,
      width: `${containerSize.width}px`,
    };
    
    // Calculate header, footer and content heights
    const headerHeight = config.header.show ? config.header.height : 0;
    const footerHeight = config.footer.show ? config.footer.height : 0;
    
    // Convert mm to pixels for consistent sizing
    const mmToPx = (mm: number) => mm * (96 / 25.4);
    
    // Render the header component if enabled
    const renderHeader = () => {
      if (!config.header.show) return null;
      
      const headerStyle: React.CSSProperties = {
        height: `${headerHeight}mm`,
        backgroundColor: config.header.backgroundColor,
        color: config.header.textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        marginBottom: `${config.layout.itemSpacing || 0}mm`
      };
      
      return (
        <div className="page-header" style={headerStyle}>
          {headerContent || <div>Header</div>}
        </div>
      );
    };
    
    // Render the footer component if enabled
    const renderFooter = () => {
      if (!config.footer.show) return null;
      
      const footerStyle: React.CSSProperties = {
        height: `${footerHeight}mm`,
        backgroundColor: config.footer.backgroundColor,
        color: config.footer.textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        marginTop: `${config.layout.itemSpacing || 0}mm`
      };
      
      return (
        <div className="page-footer" style={footerStyle}>
          {footerContent || (
            <>
              <div></div>
              {config.footer.showPageNumbers && pageNumber && totalPages ? (
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
    const contentStyle: React.CSSProperties = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: `${config.layout.itemSpacing}mm`,
      maxWidth: config.layout.contentMaxWidth ? `${config.layout.contentMaxWidth}mm` : undefined,
      margin: config.layout.contentMaxWidth ? '0 auto' : undefined
    };
    
    return (
      <div 
        ref={ref} 
        className={cn('page-container', className)} 
        style={containerStyle}
        {...props}
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
);

Page.displayName = 'Page';

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