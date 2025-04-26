import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { cn } from '../../utils/react-helper';

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
   * Optional padding inside the page in mm
   */
  padding?: number;
  /**
   * Enable or disable page shadow
   */
  shadow?: boolean;
}

export const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ 
    children, 
    maxWidth = 800, 
    className = '', 
    background = 'white', 
    pageClassName = '',
    containerWidth = 100,
    padding = 20,
    shadow = true,
    ...props 
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    
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
      padding: `${padding}mm`,
      backgroundColor: background,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };
    
    // The overall height that accommodates the scaled content
    const scaledHeight = pageHeight * scale;
    
    // Style for the wrapper div that accommodates the scaled page
    const wrapperStyle = {
      height: `${scaledHeight}px`,
      width: `${containerSize.width}px`,
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
                originalHeight: DIN_A4_HEIGHT_MM
              }}
            >
              {children}
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