# Page Kit Core

A powerful toolkit for creating print-ready documents with pixel-perfect layout in React applications.

## Features

- DIN A4 page rendering with proper scaling
- Precise positioning of document elements
- Header and footer support
- Multi-page document handling
- Automatic pagination for content flow
- Customizable document themes
- Flexible column layouts with configurable widths

## Installation

```bash
npm install @page-kit/core
```

## Basic Usage

```jsx
import {
  Page,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
} from "@page-kit/core";

function MyDocument() {
  return (
    <PageKitConfigProvider>
      <Page>
        <HeadingItem fontSize={24}>My Document</HeadingItem>

        <ParagraphItem fontSize={12}>
          This is a sample document created with Page Kit.
        </ParagraphItem>
      </Page>
    </PageKitConfigProvider>
  );
}
```

## Automatic Pagination

Page Kit supports automatic pagination, which allows content to flow naturally between pages without manual page breaks.

### Using the Document Component

```jsx
import {
  Document,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
} from "@page-kit/core";

function MyMultiPageDocument() {
  return (
    <PageKitConfigProvider>
      <Document
        pageProps={{
          maxWidth: 800,
          shadow: true,
          headerContent: <div>My Document</div>,
          footerContent: (
            <div>
              Page {"{pageNumber}"} of {"{totalPages}"}
            </div>
          ),
        }}
      >
        <HeadingItem fontSize={24}>Automatic Pagination Demo</HeadingItem>

        {/* Add as many items as you want - they'll flow automatically */}
        <ParagraphItem fontSize={12}>
          This content will automatically flow to the next page if it doesn't
          fit.
        </ParagraphItem>

        {/* More content... */}
      </Document>
    </PageKitConfigProvider>
  );
}
```

### How It Works

The `Document` component:

1. Calculates the available height on each page
2. Measures the height of each child item
3. Automatically distributes items across pages
4. Handles page numbering
5. Maintains consistent headers and footers

When using automatic pagination, it's important to specify accurate heights for your items to ensure proper page breaks.

## Column Layouts

Page Kit supports flexible column layouts for organizing content within your documents.

### Document-Level Columns

You can define columns for an entire document:

```jsx
import {
  Document,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
} from "@page-kit/core";

function ColumnLayoutDemo() {
  return (
    <PageKitConfigProvider>
      <Document
        // Define columns at the document level
        columns={[
          { width: 30 }, // Left column taking 30% of the page width
          { width: 70 }, // Right column taking 70% of the page width
        ]}
        pageProps={{
          maxWidth: 800,
          shadow: true,
        }}
      >
        {/* Content for the first column */}
        <HeadingItem columnIndex={0} fontSize={18}>
          Left Column
        </HeadingItem>

        <ParagraphItem columnIndex={0} fontSize={12}>
          This content appears in the left column of all pages.
        </ParagraphItem>

        {/* Content for the second column */}
        <HeadingItem columnIndex={1} fontSize={24}>
          Main Content
        </HeadingItem>

        <ParagraphItem columnIndex={1} fontSize={12}>
          This content appears in the right column of all pages.
        </ParagraphItem>
      </Document>
    </PageKitConfigProvider>
  );
}
```

### Page-Specific Columns

You can also define columns for specific pages:

```jsx
<Page columns={[{ width: 50 }, { width: 50 }]}>
  {/* Your content with columnIndex specified */}
</Page>
```

### Key Benefits

- **Flexible Layout Options**: Create sidebars, multi-column articles, and magazine-style layouts
- **Independent Column Widths**: Define custom widths for each column
- **Automatic Content Placement**: Items are positioned within their assigned column
- **Responsive Scaling**: Column layouts maintain their proportions when scaled

### Column-Aware Pagination

Page Kit's automatic pagination system is column-aware, meaning content can flow independently within each column:

```jsx
<Document
  columns={[
    { width: 30 }, // Sidebar column
    { width: 70 }, // Main content column
  ]}
  pageProps={{ maxWidth: 800 }}
>
  {/* Sidebar content - stays in column 0 */}
  <HeadingItem columnIndex={0} fontSize={16}>
    Navigation
  </HeadingItem>

  <ParagraphItem columnIndex={0}>
    This tall sidebar content will cause its column to create a page break, but
    won't affect content in column 1 until it also needs to break.
  </ParagraphItem>

  {/* Main content - stays in column 1 */}
  <HeadingItem columnIndex={1} fontSize={24}>
    Main Content
  </HeadingItem>

  <ParagraphItem columnIndex={1}>
    This content appears in the main column and will flow to the next page when
    this column is full, independent of the sidebar column.
  </ParagraphItem>
</Document>
```

#### How Column Pagination Works:

1. **Independent Column Tracking**: Each column's height is tracked separately
2. **Column-Specific Breaks**: Page breaks occur when a specific column overflows
3. **Automatic Distribution**: Items without a `columnIndex` are distributed to balance column heights
4. **Layout Preservation**: Column layouts are maintained across all pages of your document

This approach allows for complex multi-column documents with proper pagination for each column's content flow.

## License

MIT
