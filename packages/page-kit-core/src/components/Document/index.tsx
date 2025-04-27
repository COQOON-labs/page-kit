import React, { useState, useEffect, ReactElement, useRef, Children, isValidElement, cloneElement } from 'react';
import { Page, PageProps } from '../Page';
import { PageItemProps } from '../PageItem/types';
import { usePageKitConfig } from '../../config';
import { mmToPx } from '../../utils/dimension-helper';

export interface DocumentProps {
  /**
   * Page props to be applied to all pages
   */
  pageProps?: Omit<PageProps, 'pageNumber' | 'totalPages'>;
  
  /**
   * Children elements (page items)
   */
  children: React.ReactNode;
  
  /**
   * Optional className for the document container
   */
  className?: string;
}

export const Document: React.FC<DocumentProps> = ({ 
  pageProps = {}, 
  children,
  className = '' 
}) => {
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const config = usePageKitConfig();
  const documentRef = useRef<HTMLDivElement>(null);
  
  // Calculate the available content height for a page (excluding header, footer, and padding)
  const calculateAvailableHeight = (): number => {
    const maxWidth = pageProps.maxWidth || 800;
    const aspectRatio = Math.sqrt(2); // DIN A4 ratio
    const pageHeight = maxWidth * aspectRatio;
    
    // Get padding values
    let paddingTop = 20;
    let paddingBottom = 20;
    
    if (config.layout.padding) {
      if (typeof config.layout.padding === 'number') {
        paddingTop = paddingBottom = config.layout.padding;
      } else {
        paddingTop = config.layout.padding.top || paddingTop;
        paddingBottom = config.layout.padding.bottom || paddingBottom;
      }
    }
    
    // Convert mm to px
    const paddingTopPx = mmToPx(paddingTop);
    const paddingBottomPx = mmToPx(paddingBottom);
    
    // Calculate header and footer heights
    const headerHeightPx = config.header.show ? mmToPx(config.header.height || 0) : 0;
    const footerHeightPx = config.footer.show ? mmToPx(config.footer.height || 0) : 0;
    
    // Calculate available content height with a small buffer
    return pageHeight - paddingTopPx - paddingBottomPx - headerHeightPx - footerHeightPx + 10;
  };
  
  // Distribute items into pages based on their heights
  useEffect(() => {
    const availableHeight = calculateAvailableHeight();
    const childrenArray = Children.toArray(children);
    const itemSpacingPx = mmToPx(config.layout.itemSpacing || 0);
    
    const paginatedPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentPageHeight = 0;
    
    // Helper function to get item height from dimensions
    const getItemHeight = (item: ReactElement): number => {
      if (isValidElement(item)) {
        const itemProps = item.props as PageItemProps;
        if (itemProps.dimensions?.height) {
          // Convert mm to px if needed
          return typeof itemProps.dimensions.height === 'number' 
            ? mmToPx(itemProps.dimensions.height)
            : parseInt(itemProps.dimensions.height, 10);
        }
      }
      // Default height if none specified
      return mmToPx(10); // Default 10mm height
    };
    
    // Process each item and distribute them to pages
    childrenArray.forEach((item, index) => {
      if (isValidElement(item)) {
        const itemHeight = getItemHeight(item);
        
        // Add spacing except for the first item on a page
        const heightWithSpacing = currentPage.length === 0 
          ? itemHeight 
          : itemHeight + itemSpacingPx;
        
        const anticipatedTotalHeight = currentPageHeight + heightWithSpacing;
        
        // Check if item fits on current page
        if (anticipatedTotalHeight <= availableHeight) {
          // Item fits on current page
          currentPage.push(item);
          currentPageHeight = anticipatedTotalHeight;
        } else {
          // Item doesn't fit, start a new page
          if (currentPage.length > 0) {
            paginatedPages.push([...currentPage]);
          }
          currentPage = [item];
          currentPageHeight = itemHeight;
        }
      }
    });
    
    // Add the last page if it has items
    if (currentPage.length > 0) {
      paginatedPages.push(currentPage);
    }
    
    setPages(paginatedPages);
  }, [children, pageProps.maxWidth, config]);
  
  return (
    <div ref={documentRef} className={className}>
      {pages.map((pageItems, index) => (
        <Page
          key={`page-${index}`}
          {...pageProps}
          pageNumber={index + 1}
          totalPages={pages.length}
          className={`${pageProps.className || ''} ${index > 0 ? 'mt-8' : ''}`}
        >
          {pageItems}
        </Page>
      ))}
    </div>
  );
};

export default Document; 