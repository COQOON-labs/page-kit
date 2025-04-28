# Page Kit Tutorial

This tutorial will guide you through using Page Kit to create professional document layouts with React. Page Kit enables precise document creation with a familiar component-based approach.

## Table of Contents

- [Page Kit Tutorial](#page-kit-tutorial)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Basic Document Setup](#basic-document-setup)
  - [Document Components](#document-components)
    - [Text Components](#text-components)
      - [HeadingItem](#headingitem)
      - [ParagraphItem](#paragraphitem)
    - [Image Component](#image-component)
    - [Shape Component](#shape-component)
    - [Callout Component](#callout-component)
  - [Layout and Positioning](#layout-and-positioning)
    - [Using Dimensions](#using-dimensions)
    - [Natural Flow Layout](#natural-flow-layout)
    - [Column Layouts](#column-layouts)
      - [Document-Level Columns](#document-level-columns)
      - [Page-Level Columns](#page-level-columns)
      - [Column Layout Tips](#column-layout-tips)
      - [Column-Aware Pagination](#column-aware-pagination)
      - [Key Pagination Features](#key-pagination-features)
  - [Theming and Configuration](#theming-and-configuration)
  - [Creating Custom Components](#creating-custom-components)
  - [Advanced Techniques](#advanced-techniques)
    - [Multi-Page Documents](#multi-page-documents)
    - [Text Overflow Between Pages](#text-overflow-between-pages)
    - [Using Custom Hooks](#using-custom-hooks)
    - [Accessing Configuration](#accessing-configuration)
  - [Conclusion](#conclusion)

## Installation

```bash
npm install page-kit-core
```

Add Page Kit to your Tailwind configuration:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/page-kit-core/dist/**/*.{js,mjs}",
  ],
  // ...rest of your config
};
```

## Basic Document Setup

Create your first DIN A4 document:

```tsx
import {
  Page,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
} from "page-kit-core";

function MyDocument() {
  return (
    <PageKitConfigProvider>
      <Page maxWidth={800} containerWidth={100} shadow={true}>
        <HeadingItem fontSize={24} color="#1a56db">
          My First Document
        </HeadingItem>

        <ParagraphItem fontSize={12}>
          This is a DIN A4 document that maintains its proportions when resized.
          All content flows naturally within the document.
        </ParagraphItem>
      </Page>
    </PageKitConfigProvider>
  );
}
```

## Document Components

Page Kit provides several specialized components for document creation.

### Text Components

#### HeadingItem

Used for document titles and section headings:

```tsx
<HeadingItem fontSize={24} fontWeight="bold" color="#1a56db" textAlign="center">
  Document Title
</HeadingItem>
```

#### ParagraphItem

Used for regular text content:

```tsx
<ParagraphItem fontSize={12} lineHeight={1.5} color="#333">
  This is a paragraph of text that can contain multiple lines. Line height and
  other text properties can be configured.
</ParagraphItem>
```

### Image Component

Add images to your document:

```tsx
<ImageItem
  dimensions={{ width: 80, height: 60 }}
  src="/path/to/image.jpg"
  alt="Description"
  objectFit="cover"
/>
```

### Shape Component

Add geometric shapes like lines, rectangles, and ellipses:

```tsx
// Horizontal line separator
<ShapeItem
  dimensions={{ width: 170, height: 2 }}
  shapeType="line"
  borderColor="#333"
  borderWidth={0.5}
/>

// Rectangle
<ShapeItem
  dimensions={{ width: 50, height: 50 }}
  shapeType="rectangle"
  backgroundColor="#e3f2fd"
  borderColor="#2196f3"
  borderWidth={1}
/>

// Circle/Ellipse
<ShapeItem
  dimensions={{ width: 50, height: 50 }}
  shapeType="ellipse"
  backgroundColor="#f1f8e9"
  borderColor="#8bc34a"
  borderWidth={1}
/>
```

### Callout Component

Highlight important information with callouts:

```tsx
// Info callout
<CalloutItem
  dimensions={{ width: 170, height: 40 }}
  variant="info"
  title="Important Information"
  showIcon={true}
>
  This is important information that needs to be highlighted.
</CalloutItem>

// Warning callout
<CalloutItem
  dimensions={{ width: 170, height: 50 }}
  variant="warning"
  title="Warning"
>
  Be careful with this process. Make sure to follow all steps.
</CalloutItem>

// Error callout
<CalloutItem
  dimensions={{ width: 170, height: 40 }}
  variant="error"
  title="Error"
>
  This operation failed. Please check your input and try again.
</CalloutItem>

// Tip callout
<CalloutItem
  dimensions={{ width: 170, height: 40 }}
  variant="tip"
  title="Pro Tip"
>
  Here's a faster way to accomplish this task.
</CalloutItem>

// Note callout
<CalloutItem
  dimensions={{ width: 170, height: 40 }}
  variant="note"
  title="Note"
>
  Additional information that might be helpful but isn't critical.
</CalloutItem>
```

You can customize callouts with your own colors:

```tsx
<CalloutItem
  dimensions={{ width: 170, height: 40 }}
  variant="info"
  title="Custom Callout"
  borderColor="#9c27b0"
  backgroundColor="#f3e5f5"
  textColor="#4a148c"
  icon="🔮" // Custom icon
>
  This callout has custom colors and icon.
</CalloutItem>
```

## Layout and Positioning

### Using Dimensions

Image and shape components use the `dimensions` prop for sizing and positioning:

```tsx
dimensions={{ width: 100, height: 50 }}
```

Width and height are specified in millimeters (mm) for consistency with real-world document measurements. Page Kit handles conversion to appropriate screen units.

Text components like HeadingItem and ParagraphItem don't use the dimensions prop - they flow naturally within the document, adapting to their content and container width.

### Natural Flow Layout

For a more natural document flow, you can use flex containers:

```tsx
<div className="flex flex-row gap-4">
  {/* First column */}
  <div className="flex flex-col">
    <ImageItem
      dimensions={{ width: 80, height: 60 }}
      src="/example-image.jpg"
      alt="Example"
    />

    <ParagraphItem
      dimensions={{ width: 80, height: 20 }}
      fontSize={10}
      textAlign="center"
    >
      Image caption
    </ParagraphItem>
  </div>

  {/* Second column */}
  <ParagraphItem dimensions={{ width: 80, height: 80 }} fontSize={12}>
    Text content next to the image.
  </ParagraphItem>
</div>
```

### Column Layouts

Page Kit supports flexible column layouts to organize content in a structured, multi-column format.

#### Document-Level Columns

Apply columns across an entire document:

```tsx
import {
  Document,
  HeadingItem,
  ParagraphItem,
  PageKitConfigProvider,
} from "page-kit-core";

function ColumnDocument() {
  return (
    <PageKitConfigProvider>
      <Document
        columns={[
          { width: 30 }, // Left column takes 30% of the page width
          { width: 70 }, // Right column takes 70% of the page width
        ]}
        pageProps={{
          maxWidth: 800,
          shadow: true,
        }}
      >
        {/* Sidebar content */}
        <HeadingItem
          columnIndex={0}
          dimensions={{ width: 50, height: 20 }}
          fontSize={18}
        >
          Sidebar
        </HeadingItem>

        <ParagraphItem
          columnIndex={0}
          dimensions={{ width: 50, height: 60 }}
          fontSize={12}
        >
          Navigation, metadata, and other supporting information can be placed
          in this sidebar column.
        </ParagraphItem>

        {/* Main content */}
        <HeadingItem
          columnIndex={1}
          dimensions={{ width: 120, height: 20 }}
          fontSize={24}
        >
          Main Content
        </HeadingItem>

        <ParagraphItem
          columnIndex={1}
          dimensions={{ width: 120, height: 100 }}
          fontSize={12}
        >
          Your primary content goes here. The column system automatically
          positions content within the specified column width. This helps create
          consistent, professional layouts with minimal effort.
        </ParagraphItem>
      </Document>
    </PageKitConfigProvider>
  );
}
```

#### Page-Level Columns

Apply columns to a specific page:

```tsx
<Page
  columns={[
    { width: 50 }, // Left column takes 50% of page width
    { width: 50 }, // Right column takes 50% of page width
  ]}
>
  <HeadingItem
    columnIndex={0}
    dimensions={{ width: 80, height: 20 }}
    fontSize={18}
  >
    Left Column
  </HeadingItem>

  <HeadingItem
    columnIndex={1}
    dimensions={{ width: 80, height: 20 }}
    fontSize={18}
  >
    Right Column
  </HeadingItem>

  {/* Additional content */}
</Page>
```

#### Column Layout Tips

- The `columnIndex` prop specifies which column a component should appear in
- Set column widths as percentages that sum to 100 for the entire page
- Column layouts work with all Page Kit components
- Components maintain their positioning within their assigned column
- Create magazine-style layouts, sidebars, or multi-column articles
- For responsive documents, column widths will maintain their proportions when resized

#### Column-Aware Pagination

Page Kit combines column layouts with automatic pagination to create complex multi-column documents that flow naturally across pages:

```tsx
import {
  Document,
  HeadingItem,
  ParagraphItem,
  PageKitConfigProvider,
} from "page-kit-core";

function MultiPageColumnDocument() {
  return (
    <PageKitConfigProvider>
      <Document
        columns={[
          { width: 30, backgroundColor: "#f8f9fa" }, // Sidebar column
          { width: 70 }, // Main content column
        ]}
        pageProps={{
          maxWidth: 800,
          shadow: true,
          headerContent: <div>Document with Columns</div>,
        }}
      >
        {/* Sidebar navigation - stays in column 0 across all pages */}
        <HeadingItem
          columnIndex={0}
          dimensions={{ width: 50, height: 20 }}
          fontSize={16}
        >
          Document Sections
        </HeadingItem>

        <ParagraphItem
          columnIndex={0}
          dimensions={{ width: 50, height: 30 }}
          fontSize={12}
        >
          • Introduction • Main Content • Appendix
        </ParagraphItem>

        {/* Additional sidebar content that continues on next pages */}
        <ParagraphItem
          columnIndex={0}
          dimensions={{ width: 50, height: 800 }} // Very tall content
          fontSize={12}
        >
          This content will continue on subsequent pages while staying in the
          sidebar column. Each column tracks its content height independently
          and creates page breaks when needed.
        </ParagraphItem>

        {/* Main content - stays in column 1 across all pages */}
        <HeadingItem
          columnIndex={1}
          dimensions={{ width: 120, height: 20 }}
          fontSize={24}
        >
          Introduction
        </HeadingItem>

        <ParagraphItem
          columnIndex={1}
          dimensions={{ width: 120, height: 60 }}
          fontSize={12}
        >
          This is the introduction section that appears in the main content
          area. When content exceeds the available page height, pagination
          occurs automatically while maintaining the column layout.
        </ParagraphItem>

        <HeadingItem
          columnIndex={1}
          dimensions={{ width: 120, height: 20 }}
          fontSize={24}
        >
          Main Content
        </HeadingItem>

        <ParagraphItem
          columnIndex={1}
          dimensions={{ width: 120, height: 400 }} // Tall content
          fontSize={12}
        >
          The pagination system tracks each column independently, allowing for
          complex document layouts where different columns can have varying
          amounts of content. This creates a natural content flow where the
          sidebar and main content areas maintain their relative positions
          across all pages of the document.
        </ParagraphItem>
      </Document>
    </PageKitConfigProvider>
  );
}
```

#### Key Pagination Features

- **Column Continuity**: Content maintains its assigned column across page breaks
- **Independent Flow**: Each column can break onto new pages separately
- **Synchronized Layout**: The same column structure appears on each page
- **Automatic Balancing**: Items without a `columnIndex` are distributed to balance column heights

This system makes it possible to create complex documents like reports, books, or magazines with consistent layouts across all pages.

## Theming and Configuration

Configure your document's appearance using `PageKitConfigProvider`:

```tsx
import { PageKitConfigProvider, Page, HeadingItem } from "page-kit-core";

const myConfig = {
  typography: {
    fontFamily: "Georgia, serif",
    baseFontSize: 12,
    headingFontFamily: "Helvetica, sans-serif",
  },
  colors: {
    primary: "#3f51b5",
    secondary: "#f50057",
    info: "#2196f3",
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    background: "#ffffff",
    text: "#212121",
  },
  layout: {
    padding: 20,
    itemSpacing: 10,
  },
  header: {
    show: true,
    height: 15,
    backgroundColor: "#f5f5f5",
    textColor: "#212121",
  },
  footer: {
    show: true,
    height: 15,
    backgroundColor: "#f5f5f5",
    textColor: "#212121",
    showPageNumbers: true,
  },
};

function ThemedDocument() {
  return (
    <PageKitConfigProvider config={myConfig}>
      <Page maxWidth={800}>{/* Document content */}</Page>
    </PageKitConfigProvider>
  );
}
```

## Creating Custom Components

Page Kit makes it easy to create your own document components:

```tsx
import { createPageItem, PageItemProps } from "page-kit-core";

// 1. Define your component props
interface QuoteItemProps extends PageItemProps {
  author?: string;
  citation?: string;
}

// 2. Create your component
export const QuoteItem = createPageItem<QuoteItemProps>({
  displayName: "QuoteItem",
  baseClassName: "page-quote-item",

  // Set default props
  defaultProps: {
    author: "Unknown",
  },

  // Define the render function
  renderContent: (props, dimensionInfo) => {
    const { children, author = "Unknown", citation } = props;

    return (
      <div className="flex flex-col h-full w-full p-4 italic border-l-4 border-gray-300">
        <div className="flex-1 mb-4 text-gray-700">"{children}"</div>

        <div className="text-right font-medium">
          — {author}
          {citation && (
            <span className="block text-sm text-gray-500">{citation}</span>
          )}
        </div>
      </div>
    );
  },
});

// 3. Use your custom component
// <QuoteItem
//   dimensions={{ width: 170, height: 80 }}
//   author="Albert Einstein"
//   citation="On Relativity, 1921"
// >
//   The important thing is not to stop questioning. Curiosity has its own reason for existing.
// </QuoteItem>
```

## Advanced Techniques

### Multi-Page Documents

Create documents that span multiple pages:

```tsx
<PageKitConfigProvider>
  {/* First Page */}
  <Page maxWidth={800} className="mb-8">
    {/* First page content */}
  </Page>

  {/* Second Page */}
  <Page maxWidth={800}>{/* Second page content */}</Page>
</PageKitConfigProvider>
```

### Text Overflow Between Pages

You can implement text that flows between pages:

```tsx
function MultiPageText({
  text,
  maxHeight,
  dimensions,
  fontSize = 11,
  lineHeight = 1.5,
}) {
  const [page1Text, setPage1Text] = useState("");
  const [page2Text, setPage2Text] = useState("");

  useEffect(() => {
    // Estimate characters per line
    const avgCharWidth = fontSize * 0.5;
    const charsPerLine = Math.floor((dimensions.width || 100) / avgCharWidth);

    // Estimate lines that fit in maxHeight
    const lineHeightPx = fontSize * lineHeight;
    const maxLines = Math.floor(maxHeight / lineHeightPx);

    // Estimate total characters that fit on first page
    const roughCharCount = maxLines * charsPerLine;

    // Split text between pages
    setPage1Text(text.substring(0, roughCharCount));
    setPage2Text(text.substring(roughCharCount));
  }, [text, maxHeight, fontSize, lineHeight, dimensions.width]);

  return (
    <>
      {/* Text for first page */}
      <ParagraphItem
        dimensions={dimensions}
        fontSize={fontSize}
        lineHeight={lineHeight}
      >
        {page1Text}
      </ParagraphItem>

      {/* Text for second page */}
      {page2Text && (
        <ParagraphItem
          dimensions={dimensions}
          fontSize={fontSize}
          lineHeight={lineHeight}
          className="page-2-content"
        >
          {page2Text}
        </ParagraphItem>
      )}
    </>
  );
}
```

### Using Custom Hooks

Page Kit provides several hooks for component development:

```tsx
import {
  useElementDimensions,
  useTextStyles,
  useShapeStyles,
} from "page-kit-core";

// In your component:
const { dimensionClasses } = useElementDimensions(dimensions);
const { textStyles, textClasses } = useTextStyles({
  fontSize,
  fontWeight,
  color,
});
const { shapeStyles } = useShapeStyles({ shapeType, backgroundColor });
```

### Accessing Configuration

Use the configuration system in custom components:

```tsx
import { usePageKitConfig } from "page-kit-core";

function MyCustomComponent() {
  const config = usePageKitConfig();

  return (
    <div style={{ color: config.colors?.primary }}>
      Themed component using configuration
    </div>
  );
}
```

## Conclusion

This tutorial covered the essential aspects of using Page Kit for document creation. The component-based approach combined with the millimeter-based layout system makes it easy to create precise, responsive documents that maintain proper proportions.

For more examples and advanced usage, check out the [example application](https://github.com/COQOON/page-kit/tree/main/packages/example-app) and the [component documentation](https://github.com/COQOON/page-kit/tree/main/packages/page-kit-core).
