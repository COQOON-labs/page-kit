import React from 'react';
import {
  Page,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
  createPageItem,
  PageItemProps
} from 'page-kit-core';

/**
 * Custom CSS for components
 */
const CustomComponentStyles = () => (
  <style>{`
    .page-highlight-box {
      border-color: var(--theme-color);
    }
    .bg-theme-color {
      background-color: var(--theme-color);
    }
  `}</style>
);

/**
 * Helper function to combine class names
 */
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Props for the HighlightBoxItem component
 * @interface HighlightBoxItemProps
 * @extends PageItemProps - Always extend the base PageItemProps
 */
export interface HighlightBoxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>, PageItemProps {
  /**
   * The highlight theme color
   * @default 'primary'
   */
  theme?: 'primary' | 'secondary' | 'accent' | 'muted';
  
  /**
   * Optional heading for the box
   */
  heading?: React.ReactNode;
  
  /**
   * Border radius size
   * @default 'medium'
   */
  rounded?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * Whether to add a shadow
   * @default false
   */
  shadow?: boolean;
  
  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
}

/**
 * A custom highlight box component that can be used in a PageKit page
 */
export const HighlightBoxItem = React.forwardRef<HTMLDivElement, HighlightBoxItemProps>(
  (
    {
      heading,
      footer,
      theme = 'primary',
      className,
      rounded = 'none',
      shadow = false,
      children,
      ...rest
    },
    ref
  ) => {
    const themeColors = {
      primary: '#0070f3',
      secondary: '#0ea5e9',
      accent: '#f59e0b',
      muted: '#6b7280',
    };

    const color = themeColors[theme];
    const roundedClasses = {
      none: '',
      small: 'rounded',
      medium: 'rounded-md',
      large: 'rounded-lg',
    };

    const boxClasses = cn(
      'p-4 border-2 page-highlight-box h-full w-full',
      roundedClasses[rounded],
      shadow && 'shadow-md',
      className
    );

    const renderContent = () => {
      return (
        <div 
          className={boxClasses}
          style={{"--theme-color": color} as React.CSSProperties}
          ref={ref}
          {...rest}
        >
          {heading && (
            <div className={cn(
              'px-4 py-2 font-bold bg-theme-color',
              theme === 'muted' ? 'text-gray-800' : 'text-white'
            )}>
              {heading}
            </div>
          )}
          <div className="p-4">{children}</div>
          {footer && <div className="mt-4 text-sm text-gray-500">{footer}</div>}
          <CustomComponentStyles />
        </div>
      );
    };

    return renderContent();
  }
);

// Set display name
HighlightBoxItem.displayName = 'HighlightBoxItem';

/**
 * Props for the QuoteItem component
 */
export interface QuoteItemProps extends PageItemProps {
  author?: string;
  citation?: string;
  publication?: 'book' | 'article';
}

/**
 * QuoteItem - A component for displaying quotations
 */
export const QuoteItem = createPageItem<QuoteItemProps>({
  displayName: "QuoteItem",
  baseClassName: "page-quote-item",

  // Set default props
  defaultProps: {
    author: "Unknown",
  },

  // Define the render function
  renderContent: (props) => {
    const { children, author = "Unknown", citation, publication } = props;

    return (
      <div className="flex flex-col w-full h-full p-4 italic border-l-4 border-gray-300">
        <div className="flex-1 mb-4 text-gray-700">&ldquo;{children}&rdquo;</div>

        <div className="text-sm font-medium text-right text-gray-800">
          {publication === 'book' && (
            <span className="block italic">
              From &ldquo;{citation}&rdquo;
            </span>
          )}
          {publication === 'article' && (
            <span className="block">
              {citation}
            </span>
          )}
          <span className="block mt-1 font-semibold">
            &mdash; {author}
          </span>
        </div>
      </div>
    );
  },
});

export default function CustomComponentsExample() {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Custom Components Examples</h1>
        <p className="mb-4">This demonstrates how to create and use custom components with Page Kit.</p>
        
        <PageKitConfigProvider>
          <Page 
            maxWidth={800}
            containerWidth={100}
            shadow={true}
            className="mx-auto"
          >
            {/* Main heading */}
            <HeadingItem 
              fontSize={24}
              color="#1a56db"
            >
              Extending Page Kit
            </HeadingItem>
            
            <ParagraphItem
              fontSize={12}
            >
              This example demonstrates how to create custom components that integrate seamlessly 
              with the Page Kit system. Below are examples of custom components created with the{' '}
              <code>createPageItem</code> factory function.
            </ParagraphItem>
            
            {/* HighlightBox examples */}
            <HeadingItem 
              fontSize={16}
              color="#333"
            >
              HighlightBox Examples
            </HeadingItem>
            
            <div className="flex flex-row gap-4">
              {/* Primary theme */}
              <HighlightBoxItem
                theme="primary"
                heading="Primary Box"
                rounded="medium"
                shadow={true}
                footer="With footer text"
              >
                <p>This is a primary themed highlight box with medium corners and shadow.</p>
              </HighlightBoxItem>
              
              {/* Secondary theme */}
              <HighlightBoxItem
                theme="secondary"
                heading="Secondary Box"
                rounded="large"
              >
                <p>This is a secondary themed highlight box with large rounded corners.</p>
              </HighlightBoxItem>
            </div>
            
            <div className="flex flex-row gap-4 mt-4">
              {/* Accent theme */}
              <HighlightBoxItem
                theme="accent"
                heading="Accent Box"
                rounded="small"
                shadow={true}
              >
                <p>This is an accent themed highlight box with small corners.</p>
              </HighlightBoxItem>
              
              {/* Muted theme */}
              <HighlightBoxItem
                theme="muted"
                heading="Muted Box"
                rounded="none"
              >
                <p>This is a muted themed highlight box with no rounded corners.</p>
              </HighlightBoxItem>
            </div>
            
            {/* Quote examples */}
            <HeadingItem 
              fontSize={16}
              color="#333"
            >
              Quote Examples
            </HeadingItem>
            
            <div className="flex flex-row gap-4">
              <QuoteItem
                author="Albert Einstein"
                citation="On Relativity, 1921"
                publication="book"
              >
                The important thing is not to stop questioning. Curiosity has its own reason for existing.
              </QuoteItem>
            </div>
            
            <div className="flex flex-row gap-4 mt-4">
              <QuoteItem
                author="Alan Kay"
                citation="On Programming"
                publication="article"
              >
                The best way to predict the future is to invent it.
              </QuoteItem>
              
              <QuoteItem
                author="Ada Lovelace"
                publication="book"
              >
                The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform.
              </QuoteItem>
            </div>
            
            {/* Creating Custom Components Section */}
            <HeadingItem 
              fontSize={16}
              color="#333"
            >
              Creating Custom Components
            </HeadingItem>
            
            <ParagraphItem
              fontSize={11}
            >
              To create your own custom components:
              
              1. Define an interface extending PageItemProps with your custom properties
              2. Use the createPageItem factory function to create your component
              3. Implement the renderContent function to define your component's appearance
              4. (Optional) Define defaultProps for your component
              5. Use hooks like useElementDimensions, useTextStyles, and usePageKitConfig
              
              See the source code of this example for complete implementation details.
            </ParagraphItem>
          </Page>
        </PageKitConfigProvider>
      </div>
    </div>
  );
} 