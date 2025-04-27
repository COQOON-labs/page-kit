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

The example app includes comprehensive demonstrations of all components, including:

- DIN A4 document layout
- Standard components (HeadingItem, ParagraphItem, ImageItem, ShapeItem, CalloutItem)
- Custom component creation examples
- Multi-page document handling

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
  CalloutItem,
} from "page-kit-core";

function DocumentExample() {
  return (
    <Page maxWidth={800} containerWidth={100} shadow={true}>
      {/* Header with title */}
      <HeadingItem dimensions={{ width: 170, height: 15 }} fontSize={18}>
        My DIN A4 Document
      </HeadingItem>

      {/* Line separator */}
      <ShapeItem
        dimensions={{ width: 170, height: 2 }}
        shapeType="line"
        borderColor="#333"
        borderWidth={0.5}
      />

      {/* Main content */}
      <ParagraphItem dimensions={{ width: 170, height: 40 }} fontSize={12}>
        This document maintains the DIN A4 aspect ratio and scales automatically
        when the viewport size changes. All content is positioned precisely in
        millimeters.
      </ParagraphItem>

      {/* Callout for important information */}
      <CalloutItem
        dimensions={{ width: 170, height: 40 }}
        variant="info"
        title="Important Notice"
        showIcon={true}
      >
        Page Kit helps you create professional document layouts using React
        components. All elements maintain proper proportions when scaled.
      </CalloutItem>

      {/* Image example */}
      <ImageItem
        dimensions={{ width: 80, height: 60 }}
        src="/example-image.jpg"
        alt="Example"
      />
    </Page>
  );
}
```

### Document Components

Page Kit provides various specialized components for document creation:

#### Text Components

- `HeadingItem`: For titles and section headings
- `ParagraphItem`: For regular text content

#### Visual Components

- `ImageItem`: For displaying images with various sizing options
- `ShapeItem`: For displaying geometric shapes (rectangle, ellipse, line)
- `CalloutItem`: For highlighting important information with various styles

#### Callout Component

The `CalloutItem` component is designed for highlighting important information in documents:

```jsx
// Available variants: info, warning, error, tip, note
<CalloutItem
  dimensions={{ width: 170, height: 50 }}
  variant="warning"
  title="Important Warning"
  showIcon={true}
>
  This is important information that needs to stand out in your document.
</CalloutItem>
```

You can customize callouts with your own colors and icons:

```jsx
<CalloutItem
  dimensions={{ width: 170, height: 40 }}
  variant="tip"
  title="Pro Tip"
  borderColor="#9c27b0" // Custom border color
  backgroundColor="#f3e5f5" // Custom background color
  textColor="#4a148c" // Custom text color
  icon="💡" // Custom icon
>
  Here's a helpful tip for using this feature effectively.
</CalloutItem>
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

We welcome contributions to Page Kit! This section outlines the process for contributing to this project.

### Development Workflow

1. **Fork the repository**: Start by forking the repository to your own GitHub account.

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR-USERNAME/page-kit.git
   cd page-kit
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a branch**:

   ```bash
   git checkout -b your-branch-name
   ```

   Branch naming convention:

   - `feature/` for new features (e.g., `feature/button-component`)
   - `fix/` for bug fixes (e.g., `fix/button-alignment`)
   - `docs/` for documentation changes (e.g., `docs/api-reference`)
   - `refactor/` for code refactoring (e.g., `refactor/component-structure`)

5. **Make your changes**: Implement your feature or fix.

6. **Follow code style**: Ensure your code follows the project's coding standards.

7. **Write tests**: Add tests for your changes when applicable.

8. **Run tests locally**:

   ```bash
   npm run test
   ```

9. **Build locally to verify**:
   ```bash
   npm run build
   ```

### Pull Request Process

1. **Update your fork**: Before submitting a PR, make sure your fork is up to date with the main repository:

   ```bash
   git remote add upstream https://github.com/COQOON/page-kit.git
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**:

   ```bash
   git push origin your-branch-name
   ```

3. **Create a Pull Request**: Go to the original Page Kit repository and create a PR from your fork.

4. **Fill out the PR template**: Be sure to fill out all sections of the PR template.

5. **Request review**: Assign reviewers to your PR.

6. **Address feedback**: Make any requested changes to your PR based on review feedback.

7. **Wait for approval**: Once your PR is approved, a maintainer will merge it.

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

Example:

```
feat(button): add support for icon placement
```

### Release Process

The project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and package publishing. The release process works as follows:

1. **Development Work**:

   - All feature development happens in feature branches
   - Pull requests are merged into the `develop` branch

2. **Release Preparation**:

   - When ready for a release, create a PR from `develop` to `main`
   - This PR should include any final documentation updates and version-specific changes

3. **Automated Release Process**:

   - When a PR from `develop` to `main` is merged, the release workflow is triggered
   - The GitHub workflow `.github/workflows/release.yml` handles:
     - Running tests and building the project
     - Analyzing commits to determine the new version number
     - Updating the CHANGELOG.md automatically
     - Publishing to npm
     - Creating a GitHub release
     - Tagging the release with format `v{version}`

4. **Version Determination**:
   - Versioning follows [Semantic Versioning](https://semver.org/)
   - Version bumps are determined automatically based on commit types:
     - `feat`: Minor version bump (new feature)
     - `fix`: Patch version bump (bug fix)
     - Commits with `BREAKING CHANGE` in the commit message: Major version bump
     - Documentation, refactoring, and style changes: Patch version bump

This automated process ensures consistent releases and eliminates manual version management. The configuration for semantic-release can be found in the `.releaserc` file at the root of the repository.

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Developers

- Benjamin Gröner ([@bgroener](mailto:bgroener@coqoon.com))

## License

MIT
