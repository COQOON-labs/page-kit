// Export all components with named exports
export * from './components/Document';
export * from './components/Page';
export * from './components/PageItem';
// export * from './components/Layout'; // Removed legacy Layout

// Import and export the new layout components directly
export { default as DocumentLayout } from './components/DocumentLayout';
export { default as PageLayout } from './components/PageLayout';

export * from './config';
export * from './components/ErrorBoundary'; 