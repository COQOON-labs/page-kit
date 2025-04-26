import React from 'react';
import { cn } from '../../utils/react-helper';
import { TextItemProps } from './types';
import { PageItem } from './PageItem';

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
    // Convert pt to px (1pt ≈ 1.33px)
    const ptToPx = (pt: number) => pt * 1.33;
    
    const textStyle: React.CSSProperties = {
      fontSize: `${ptToPx(fontSize)}px`,
      fontFamily,
      fontWeight,
      color,
      textAlign,
      lineHeight,
    };
    
    return (
      <PageItem
        ref={ref}
        className={cn('page-text-item', className)}
        {...props}
      >
        <div 
          className="h-full w-full overflow-hidden"
          style={textStyle}
        >
          {children}
        </div>
      </PageItem>
    );
  }
);

TextItem.displayName = 'TextItem';

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