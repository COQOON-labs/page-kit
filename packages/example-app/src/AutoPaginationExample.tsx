import React, { useState } from 'react';
import { 
  Document, 
  PageKitConfigProvider, 
  HeadingItem, 
  ParagraphItem, 
  ShapeItem,
  CalloutItem,
  ColumnDefinition
} from '../../page-kit-core/src';

// Sample long text for testing
const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
Sed neque tellus, faucibus vel odio at, hendrerit feugiat libero. Nunc convallis ante nec erat egestas, at auctor turpis mattis. 
Cras lobortis pellentesque eros, nec tincidunt tellus tempus et. Maecenas volutpat, est non vulputate convallis, nisl est lobortis neque, eu placerat urna enim nec nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras egestas orci sit amet malesuada vehicula. Cras consectetur odio vel nulla pellentesque sollicitudin. Maecenas tincidunt et arcu id facilisis. Nunc in metus odio.

Nullam fermentum eleifend magna, eget elementum mauris consequat non. Proin id felis tortor. Morbi rhoncus, risus a consequat condimentum, purus augue varius orci, in sollicitudin diam diam id est. Aliquam a est dolor. Nulla sit amet viverra lorem, non ultrices nulla. Nulla ac cursus justo, ac feugiat libero. Etiam sagittis ligula ac libero dapibus, quis egestas nulla convallis. Ut nec nunc condimentum, posuere enim eu, hendrerit ipsum. Cras vestibulum ex a dictum placerat. Vivamus id dui sit amet mauris ultricies accumsan. Fusce eu varius elit, et mattis urna. Etiam accumsan ligula lectus, a scelerisque diam tincidunt non. Nulla aliquam vitae nibh sit amet scelerisque. Cras venenatis aliquam risus. Nam lobortis metus ac est rutrum, vel bibendum lorem mattis.

Praesent euismod tincidunt diam, in suscipit justo viverra vel. Nunc in leo vel urna eleifend interdum. Cras gravida commodo elit eget blandit. Aenean malesuada mi sit amet erat maximus feugiat. Ut fringilla dui vitae placerat fringilla. Cras in commodo diam. Cras venenatis convallis orci, sed pellentesque felis dapibus ut. Pellentesque porttitor tortor eros, ut mollis tortor convallis et. Quisque iaculis massa vitae felis malesuada, eget convallis purus consectetur. Integer consectetur magna quis sem auctor, ac tempus justo volutpat. Sed sed lectus facilisis, viverra purus vel, laoreet libero. Cras faucibus neque ut felis interdum, dapibus elementum purus suscipit. Nulla eget porttitor ligula, ut suscipit nulla.
`;

// Error component to simulate failures
const ErrorComponent = () => {
  throw new Error('This is a test error!');
  return null;
};

// Custom configuration for page kit
const pageKitConfig = {
  header: {
    show: true,
    height: 15
  },
  footer: {
    show: true,
    height: 15,
    showPageNumbers: true
  },
  layout: {
    padding: 20,
    itemSpacing: 8  // Reduced spacing to allow more content per page
  }
};

// Define column layouts for specific pages
const twoColumnLayout: ColumnDefinition[] = [
  { width: 48, gap: 5 },
  { width: 52, backgroundColor: '#f8f9fa' }
];

export default function AutoPaginationExample() {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Error handler for document component
  const handleError = (error: Error) => {
    console.log('Document error caught:', error.message);
    setErrorMessage(error.message);
  };
  
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Automatic Pagination Example</h1>
        <p className="mb-4">This demonstrates the automatic pagination feature based on item heights.</p>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setShowError(!showError)}
            className="px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
          >
            {showError ? 'Hide Error Component' : 'Show Error Component'}
          </button>
          
          {errorMessage && (
            <div className="p-3 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded">
              Error caught: {errorMessage}
            </div>
          )}
        </div>
        
        <PageKitConfigProvider config={pageKitConfig}>
          <Document 
            pageProps={{
              maxWidth: 800,
              containerWidth: 100,
              shadow: true,
              className: "mx-auto",
              headerContent: <div className="w-full text-center">Auto-Pagination Document</div>,
              footerContent: <div className="flex justify-between w-full">
                <div>Page Kit</div>
                <div>Automatic Page Flow</div>
              </div>
            }}
            className="flex flex-col items-center gap-8"
            onError={handleError}
          >
            {/* Main heading */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }}
              fontSize={24}
              color="#1a56db"
            >
              Automatic Page Flow Demo
            </HeadingItem>
            
            <ShapeItem
              dimensions={{ width: 170, height: 1 }}
              shapeType="line"
              borderColor="#333"
              borderWidth={0.5}
            />
            
            {/* Error component (conditionally rendered) */}
            {showError && (
              <ParagraphItem dimensions={{ width: 170, height: 40 }}>
                <ErrorComponent />
              </ParagraphItem>
            )}
            
            {/* Introduction */}
            <ParagraphItem
              dimensions={{ width: 170, height: 35 }}
              fontSize={12}
            >
              This document demonstrates the automatic page flow functionality. 
              Items are automatically distributed across pages based on their height 
              and the remaining space on each page.
            </ParagraphItem>
            
            {/* First callout - should be on page 1 */}
            <CalloutItem
              dimensions={{ width: 170, height: 35 }}
              variant="info"
              calloutTitle="Automatic Pagination"
            >
              With automatic pagination, you no longer need to manually place items on specific pages.
              The system automatically calculates where each item should be placed based on its dimensions.
            </CalloutItem>
            
            {/* First paragraph of lorem ipsum - might overflow to page 2 */}
            <ParagraphItem
              dimensions={{ width: 170, height: 60 }}
              fontSize={11}
              lineHeight={1.4}
            >
              {loremIpsum.split('\n\n')[0]}
            </ParagraphItem>
            
            {/* Column layout marker - this will apply columns to the next page */}
            <ParagraphItem 
              dimensions={{ width: 0, height: 0 }}
              columns={twoColumnLayout}
            />
            
            {/* Second callout - will be on page 2 in the first column */}
            <CalloutItem
              dimensions={{ width: 80, height: 45 }}
              variant="tip"
              calloutTitle="Design Tip"
              columnIndex={0}
            >
              When working with automatic pagination, you still need to provide appropriate 
              height values for your items. This allows the system to accurately calculate 
              page breaks.
            </CalloutItem>
            
            {/* Second paragraph of lorem ipsum - in the second column */}
            <ParagraphItem
              dimensions={{ width: 80, height: 80 }}
              fontSize={11}
              lineHeight={1.4}
              columnIndex={1}
            >
              {loremIpsum.split('\n\n')[1]}
            </ParagraphItem>
            
            {/* Reset to single column layout */}
            <ParagraphItem
              dimensions={{ width: 0, height: 0 }}
              columns={[{ width: 100 }]}
            />
            
            {/* Heading for column demo */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }}
              fontSize={16}
              color="#333"
            >
              Column Layout Demo
            </HeadingItem>
            
            {/* Explanation of the column layout */}
            <ParagraphItem
              dimensions={{ width: 170, height: 30 }}
              fontSize={11}
            >
              The previous page demonstrated a two-column layout. Items can be assigned to specific columns
              using the columnIndex property. The system handles pagination with columns automatically.
              Columns can have different widths and even background colors.
            </ParagraphItem>
            
            {/* Three-column layout for this page */}
            <ParagraphItem
              dimensions={{ width: 0, height: 0 }}
              columns={[
                { width: 30, backgroundColor: '#f0f9ff' },
                { width: 40 },
                { width: 30, backgroundColor: '#f0f9ff' }
              ]}
            />
            
            {/* Content for first column */}
            <ParagraphItem
              dimensions={{ width: 50, height: 50 }}
              fontSize={10}
              lineHeight={1.3}
              columnIndex={0}
            >
              This text appears in the first column. Notice how the columns maintain their relative 
              widths and proper spacing. The left and right columns have a subtle background color.
            </ParagraphItem>
            
            {/* Content for second column */}
            <CalloutItem
              dimensions={{ width: 60, height: 50 }}
              variant="warning"
              calloutTitle="Page Layout Considerations"
              columnIndex={1}
            >
              Remember that each page has its own layout constraints. Columns only apply to the 
              specific page they are defined on.
            </CalloutItem>
            
            {/* Content for third column */}
            <ParagraphItem
              dimensions={{ width: 50, height: 50 }}
              fontSize={10}
              lineHeight={1.3}
              columnIndex={2}
            >
              This text appears in the third column. You can specify different column widths to create 
              various layouts. The sum of all column widths should equal 100%.
            </ParagraphItem>
            
            {/* Reset to single column */}
            <ParagraphItem
              dimensions={{ width: 0, height: 0 }}
              columns={[{ width: 100 }]}
            />
            
            {/* Final heading - will be on the last page */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }}
              fontSize={18}
              color="#333"
            >
              Conclusion
            </HeadingItem>
            
            {/* Final paragraph */}
            <ParagraphItem
              dimensions={{ width: 170, height: 30 }}
              fontSize={12}
            >
              As demonstrated, the automatic pagination system distributes content
              intelligently across multiple pages, maintaining proper layout and spacing.
              Column layouts provide even more flexibility for creating complex documents.
            </ParagraphItem>
          </Document>
        </PageKitConfigProvider>
        
        <div className="p-4 mt-8 bg-white rounded shadow">
          <h2 className="mb-2 text-xl font-semibold">Improvements Made</h2>
          <ul className="pl-5 mt-2 space-y-1 list-disc">
            <li><strong>Automatic pagination</strong> - Content flows naturally across pages</li>
            <li><strong>Error handling</strong> - Boundary catches and displays errors gracefully</li>
            <li><strong>Memoized calculations</strong> - Performance optimized with React.memo and useMemo</li>
            <li><strong>Type-safe props</strong> - DOM props are properly filtered and typed</li>
            <li><strong>Column layouts</strong> - Support for multi-column pages with individual item placement</li>
            <li><strong>Validation</strong> - Input validation for dimension values</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 