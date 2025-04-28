import React from 'react';
import { cn } from '../../utils/react-helper';
import { TextItemProps } from './types';
import { PageItem } from './PageItem';
import { useTextStyles } from '../../hooks';
import { filterDOMProps } from '../../utils/layout-helper';

/**
 * Base text item component for displaying formatted text
 */
export const TextItem = React.forwardRef<HTMLDivElement, TextItemProps>(
  ({ 
    children,
    fontSize = 12,
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    color = 'black',
    textAlign = 'left',
    lineHeight = 1.5,
    className = '',
    ...props
  }, ref) => {
    // Use custom hooks for text styling
    const { textStyles, textClasses } = useTextStyles({
      fontSize,
      fontFamily,
      fontWeight,
      color,
      textAlign,
      lineHeight
    });
    
    // Filter out non-DOM props
    const domSafeProps = filterDOMProps(props as Record<string, unknown>, [
      'columnIndex', 'columns'
    ]);
    
    return (
      <PageItem
        ref={ref}
        className={cn('page-text-item', className)}
        {...domSafeProps}
      >
        <div 
          className={cn('h-full w-full', textClasses)}
          style={textStyles}
        >
          {children}
        </div>
      </PageItem>
    );
  }
);

TextItem.displayName = 'TextItem';

/**
 * Heading component for displaying titles and headings
 */
export const HeadingItem = React.forwardRef<HTMLDivElement, TextItemProps>(
  ({ 
    children,
    fontSize = 24,
    fontWeight = 'bold',
    ...props
  }, ref) => {
    return (
      <TextItem
        ref={ref}
        fontSize={fontSize}
        fontWeight={fontWeight}
        className="page-heading-item"
        {...props}
      >
        {children}
      </TextItem>
    );
  }
);

HeadingItem.displayName = 'HeadingItem';

/**
 * Paragraph component for displaying regular text content
 */
export const ParagraphItem = React.forwardRef<HTMLDivElement, TextItemProps>(
  ({ 
    children,
    fontSize = 12,
    lineHeight = 1.5,
    ...props
  }, ref) => {
    return (
      <TextItem
        ref={ref}
        fontSize={fontSize}
        lineHeight={lineHeight}
        className="page-paragraph-item"
        {...props}
      >
        {children}
      </TextItem>
    );
  }
);

ParagraphItem.displayName = 'ParagraphItem'; 