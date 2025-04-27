import React from 'react';
import {
  Page,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
  createPageItem,
  PageItemProps,
  usePageKitConfig
} from 'page-kit-core';

/**
 * Props for the HighlightBoxItem component
 * @interface HighlightBoxItemProps
 * @extends PageItemProps - Always extend the base PageItemProps
 */
export interface HighlightBoxItemProps extends PageItemProps {
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
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';
  
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
 * HighlightBoxItem - A custom component for creating highlighted content boxes
 */
export const HighlightBoxItem = createPageItem<HighlightBoxItemProps>({
  /**
   * The display name for the component (used in dev tools and error messages)
   */
  displayName: 'HighlightBoxItem',
  
  /**
   * The base CSS class name for the component
   */
  baseClassName: 'page-highlight-box',
  
  /**
   * Default props
   */
  defaultProps: {
    theme: 'primary',
    rounded: 'medium',
    shadow: false,
  },
  
  /**
   * The main render function for the component
   */
  renderContent: (props) => {
    const {
      children,
      theme = 'primary',
      heading,
      rounded = 'medium',
      shadow = false,
      footer,
    } = props;
    
    // Access the global configuration
    const config = usePageKitConfig();
    
    // Get theme colors
    const getThemeColor = () => {
      switch (theme) {
        case 'primary': return config.colors?.primary || '#0d6efd';
        case 'secondary': return config.colors?.secondary || '#6c757d';
        case 'accent': return config.colors?.info || '#0ea5e9';
        case 'muted': return '#f8f9fa';
        default: return config.colors?.primary || '#0d6efd';
      }
    };
    
    // Get border radius based on setting
    const getBorderRadius = () => {
      switch (rounded) {
        case 'none': return '';
        case 'small': return 'rounded';
        case 'medium': return 'rounded-md';
        case 'large': return 'rounded-lg';
        case 'full': return 'rounded-full';
        default: return 'rounded-md';
      }
    };
    
    // Generate classes
    const boxClasses = cn(
      'flex flex-col overflow-hidden border',
      getBorderRadius(),
      shadow && 'shadow-md',
      theme === 'muted' ? 'border-gray-200' : `border-${theme}`
    );
    
    const color = getThemeColor();
    const isDark = theme !== 'muted';
    
    return (
      <div 
        className={boxClasses}
        style={{
          borderColor: color,
          height: '100%',
          width: '100%',
        }}
      >
        {heading && (
          <div 
            className={cn(
              'px-4 py-2 font-bold',
              isDark ? 'text-white' : 'text-gray-800'
            )}
            style={{ backgroundColor: color }}
          >
            {heading}
          </div>
        )}
        
        <div className="flex-1 p-4 bg-white">
          {children}
        </div>
        
        {footer && (
          <div className="px-4 py-2 text-sm border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    );
  }
});

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

// Helper function for className merging (copied from the core library)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

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
              dimensions={{ width: 170, height: 20 }}
              fontSize={24}
              color="#1a56db"
            >
              Extending Page Kit
            </HeadingItem>
            
            <ParagraphItem
              dimensions={{ width: 170, height: 30 }}
              fontSize={12}
            >
              This example demonstrates how to create custom components that integrate seamlessly 
              with the Page Kit system. Below are examples of custom components created with the{' '}
              <code>createPageItem</code> factory function.
            </ParagraphItem>
            
            {/* HighlightBox examples */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }}
              fontSize={16}
              color="#333"
            >
              HighlightBox Examples
            </HeadingItem>
            
            <div className="flex flex-row gap-4">
              {/* Primary theme */}
              <HighlightBoxItem
                dimensions={{ width: 80, height: 80 }}
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
                dimensions={{ width: 80, height: 80 }}
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
                dimensions={{ width: 80, height: 80 }}
                theme="accent"
                heading="Accent Box"
                rounded="small"
                shadow={true}
              >
                <p>This is an accent themed highlight box with small corners.</p>
              </HighlightBoxItem>
              
              {/* Muted theme */}
              <HighlightBoxItem
                dimensions={{ width: 80, height: 80 }}
                theme="muted"
                heading="Muted Box"
                rounded="none"
              >
                <p>This is a muted themed highlight box with no rounded corners.</p>
              </HighlightBoxItem>
            </div>
            
            {/* Quote examples */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }}
              fontSize={16}
              color="#333"
            >
              Quote Examples
            </HeadingItem>
            
            <div className="flex flex-row gap-4">
              <QuoteItem
                dimensions={{ width: 170, height: 70 }}
                author="Albert Einstein"
                citation="On Relativity, 1921"
                publication="book"
              >
                The important thing is not to stop questioning. Curiosity has its own reason for existing.
              </QuoteItem>
            </div>
            
            <div className="flex flex-row gap-4 mt-4">
              <QuoteItem
                dimensions={{ width: 80, height: 70 }}
                author="Alan Kay"
                citation="On Programming"
                publication="article"
              >
                The best way to predict the future is to invent it.
              </QuoteItem>
              
              <QuoteItem
                dimensions={{ width: 80, height: 70 }}
                author="Ada Lovelace"
                publication="book"
              >
                The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform.
              </QuoteItem>
            </div>
            
            {/* Creating Custom Components Section */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }}
              fontSize={16}
              color="#333"
            >
              Creating Custom Components
            </HeadingItem>
            
            <ParagraphItem
              dimensions={{ width: 170, height: 80 }}
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