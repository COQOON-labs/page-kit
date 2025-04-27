# Page Kit Core

A powerful toolkit for creating print-ready documents with pixel-perfect layout in React applications.

## Features

- DIN A4 page rendering with proper scaling
- Precise positioning of document elements
- Header and footer support
- Multi-page document handling
- Automatic pagination for content flow
- Customizable document themes

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
        <HeadingItem dimensions={{ width: 170, height: 20 }} fontSize={24}>
          My Document
        </HeadingItem>

        <ParagraphItem dimensions={{ width: 170, height: 40 }} fontSize={12}>
          This is a sample document created with Page Kit.
        </ParagraphItem>
      </Page>
    </PageKitConfigProvider>
  );
}
```

## Automatic Pagination

Page Kit now supports automatic pagination, which allows content to flow naturally between pages without manual page breaks.

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
        <HeadingItem dimensions={{ width: 170, height: 20 }} fontSize={24}>
          Automatic Pagination Demo
        </HeadingItem>

        {/* Add as many items as you want - they'll flow automatically */}
        <ParagraphItem dimensions={{ width: 170, height: 40 }} fontSize={12}>
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

## License

MIT
