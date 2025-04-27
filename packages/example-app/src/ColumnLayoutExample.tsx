import React from 'react';
import { 
  Document, 
  Page,
  PageKitConfigProvider, 
  HeadingItem, 
  ParagraphItem, 
  ShapeItem,
  CalloutItem,
  ImageItem,
  ColumnDefinition
} from '../../page-kit-core/src';

// Sample text content
const shortLorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
`;

const mediumLorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
`;

// Column layout definitions for different examples
const twoEqualColumns: ColumnDefinition[] = [
  { width: 50 },
  { width: 50 }
];

const threeColumns: ColumnDefinition[] = [
  { width: 30 },
  { width: 40 },
  { width: 30 }
];

const sidebarLayout: ColumnDefinition[] = [
  { width: 30, backgroundColor: '#f5f5f5' },
  { width: 70 }
];

const magazineLayout: ColumnDefinition[] = [
  { width: 33 },
  { width: 34, gap: 5 },
  { width: 33 }
];

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
    itemSpacing: 10
  }
};

export default function ColumnLayoutExample() {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Column Layout Examples</h1>
        <p className="mb-4">This demonstrates different column layout configurations for pages and documents.</p>
        
        <div className="space-y-12">
          {/* Example 1: Document-level columns */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Document-Level Columns</h2>
            <p className="mb-4">This example shows columns defined at the document level, applied to all pages.</p>
            
            <PageKitConfigProvider config={pageKitConfig}>
              <Document 
                columns={twoEqualColumns}
                pageProps={{
                  maxWidth: 800,
                  containerWidth: 100,
                  shadow: true,
                  className: "mx-auto",
                  headerContent: <div className="w-full text-center">Document-Level Columns</div>
                }}
                className="flex flex-col items-center gap-8"
              >
                {/* First page with document-level columns */}
                <HeadingItem 
                  dimensions={{ width: 170, height: 15 }}
                  fontSize={24}
                  color="#1a56db"
                >
                  Document-Level Column Demo
                </HeadingItem>
                
                <ShapeItem
                  dimensions={{ width: 170, height: 1 }}
                  shapeType="line"
                  borderColor="#333"
                  borderWidth={0.5}
                />
                
                {/* Content for first column */}
                <ParagraphItem
                  dimensions={{ width: 80, height: 60 }}
                  fontSize={11}
                  lineHeight={1.4}
                  columnIndex={0}
                >
                  This text appears in the left column. When columns are defined at the document level,
                  they apply to all pages unless overridden by page-specific column definitions.
                  
                  {shortLorem}
                </ParagraphItem>
                
                {/* Content for second column */}
                <CalloutItem
                  dimensions={{ width: 80, height: 60 }}
                  variant="info"
                  calloutTitle="Document Columns"
                  columnIndex={1}
                >
                  Document-level columns are applied to all pages in the document by default.
                  Items can specify which column they should appear in using the columnIndex property.
                </CalloutItem>
                
                {/* Next page has the same columns */}
                <HeadingItem 
                  dimensions={{ width: 170, height: 15 }}
                  fontSize={18}
                  color="#333"
                >
                  Second Page (Same Columns)
                </HeadingItem>
                
                {/* Image in first column */}
                <ImageItem
                  dimensions={{ width: 80, height: 60 }}
                  src="https://picsum.photos/seed/col1/800/600"
                  alt="Example image"
                  objectFit="cover"
                  columnIndex={0}
                />
                
                {/* Text in second column */}
                <ParagraphItem
                  dimensions={{ width: 80, height: 60 }}
                  fontSize={11}
                  lineHeight={1.4}
                  columnIndex={1}
                >
                  This is the second page, still using the document-level column definition.
                  Notice how both pages have the same column layout because it was defined at the document level.
                  
                  {shortLorem}
                </ParagraphItem>
                
                {/* Third page overrides the columns */}
                <ParagraphItem
                  dimensions={{ width: 0, height: 0 }}
                  columns={threeColumns}
                />
                
                <HeadingItem 
                  dimensions={{ width: 170, height: 15 }}
                  fontSize={18}
                  color="#333"
                >
                  Third Page (Override Columns)
                </HeadingItem>
                
                {/* Column 1 content */}
                <ParagraphItem
                  dimensions={{ width: 50, height: 40 }}
                  fontSize={10}
                  lineHeight={1.3}
                  columnIndex={0}
                >
                  This page overrides the document-level columns with a three-column layout.
                </ParagraphItem>
                
                {/* Column 2 content */}
                <CalloutItem
                  dimensions={{ width: 60, height: 40 }}
                  variant="tip"
                  calloutTitle="Page Override"
                  columnIndex={1}
                >
                  Page-specific column definitions take precedence over document-level columns.
                </CalloutItem>
                
                {/* Column 3 content */}
                <ParagraphItem
                  dimensions={{ width: 50, height: 40 }}
                  fontSize={10}
                  lineHeight={1.3}
                  columnIndex={2}
                >
                  This is the third column in the overridden layout. Each column can have different widths.
                </ParagraphItem>
              </Document>
            </PageKitConfigProvider>
          </div>
          
          {/* Example 2: Page-specific layouts */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Page-Specific Layouts</h2>
            <p className="mb-4">This example shows different column layouts applied to individual pages.</p>
            
            <PageKitConfigProvider config={pageKitConfig}>
              <Document 
                pageProps={{
                  maxWidth: 800,
                  containerWidth: 100,
                  shadow: true,
                  className: "mx-auto",
                  headerContent: <div className="w-full text-center">Page-Specific Columns</div>
                }}
                className="flex flex-col items-center gap-8"
              >
                {/* First page - sidebar layout */}
                <ParagraphItem
                  dimensions={{ width: 0, height: 0 }}
                  columns={sidebarLayout}
                />
                
                <HeadingItem 
                  dimensions={{ width: 170, height: 15 }}
                  fontSize={24}
                  color="#1a56db"
                >
                  Sidebar Layout
                </HeadingItem>
                
                {/* Sidebar content */}
                <CalloutItem
                  dimensions={{ width: 50, height: 100 }}
                  variant="note"
                  calloutTitle="Page Navigation"
                  columnIndex={0}
                >
                  <ul className="pl-4 list-disc space-y-2">
                    <li>Sidebar Layout</li>
                    <li>Magazine Layout</li>
                    <li>Column Distribution</li>
                  </ul>
                </CalloutItem>
                
                {/* Main content */}
                <ParagraphItem
                  dimensions={{ width: 110, height: 120 }}
                  fontSize={11}
                  lineHeight={1.4}
                  columnIndex={1}
                >
                  <span className="text-lg font-semibold block mb-2">Sidebar Layout Example</span>
                  
                  This page demonstrates a sidebar layout with a narrow left column (30%) and a wider right column (70%).
                  The left column has a subtle gray background to distinguish it visually.
                  
                  {mediumLorem}
                  
                  Sidebar layouts are commonly used in documentation, reports, and other content-heavy documents
                  where supporting information, navigation, or highlights should be kept separate from the main content.
                </ParagraphItem>
                
                {/* Second page - magazine layout */}
                <ParagraphItem
                  dimensions={{ width: 0, height: 0 }}
                  columns={magazineLayout}
                />
                
                <HeadingItem 
                  dimensions={{ width: 170, height: 15 }}
                  fontSize={18}
                  color="#333"
                >
                  Magazine Layout
                </HeadingItem>
                
                {/* Left column */}
                <ParagraphItem
                  dimensions={{ width: 50, height: 120 }}
                  fontSize={10}
                  lineHeight={1.3}
                  columnIndex={0}
                >
                  <span className="text-lg font-semibold block mb-2">Left Column</span>
                  
                  This page demonstrates a three-column magazine-style layout. The middle column is slightly wider
                  and has additional gap spacing, similar to what you might see in a magazine or newspaper.
                  
                  {shortLorem}
                </ParagraphItem>
                
                {/* Middle column */}
                <ImageItem
                  dimensions={{ width: 50, height: 60 }}
                  src="https://picsum.photos/seed/col2/800/600"
                  alt="Featured image"
                  objectFit="cover"
                  columnIndex={1}
                />
                
                <ParagraphItem
                  dimensions={{ width: 50, height: 60 }}
                  fontSize={10}
                  lineHeight={1.3}
                  columnIndex={1}
                >
                  <span className="text-lg font-semibold block mb-2">Featured Content</span>
                  
                  The middle column often contains featured content, images, or pull quotes.
                  This creates visual interest and draws the reader's attention.
                </ParagraphItem>
                
                {/* Right column */}
                <CalloutItem
                  dimensions={{ width: 50, height: 60 }}
                  variant="tip"
                  calloutTitle="Design Tip"
                  columnIndex={2}
                >
                  Magazine layouts work best when the content is carefully balanced across columns.
                  Consider the visual weight of text, images, and callouts.
                </CalloutItem>
                
                <ParagraphItem
                  dimensions={{ width: 50, height: 60 }}
                  fontSize={10}
                  lineHeight={1.3}
                  columnIndex={2}
                >
                  <span className="text-lg font-semibold block mb-2">Right Column</span>
                  
                  The right column can contain secondary information, additional details, or related content.
                  
                  {shortLorem}
                </ParagraphItem>
                
                {/* Third page - auto distribution */}
                <ParagraphItem
                  dimensions={{ width: 0, height: 0 }}
                  columns={[
                    { width: 25 },
                    { width: 25 },
                    { width: 25 },
                    { width: 25 }
                  ]}
                />
                
                <HeadingItem 
                  dimensions={{ width: 170, height: 15 }}
                  fontSize={18}
                  color="#333"
                >
                  Auto Distribution
                </HeadingItem>
                
                <ParagraphItem
                  dimensions={{ width: 170, height: 30 }}
                  fontSize={11}
                >
                  The items below don't specify a columnIndex, so they'll be automatically distributed across the columns.
                </ParagraphItem>
                
                {/* These will be auto-distributed across columns */}
                <ParagraphItem dimensions={{ width: 40, height: 40 }} fontSize={10}>
                  Item 1: Automatically assigned to a column based on distribution algorithm.
                </ParagraphItem>
                
                <ParagraphItem dimensions={{ width: 40, height: 40 }} fontSize={10}>
                  Item 2: Note that these items don't specify a columnIndex property.
                </ParagraphItem>
                
                <ParagraphItem dimensions={{ width: 40, height: 40 }} fontSize={10}>
                  Item 3: The system distributes items evenly across available columns.
                </ParagraphItem>
                
                <ParagraphItem dimensions={{ width: 40, height: 40 }} fontSize={10}>
                  Item 4: The distribution is done by calculating items per column.
                </ParagraphItem>
                
                <ParagraphItem dimensions={{ width: 40, height: 40 }} fontSize={10}>
                  Item 5: Additional items continue the distribution pattern.
                </ParagraphItem>
                
                <ParagraphItem dimensions={{ width: 40, height: 40 }} fontSize={10}>
                  Item 6: This helps create balanced layouts without manual assignment.
                </ParagraphItem>
              </Document>
            </PageKitConfigProvider>
          </div>
        </div>
        
        <div className="p-4 mt-8 bg-white rounded shadow">
          <h2 className="mb-2 text-xl font-semibold">Column Layout Features</h2>
          <ul className="pl-5 mt-2 space-y-1 list-disc">
            <li><strong>Document-level columns</strong> - Applied to all pages by default</li>
            <li><strong>Page-specific columns</strong> - Override document columns for individual pages</li>
            <li><strong>Column widths</strong> - Customizable relative widths (sum must equal 100%)</li>
            <li><strong>Item placement</strong> - Manual placement with columnIndex or automatic distribution</li>
            <li><strong>Column styling</strong> - Custom background colors and gap spacing</li>
            <li><strong>Layout patterns</strong> - Sidebar, magazine, and multi-column layouts</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 