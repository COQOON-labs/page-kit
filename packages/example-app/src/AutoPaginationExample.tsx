import { 
  Document, 
  PageKitConfigProvider, 
  HeadingItem, 
  ParagraphItem, 
  ShapeItem,
  CalloutItem,
  ColumnDefinition,
  DocumentLayout,
  PageLayout
} from '../../page-kit-core/src';

// Sample long text for testing
const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
Sed neque tellus, faucibus vel odio at, hendrerit feugiat libero. Nunc convallis ante nec erat egestas, at auctor turpis mattis. 
Cras lobortis pellentesque eros, nec tincidunt tellus tempus et. Maecenas volutpat, est non vulputate convallis, nisl est lobortis neque, eu placerat urna enim nec nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras egestas orci sit amet malesuada vehicula. Cras consectetur odio vel nulla pellentesque sollicitudin. Maecenas tincidunt et arcu id facilisis. Nunc in metus odio.

Nullam fermentum eleifend magna, eget elementum mauris consequat non. Proin id felis tortor. Morbi rhoncus, risus a consequat condimentum, purus augue varius orci, in sollicitudin diam diam id est. Aliquam a est dolor. Nulla sit amet viverra lorem, non ultrices nulla. Nulla ac cursus justo, ac feugiat libero. Etiam sagittis ligula ac libero dapibus, quis egestas nulla convallis. Ut nec nunc condimentum, posuere enim eu, hendrerit ipsum. Cras vestibulum ex a dictum placerat. Vivamus id dui sit amet mauris ultricies accumsan. Fusce eu varius elit, et mattis urna. Etiam accumsan ligula lectus, a scelerisque diam tincidunt non. Nulla aliquam vitae nibh sit amet scelerisque. Cras venenatis aliquam risus. Nam lobortis metus ac est rutrum, vel bibendum lorem mattis.

Praesent euismod tincidunt diam, in suscipit justo viverra vel. Nunc in leo vel urna eleifend interdum. Cras gravida commodo elit eget blandit. Aenean malesuada mi sit amet erat maximus feugiat. Ut fringilla dui vitae placerat fringilla. Cras in commodo diam. Cras venenatis convallis orci, sed pellentesque felis dapibus ut. Pellentesque porttitor tortor eros, ut mollis tortor convallis et. Quisque iaculis massa vitae felis malesuada, eget convallis purus consectetur. Integer consectetur magna quis sem auctor, ac tempus justo volutpat. Sed sed lectus facilisis, viverra purus vel, laoreet libero. Cras faucibus neque ut felis interdum, dapibus elementum purus suscipit. Nulla eget porttitor ligula, ut suscipit nulla.

Fusce bibendum, urna non tempus tristique, enim nisi iaculis risus, vel dictum nulla lorem vitae mauris. Suspendisse eu dignissim lorem. Maecenas ut vestibulum nisi. Pellentesque gravida facilisis neque, sed egestas lorem dignissim eu. Pellentesque posuere eros at feugiat cursus. Suspendisse consequat orci in nulla sagittis, id condimentum tellus vestibulum. Donec nec nulla dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque euismod dui vel purus mattis, at blandit ex sodales.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut feugiat et nulla quis blandit. Donec sed suscipit dui. Praesent gravida ante at nulla tempus, nec pretium velit lacinia. Vestibulum vitae ultrices nibh. Duis ut rutrum tellus. Etiam faucibus, nunc facilisis consectetur aliquet, tellus metus interdum urna, vel laoreet est velit nec quam. Curabitur dictum leo sit amet tellus facilisis, a sodales ex efficitur.

Aliquam ante magna, lobortis nec sapien in, facilisis laoreet justo. Integer at tellus convallis, gravida dui eu, fermentum tellus. Integer hendrerit, odio sed accumsan consectetur, quam sapien vulputate mauris, in elementum arcu libero vitae nulla. Sed posuere pulvinar justo, vel fermentum libero aliquet vitae. Proin eu elit porta, malesuada sapien nec, commodo orci. Vivamus blandit pharetra tincidunt. Donec consequat, nulla et vestibulum sagittis, sapien sapien ullamcorper libero, id iaculis nulla turpis at odio.

Curabitur molestie, ex ac faucibus ornare, mi ligula pulvinar ex, in luctus velit risus a ex. Vestibulum pretium vel nulla quis laoreet. Donec vel urna euismod, porttitor nisi vitae, fermentum velit. Cras rhoncus viverra ex, nec pharetra arcu molestie quis. Aliquam dignissim viverra lectus, eu congue diam bibendum sit amet. Integer vitae sapien auctor, sagittis dui ut, malesuada tortor. Nam id justo quis nulla tempus vulputate eget nec metus.

Maecenas eu sapien ac urna ullamcorper tincidunt. Proin elit nulla, elementum vitae dictum eu, facilisis vel leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras vitae dui dictum, dignissim eros eget, consequat enim. Donec vel libero at mi semper accumsan. Phasellus semper, mi eget luctus mollis, sapien lorem fringilla massa, in blandit est ipsum at tellus. Cras eu nisi dapibus, molestie nisl eu, tincidunt tellus. Ut id tempor lectus. Nunc facilisis quam urna, eu consequat augue suscipit vel. Suspendisse potenti.

Ut ac odio ac augue malesuada suscipit. Praesent quis augue ac ipsum molestie pulvinar. Nulla accumsan, mi nec commodo placerat, neque magna convallis ante, sed faucibus turpis urna in justo. Vestibulum et erat lobortis, ornare erat at, sollicitudin odio. Aliquam erat volutpat. Mauris sed mauris rutrum, porta arcu at, luctus est. Vivamus porta mollis purus, vel consectetur turpis tristique id. Donec et nulla eget ipsum ultricies ultricies ut eu orci. Cras porta neque a elit porttitor, a elementum metus ornare. Fusce molestie magna in diam rutrum, non commodo nulla dictum. Morbi mollis non augue at ornare. Integer placerat sit amet tellus quis dictum.

Vivamus id tincidunt dui. Proin a justo neque. Nullam interdum quam nibh, nec tincidunt dolor tincidunt vitae. In condimentum libero vitae est viverra, vel maximus dui feugiat. Nunc a felis a velit auctor dapibus. Cras sed vulputate turpis. Cras at venenatis ligula, eget mattis tellus. Praesent euismod nisi eget libero consectetur maximus. Nam malesuada justo sit amet odio dapibus, in faucibus arcu mattis. Quisque venenatis leo a ex porttitor, eu pulvinar mi lacinia. Suspendisse ut metus ex. Donec eu pharetra odio, vel pellentesque tellus. Ut posuere diam odio, venenatis porttitor nisi dictum quis. Aenean sed auctor risus. Maecenas et felis in tortor faucibus finibus in a nisi.
`;

// Additional data for tables and examples
const featureList = [
  'Automatic content flow across multiple pages',
  'Precise positioning with dimensional controls',
  'Flexible column layouts with independent width settings',
  'Consistent page numbering and headers/footers',
  'Optimized rendering with memoization',
  'Theme support with customizable styling options',
  'Type-safe component interfaces',
  'Responsive scaling for various page sizes',
  'Built-in validation for dimension values',
  'Comprehensive item component library',
  'Support for page breaks before/after specific items',
  'Customizable margins and padding for layout control',
  'Dynamic header and footer content',
  'Automatic calculation of content height',
  'Overflow detection and handling',
  'Support for multi-page printing',
  'Nested layout capabilities',
  'Integration with React ecosystem',
  'Responsive behavior for different screen sizes',
  'Performance optimizations for large documents'
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
    itemSpacing: 8  // Reduced spacing to allow more content per page
  }
};

// Define column layouts for specific pages
const twoColumnLayout: ColumnDefinition[] = [
  { width: 48, gap: 5 },
  { width: 52, backgroundColor: '#f8f9fa' }
];

const threeColumnLayout: ColumnDefinition[] = [
  { width: 30, backgroundColor: '#f0f9ff' },
  { width: 40 },
  { width: 30, backgroundColor: '#f0f9ff' }
];

const fourColumnLayout: ColumnDefinition[] = [
  { width: 25, backgroundColor: '#f0fff0' },
  { width: 25 },
  { width: 25 },
  { width: 25, backgroundColor: '#fff0f0' }
];

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
            style={{
              "--debug-odd-page-color": "rgba(230, 240, 255, 0.2)",
              "--debug-even-page-color": "rgba(255, 230, 240, 0.2)",
            } as React.CSSProperties}
          >
            {/* Single column layout using default */}
            <DocumentLayout>
              {/* Main heading */}
              <HeadingItem 
                fontSize={24}
                color="#1a56db"
              >
                Automatic Page Flow Demo
              </HeadingItem>
              
              <ShapeItem
                shapeType="line"
                borderColor="#333"
                borderWidth={0.5}
              />
              
              {/* Introduction */}
              <ParagraphItem
                fontSize={12}
              >
                This document demonstrates the automatic page flow functionality. 
                Items are automatically distributed across pages based on their height 
                and the remaining space on each page.
              </ParagraphItem>
              
              <CalloutItem
                variant="info"
                calloutTitle="Automatic Pagination"
              >
                With automatic pagination, you no longer need to manually place items on specific pages.
                The system automatically calculates where each item should be placed based on its dimensions.
              </CalloutItem>
              
              {/* First paragraph of lorem ipsum - full page 1 */}
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
              >
                {loremIpsum.split('\n\n')[0]}
              </ParagraphItem>

              {/* First paragraph - page 1 */}
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
              >
                {loremIpsum.split('\n\n')[1]}
              </ParagraphItem>

              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
              >
                When working with multi-page documents, it's important to understand how page breaks
                are calculated. The system tracks the available space on each page and automatically
                moves content to the next page when needed. This gives you the flexibility to focus on
                your content without worrying about manual page layout.
                
                The automatic pagination system also respects item properties like page breaks before/after,
                ensuring your content flows exactly as intended while maintaining good document structure.
              </ParagraphItem>

              {/* Third paragraph - page 1 */}
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
              >
                {loremIpsum.split('\n\n')[2]}
              </ParagraphItem>
              
              {/* Fourth paragraph - now page 2 */}
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
              >
                {loremIpsum.split('\n\n')[3]}
              </ParagraphItem>
            </DocumentLayout>
            
            
            
            {/* Two-column layout */}
            <DocumentLayout columns={twoColumnLayout} pageBreakBefore={true}>
              <CalloutItem
                variant="tip"
                calloutTitle="Design Tip"
                columnIndex={0}
              >
                With the DocumentLayout component, you can create column-based layouts anywhere in the document.
                Columns can have different widths and background colors.
              </CalloutItem>
              
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
                columnIndex={1}
              >
                {loremIpsum.split('\n\n')[4]}
              </ParagraphItem>
              
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
                columnIndex={0}
              >
                Notice how items are placed in specific columns using the columnIndex property.
                This layout is encapsulated within a DocumentLayout component, making it easy to use and reuse.
              </ParagraphItem>
              
              <ParagraphItem
                fontSize={11}
                lineHeight={1.4}
                columnIndex={1}
              >
                This approach is more flexible than setting columns at the page level.
                You can have multiple different layouts within a single document or page.
              </ParagraphItem>
            </DocumentLayout>
            
            {/* Regular content after the layout */}
            <HeadingItem 
              fontSize={14}
              color="#444"
            >
              Back to Single Column
            </HeadingItem>
            
            <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
            >
              After a layout section, content automatically returns to the default single-column flow.
              This makes it easy to mix and match different layout styles within a document.
            </ParagraphItem>
            
            {/* Three-column layout example */}
            <HeadingItem 
              fontSize={14}
              color="#333"
            >
              Three-Column Layout
            </HeadingItem>
            
            <DocumentLayout columns={threeColumnLayout} pageBreakBefore={true}>
              <ParagraphItem
                fontSize={10}
                lineHeight={1.3}
                columnIndex={0}
              >
                This is the first column in a three-column layout.
                Notice how each column maintains its own flow and styling.
              </ParagraphItem>
              
              <CalloutItem
                variant="warning"
                calloutTitle="Column Layout Note"
                columnIndex={1}
              >
                Layouts can be nested within a document at any point.
                Each layout manages its own column structure.
              </CalloutItem>
              
              <ParagraphItem
                fontSize={10}
                lineHeight={1.3}
                columnIndex={2}
              >
                This is the third column of the layout.
                Column widths can be customized for each layout.
              </ParagraphItem>
            </DocumentLayout>
            
            {/* Second callout - will be on page 4 in the first column */}
            <CalloutItem
              variant="tip"
              calloutTitle="Design Tip"
            >
              When working with automatic pagination, you still need to provide appropriate 
              height values for your items. This allows the system to accurately calculate 
              page breaks.
            </CalloutItem>
            
            {/* Second paragraph of lorem ipsum - in the second column */}
            <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
              columnIndex={1}
            >
              {loremIpsum.split('\n\n')[4]}
            </ParagraphItem>

            {/* Additional callout in first column */}
            {/* <CalloutItem
              variant="warning"
              calloutTitle="Important Note"
              columnIndex={0}
            >
              When working with complex layouts, be mindful of your content distribution.
              Balancing content across columns creates a more visually appealing document
              and improves readability for your audience.
            </CalloutItem> */}

            {/* Additional paragraph in second column */}
            {/* <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
              columnIndex={1}
            >
              {loremIpsum.split('\n\n')[5]}
              
              This additional content demonstrates how the pagination system handles
              columns of different heights. When one column fills up, content continues
              to flow in the next column or on the next page as needed.
            </ParagraphItem> */}
            
            {/* Extra content in first column that should overflow to next page */}
            {/* <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
              columnIndex={0}
            >
              {loremIpsum.split('\n\n')[6]}
              
              Notice how this content is much longer than the content in the other column.
              The pagination system should detect that this column's content exceeds the
              available space on the current page and move the excess content to the next page.
              
              This demonstrates how individual columns are tracked independently, and content
              flows properly when a column overflows, maintaining the column structure across
              multiple pages automatically.
              
              {loremIpsum.split('\n\n')[7].substring(0, 300)}
            </ParagraphItem> */}
            
            {/* Extra content in second column */}
            {/* <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
              columnIndex={1}
            >
              {loremIpsum.split('\n\n')[7].substring(300)}
              
              This content should also flow to the next page when needed, demonstrating
              how both columns can overflow independently and still maintain proper layout
              across page boundaries.
              
              {loremIpsum.split('\n\n')[8].substring(0, 200)}
            </ParagraphItem> */}

            {/* Reset to single column layout */}
            {/* <ParagraphItem
              columns={[{ width: 100 }]}
            /> */}
            
            {/* Heading for column demo */}
            {/* <HeadingItem 
              fontSize={16}
              color="#333"
            >
              Column Layout Demo
            </HeadingItem> */}
            
            {/* Explanation of the column layout */}
            {/* <ParagraphItem
              fontSize={11}
            >
              The previous pages demonstrated a two-column layout. Items can be assigned to specific columns
              using the columnIndex property. The system handles pagination with columns automatically.
              Columns can have different widths and even background colors.
            </ParagraphItem> */}

            {/* Insert a large paragraph to fill page */}
            {/* <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
            >
              {loremIpsum.split('\n\n')[8]}
              
              The pagination system automatically calculates page breaks based on the content height.
              When an item's height plus the current page position exceeds the available space, the
              item is automatically moved to the next page. This ensures that all content is properly
              displayed without manual positioning.
              
              Each page can have its own layout configuration, including column definitions, margins,
              and spacing. This flexibility allows you to create complex documents with varying layouts
              throughout, while still maintaining automatic pagination.
            </ParagraphItem> */}

            {/* Insert a sample product inventory */}
            {/* <HeadingItem
              fontSize={14}
              color="#444"
            >
              Sample Product Inventory
            </HeadingItem> */}

            {/* <ParagraphItem
              fontSize={10}
            >
              This is a placeholder for what would be a product inventory table.
              In a real application, you would use a proper table component here.
              
              Widget A (Tools) - $24.99 - 125 in stock
              Gizmo B (Electronics) - $89.95 - 42 in stock
              Doohickey C (Accessories) - $12.50 - 356 in stock
              Thingamajig D (Gadgets) - $149.99 - 18 in stock
              Whatchamacallit E (Misc) - $35.75 - 73 in stock
            </ParagraphItem> */}

            {/* <ParagraphItem
              fontSize={10}
            >
              This text demonstrates how fixed-height elements are paginated when they
              don't fit on the current page. The pagination system maintains the integrity of such
              elements by moving them entirely to the next page when necessary.
            </ParagraphItem> */}
            
            {/* Large paragraph to fill page */}
            {/* <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
            >
              {loremIpsum.split('\n\n')[9]}
              
              The automatic pagination system in Page Kit handles more than just text content.
              It can paginate various types of content, including tables, images, shapes, and
              custom components. Each component provides its height, allowing the pagination
              system to accurately calculate page breaks.
              
              This approach gives you the flexibility to create sophisticated documents with
              diverse content types while still benefiting from automatic pagination and layout.
              
              {loremIpsum.split('\n\n')[0].substring(0, 200)}
            </ParagraphItem> */}
            
            {/* Three-column layout for the next page */}
            {/* <ParagraphItem
              columns={threeColumnLayout}
            /> */}
            
            {/* Content for first column */}
            {/* <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={0}
            >
              This text appears in the first column. Notice how the columns maintain their relative 
              widths and proper spacing. The left and right columns have a subtle background color.
            </ParagraphItem>
            
            <CalloutItem
              variant="warning"
              calloutTitle="Page Layout Considerations"
              columnIndex={1}
            >
              Remember that each page has its own layout constraints. Columns only apply to the 
              specific page they are defined on.
            </CalloutItem>
            
            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={2}
            >
              This text appears in the third column. You can specify different column widths to create 
              various layouts. The sum of all column widths should equal 100%.
            </ParagraphItem>

            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={0}
            >
              {loremIpsum.split('\n\n')[0].substring(0, 500)}
              
              This content is deliberately longer than the page height to demonstrate how
              column content properly flows to the next page when it exceeds the available space.
              
              Notice how the pagination system maintains the column structure across pages,
              ensuring that content in one column doesn't affect the layout of other columns.
              
              {loremIpsum.split('\n\n')[1].substring(0, 300)}
            </ParagraphItem>

            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={1}
            >
              {loremIpsum.split('\n\n')[2].substring(0, 600)}
            </ParagraphItem>

            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={2}
            >
              {loremIpsum.split('\n\n')[3].substring(0, 500)}
              
              This column has less content than the first column but more than the second.
              This demonstrates how independent column tracking works across pages.
            </ParagraphItem>
            
            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={0}
            >
              {loremIpsum.split('\n\n')[4].substring(0, 400)}
              
              This additional content for the first column should force a third page of
              the three-column layout. By adding significantly more content to this column,
              we can see how the pagination system handles multiple pages of columnar content.
              
              The other columns may have already ended their content flow, but this column
              continues to the next page, maintaining its position and width.
              
              {loremIpsum.split('\n\n')[5].substring(0, 400)}
              
              The pagination system should properly account for this extended content,
              demonstrating that columns can span multiple pages when needed.
            </ParagraphItem>
            
            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={1}
            >
              {loremIpsum.split('\n\n')[6].substring(0, 300)}
              
              This additional content for the second column ensures that it also flows
              to subsequent pages, demonstrating how multiple columns can continue across
              page boundaries simultaneously.
              
              The pagination system should properly maintain the column structure and
              relative positioning across all pages, regardless of how much content is
              in each column.
              
              {loremIpsum.split('\n\n')[7].substring(0, 300)}
            </ParagraphItem>

            <ParagraphItem
              fontSize={10}
              lineHeight={1.3}
              columnIndex={2}
            >
              {loremIpsum.split('\n\n')[8].substring(0, 350)}
              
              With all three columns now containing significant amounts of content that
              exceeds a single page, we can fully demonstrate the pagination system's
              ability to handle complex column layouts across multiple pages.
              
              Each column maintains its relative position and width on subsequent pages,
              creating a consistent reading experience throughout the document.
              
              {loremIpsum.split('\n\n')[9].substring(0, 350)}
            </ParagraphItem>
            
            <ParagraphItem
              columns={[{ width: 100 }]}
            />
            
            {/* Four-column layout example */}
            <HeadingItem 
              fontSize={14}
              color="#333"
            >
              Four-Column Layout
            </HeadingItem>
            
            <DocumentLayout columns={fourColumnLayout} pageBreakBefore={true}>
              <HeadingItem 
                fontSize={12}
                color="#333"
                columnIndex={0}
              >
                First Column
              </HeadingItem>
              
              <ParagraphItem
                fontSize={9}
                lineHeight={1.3}
                columnIndex={0}
              >
                This demonstrates a four-column layout using the DocumentLayout component.
                Each column can have its own content, styling, and flow.
              </ParagraphItem>
              
              <ParagraphItem
                fontSize={9}
                lineHeight={1.3}
                columnIndex={1}
              >
                The second column can have different content.
                The DocumentLayout component handles the distribution automatically.
              </ParagraphItem>
              
              <ParagraphItem
                fontSize={9}
                lineHeight={1.3}
                columnIndex={2}
              >
                Third column with its own content.
                Column widths are defined when creating the layout.
              </ParagraphItem>
              
              <CalloutItem
                variant="tip"
                calloutTitle="Layout System"
                columnIndex={3}
              >
                This flexible layout system makes it easy to create complex documents
                with multiple column configurations.
              </CalloutItem>
            </DocumentLayout>
            
            <HeadingItem 
              fontSize={16}
              color="#333"
            >
              Key Features
            </HeadingItem>
            
            {featureList.map((feature, index) => (
              <ParagraphItem
                key={index}
                fontSize={11}
                lineHeight={1.3}
              >
                • {feature}
              </ParagraphItem>
            ))}

            <HeadingItem 
              fontSize={16}
              color="#333"
            >
              Page-Specific Layout Example
            </HeadingItem>
            
            <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
            >
              Unlike DocumentLayout which can flow across multiple pages, PageLayout is designed to be 
              used within a specific page and doesn't support pagination across page boundaries.
              This makes it ideal for structured content that must stay together on a single page.
            </ParagraphItem>
            
            <PageLayout columns={[
              { width: 40, backgroundColor: '#f5f5f5' },
              { width: 60 }
            ]}>
              <HeadingItem
                fontSize={14}
                color="#444"
                columnIndex={0}
              >
                Page-Constrained Layout
              </HeadingItem>
              
              <ParagraphItem
                fontSize={10}
                lineHeight={1.3}
                columnIndex={0}
              >
                This PageLayout component is constrained to a single page.
                Its content will not flow across page boundaries, making it
                ideal for content that should always appear together.
              </ParagraphItem>
              
              <ParagraphItem
                fontSize={10}
                lineHeight={1.3}
                columnIndex={1}
              >
                Use PageLayout when you need column layouts within a specific
                page context. This ensures all content in the layout stays on
                the same page rather than breaking across pages.
              </ParagraphItem>
            </PageLayout>

            <ParagraphItem
              fontSize={11}
              lineHeight={1.4}
            >
              The example above demonstrates the difference between DocumentLayout and PageLayout.
              
              - DocumentLayout: Can span multiple pages, automatically handling pagination and flow.
              - PageLayout: Constrained to a single page, ensuring all its content stays together.
              
              This separation provides clearer semantics and more intuitive behavior based on where
              and how you want to use column layouts in your documents.
            </ParagraphItem>

            <CalloutItem
              variant="note"
              calloutTitle="Next Steps"
            >
              Try experimenting with different column configurations, content types, and page settings
              to see how the automatic pagination system adapts to your specific document needs.
              The Page Kit library provides a flexible foundation for creating sophisticated multi-page
              documents with minimal effort.
            </CalloutItem>
          </Document>
        </PageKitConfigProvider>
        
        <div className="p-4 mt-8 bg-white rounded shadow">
          <h2 className="mb-2 text-xl font-semibold">Improvements Made</h2>
          <ul className="pl-5 mt-2 space-y-1 list-disc">
            <li><strong>Automatic pagination</strong> - Content flows naturally across pages</li>
            <li><strong>Column-aware pagination</strong> - Each column tracks its content height independently</li>
            <li><strong>Memoized calculations</strong> - Performance optimized with React.memo and useMemo</li>
            <li><strong>Type-safe props</strong> - DOM props are properly filtered and typed</li>
            <li><strong>Column layouts</strong> - Support for multi-column pages with individual item placement</li>
            <li><strong>Validation</strong> - Input validation for dimension values and column definitions</li>
            <li><strong>Layout component</strong> - Flexible column layouts that can be nested within documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 