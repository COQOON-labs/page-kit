import React, { useState, useEffect, ReactElement, useRef, Children, isValidElement, useMemo } from 'react';
import { Page, PageProps } from '../Page';
import { PageItemProps } from '../PageItem/types';
import { usePageKitConfig } from '../../config';
import { mmToPx, getDimensionInPx } from '../../utils/dimension-helper';
import { calculatePageContentHeight } from '../../utils/layout-helper';
import ErrorBoundary from '../ErrorBoundary';

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
  
  /**
   * Optional error handler for the error boundary
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Document component that automatically distributes content across pages
 */
const DocumentContent: React.FC<DocumentProps> = React.memo(({ 
  pageProps = {}, 
  children,
  className = '' 
}) => {
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const config = usePageKitConfig();
  const documentRef = useRef<HTMLDivElement>(null);
  
  // Memoize the available height calculation
  const availableHeight = useMemo(() => {
    const maxWidth = pageProps.maxWidth || 800;
    return calculatePageContentHeight(maxWidth, config, true);
  }, [pageProps.maxWidth, config]);
  
  // Memoize the spacing calculation
  const itemSpacingPx = useMemo(() => 
    mmToPx(config.layout?.itemSpacing || 0),
    [config.layout]
  );
  
  // Helper function to get item height from dimensions
  const getItemHeight = (item: ReactElement): number => {
    if (!isValidElement(item)) {
      return mmToPx(10); // Default 10mm height
    }
    
    const itemProps = item.props as PageItemProps;
    if (itemProps.dimensions?.height) {
      return getDimensionInPx(itemProps.dimensions.height);
    }
    
    // Default height if none specified
    return mmToPx(10); // Default 10mm height
  };
  
  // Distribute items into pages based on their heights
  useEffect(() => {
    const childrenArray = Children.toArray(children);
    const paginatedPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentPageHeight = 0;
    
    // Process each item and distribute them to pages
    childrenArray.forEach((item) => {
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
  }, [children, availableHeight, itemSpacingPx]);
  
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
});

// Set display name
DocumentContent.displayName = 'DocumentContent';

/**
 * Document component with error boundary
 */
export const Document: React.FC<DocumentProps> = ({ onError, ...props }) => {
  return (
    <ErrorBoundary onError={onError}>
      <DocumentContent {...props} />
    </ErrorBoundary>
  );
};

// Set display name
Document.displayName = 'Document';

export default Document; 