# Page Kit

A React and Tailwind CSS component library with DIN A4 document editing capabilities.

**A project by [COQOON](https://coqoon.com)**

## Project Structure

This is a monorepo containing:

- `packages/page-kit-core`: The component library
- `packages/example-app`: An example application using the component library

## Requirements

- Node.js 22.x or later

## Getting Started

Install dependencies:

```bash
npm install
```

Build the component library:

```bash
npm run build
```

Run the example app:

```bash
npm run dev
```

## Development

### Component Library

The component library is built using:

- React
- TypeScript
- Tailwind CSS
- tsup for building

### Example App

The example app is built using:

- React
- TypeScript
- Tailwind CSS
- Vite

## Features

### UI Components

The library includes a set of UI components like buttons, cards, and badges.

### DIN A4 Document Editor

A key feature of Page Kit is its DIN A4 document editing capabilities:

- **Responsive DIN A4 Pages**: Create precise DIN A4 pages that maintain their aspect ratio (1:√2) at any screen size
- **Automatic Scaling**: All content scales automatically when the viewport size changes
- **Millimeter-Based Positioning**: Position items on the page using real-world millimeter measurements
- **Various Page Items**: Add text, images, and shapes to your documents

## Usage

### Installation

```bash
npm install page-kit-core
```

### Tailwind CSS Integration

To use this library with Tailwind CSS, you'll need to configure your Tailwind setup to scan the component library files:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add this line to include the page-kit components
    "./node_modules/page-kit-core/dist/**/*.{js,mjs}",
  ],
  // ...rest of your config
};
```

### Styled Components Usage

Each component comes with a default styled version that includes Tailwind styling:

```jsx
import { Button, Card, CardHeader, CardFooter, Badge } from "page-kit-core";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h1>Hello World</h1>
        <Badge variant="primary">New</Badge>
      </CardHeader>
      <p>This is a styled card component.</p>
      <CardFooter>
        <Button variant="primary">Click Me</Button>
      </CardFooter>
    </Card>
  );
}
```

### Unstyled Components

For more flexibility, you can use the unstyled component variants which don't include any predefined styles:

```jsx
import {
  UnstyledButton,
  UnstyledCard,
  UnstyledCardHeader,
  UnstyledCardFooter,
  UnstyledBadge,
} from "page-kit-core";

function MyCustomComponent() {
  return (
    <UnstyledCard className="my-custom-card">
      <UnstyledCardHeader className="my-custom-header">
        <h1>Custom Styled</h1>
        <UnstyledBadge className="my-badge">New</UnstyledBadge>
      </UnstyledCardHeader>
      <p>Custom styling applied via your own classes.</p>
      <UnstyledCardFooter className="my-footer">
        <UnstyledButton className="my-button">Click Me</UnstyledButton>
      </UnstyledCardFooter>
    </UnstyledCard>
  );
}
```

### DIN A4 Document Example

Create a responsive DIN A4 page with various content items:

```jsx
import {
  Page,
  HeadingItem,
  ParagraphItem,
  ImageItem,
  ShapeItem,
} from "page-kit-core";

function DocumentExample() {
  return (
    <Page maxWidth={800} containerWidth={100} shadow={true}>
      {/* Header with title */}
      <HeadingItem
        position={{ x: 20, y: 20 }}
        size={{ width: 170, height: 15 }}
        fontSize={18}
      >
        My DIN A4 Document
      </HeadingItem>

      {/* Line separator */}
      <ShapeItem
        position={{ x: 20, y: 45 }}
        size={{ width: 170, height: 2 }}
        shapeType="line"
        borderColor="#333"
        borderWidth={0.5}
      />

      {/* Main content */}
      <ParagraphItem
        position={{ x: 20, y: 60 }}
        size={{ width: 170, height: 40 }}
        fontSize={12}
      >
        This document maintains the DIN A4 aspect ratio and scales automatically
        when the viewport size changes. All content is positioned precisely in
        millimeters.
      </ParagraphItem>

      {/* Image example */}
      <ImageItem
        position={{ x: 20, y: 110 }}
        size={{ width: 80, height: 60 }}
        src="/example-image.jpg"
        alt="Example"
      />
    </Page>
  );
}
```

### Utility Functions

The library also exports utility functions:

```jsx
import { cn } from "page-kit-core";

// Merge multiple class names
const className = cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" ? "primary-class" : "secondary-class"
);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Developers

- Benjamin Gröner ([@bgroener](mailto:bgroener@coqoon.com))

## License

MIT
