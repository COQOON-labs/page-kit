import React from 'react';
import { 
  Document, 
  PageKitConfigProvider, 
  HeadingItem, 
  ParagraphItem, 
  ShapeItem,
  CalloutItem
} from '../../page-kit-core/src';

// Sample long text for testing
const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
Sed neque tellus, faucibus vel odio at, hendrerit feugiat libero. Nunc convallis ante nec erat egestas, at auctor turpis mattis. 
Cras lobortis pellentesque eros, nec tincidunt tellus tempus et. Maecenas volutpat, est non vulputate convallis, nisl est lobortis neque, eu placerat urna enim nec nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras egestas orci sit amet malesuada vehicula. Cras consectetur odio vel nulla pellentesque sollicitudin. Maecenas tincidunt et arcu id facilisis. Nunc in metus odio.

Nullam fermentum eleifend magna, eget elementum mauris consequat non. Proin id felis tortor. Morbi rhoncus, risus a consequat condimentum, purus augue varius orci, in sollicitudin diam diam id est. Aliquam a est dolor. Nulla sit amet viverra lorem, non ultrices nulla. Nulla ac cursus justo, ac feugiat libero. Etiam sagittis ligula ac libero dapibus, quis egestas nulla convallis. Ut nec nunc condimentum, posuere enim eu, hendrerit ipsum. Cras vestibulum ex a dictum placerat. Vivamus id dui sit amet mauris ultricies accumsan. Fusce eu varius elit, et mattis urna. Etiam accumsan ligula lectus, a scelerisque diam tincidunt non. Nulla aliquam vitae nibh sit amet scelerisque. Cras venenatis aliquam risus. Nam lobortis metus ac est rutrum, vel bibendum lorem mattis.

Praesent euismod tincidunt diam, in suscipit justo viverra vel. Nunc in leo vel urna eleifend interdum. Cras gravida commodo elit eget blandit. Aenean malesuada mi sit amet erat maximus feugiat. Ut fringilla dui vitae placerat fringilla. Cras in commodo diam. Cras venenatis convallis orci, sed pellentesque felis dapibus ut. Pellentesque porttitor tortor eros, ut mollis tortor convallis et. Quisque iaculis massa vitae felis malesuada, eget convallis purus consectetur. Integer consectetur magna quis sem auctor, ac tempus justo volutpat. Sed sed lectus facilisis, viverra purus vel, laoreet libero. Cras faucibus neque ut felis interdum, dapibus elementum purus suscipit. Nulla eget porttitor ligula, ut suscipit nulla.
`;

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

export default function AutoPaginationExample() {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Automatic Pagination Example</h1>
        <p className="mb-4">This demonstrates the automatic pagination feature based on item heights.</p>
        
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
            debug={true} // Enable debug mode
          >
            {/* Main heading */}
            <HeadingItem 
              dimensions={{ width: 170, height: 15 }} // Reduced height
              fontSize={24}
              color="#1a56db"
            >
              Automatic Page Flow Demo
            </HeadingItem>
            
            <ShapeItem
              dimensions={{ width: 170, height: 1 }} // Reduced height
              shapeType="line"
              borderColor="#333"
              borderWidth={0.5}
            />
            
            {/* Introduction */}
            <ParagraphItem
              dimensions={{ width: 170, height: 35 }} // Adjusted height
              fontSize={12}
            >
              This document demonstrates the automatic page flow functionality. 
              Items are automatically distributed across pages based on their height 
              and the remaining space on each page.
            </ParagraphItem>
            
            {/* First callout - should be on page 1 */}
            <CalloutItem
              dimensions={{ width: 170, height: 35 }} // Reduced height
              variant="info"
              title="Automatic Pagination"
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
            
            {/* Second callout - will be on page 2 */}
            <CalloutItem
              dimensions={{ width: 170, height: 45 }}
              variant="tip"
              title="Design Tip"
            >
              When working with automatic pagination, you still need to provide appropriate 
              height values for your items. This allows the system to accurately calculate 
              page breaks.
            </CalloutItem>
            
            {/* Second paragraph of lorem ipsum */}
            <ParagraphItem
              dimensions={{ width: 170, height: 80 }}
              fontSize={11}
              lineHeight={1.4}
            >
              {loremIpsum.split('\n\n')[1]}
            </ParagraphItem>
            
            {/* Third callout - will be on page 3 */}
            <CalloutItem
              dimensions={{ width: 170, height: 50 }}
              variant="warning"
              title="Page Layout Considerations"
            >
              Remember that each page has its own layout constraints. Headers and footers 
              will be consistent across all pages, and the system accounts for their space
              when calculating page breaks.
            </CalloutItem>
            
            {/* Third paragraph of lorem ipsum */}
            <ParagraphItem
              dimensions={{ width: 170, height: 70 }}
              fontSize={11}
              lineHeight={1.4}
            >
              {loremIpsum.split('\n\n')[2]}
            </ParagraphItem>
            
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
            </ParagraphItem>
          </Document>
        </PageKitConfigProvider>
        
        <div className="p-4 mt-8 bg-white rounded shadow">
          <h2 className="mb-2 text-xl font-semibold">About Automatic Pagination</h2>
          <p>
            The automatic pagination feature provides the following benefits:
          </p>
          <ul className="pl-5 mt-2 space-y-1 list-disc">
            <li>No need to manually distribute content across pages</li>
            <li>Content automatically flows to the next page when needed</li>
            <li>Maintains proper spacing between items</li>
            <li>Accounts for headers, footers, and page margins</li>
            <li>Correctly updates page numbers across all pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 