import React, { useState, useEffect } from 'react';
import {
  Document,
  PageKitConfigProvider,
  HeadingItem,
  ParagraphItem,
  ImageItem,
  ShapeItem,
  CalloutItem
} from 'page-kit-core';

// Sample long text for testing page breaks
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis magna et urna faucibus, vel condimentum dolor ultricies. Fusce cursus libero vitae lorem placerat, at vehicula ligula pharetra. Donec volutpat purus vitae arcu bibendum, id consequat nisi ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur at nunc in quam ullamcorper dignissim. Morbi feugiat enim ac ipsum porttitor volutpat. Phasellus id dui molestie, sagittis enim vitae, tincidunt lectus. Maecenas eget gravida felis, a accumsan nisl. Mauris non nulla congue, dictum neque nec, faucibus risus. Aliquam sed dui sit amet orci volutpat dignissim. Cras nec velit eu dui fermentum placerat. Etiam rhoncus diam vitae sem egestas porta. Cras malesuada, augue vitae ultrices interdum, magna magna pellentesque odio, sed finibus nibh urna vel nulla. Mauris non quam vitae eros imperdiet imperdiet vel non orci. Donec luctus faucibus nisi, at ultricies risus consequat vel. Nulla aliquam quam eget purus accumsan, ac congue enim accumsan. Vivamus luctus fermentum viverra. In vitae consequat eros, eget aliquet felis. Nulla vel mauris nulla. Sed sagittis dictum risus in sagittis. Nulla facilisi. In fermentum sit amet dolor vitae tempus. Quisque vel venenatis eros, vel pretium eros. Proin non massa diam. Cras dictum leo nec nisi lobortis, id tincidunt dui luctus. Nam facilisis, magna eget vulputate commodo, felis eros lobortis mi, vel placerat elit nibh ut dui. Curabitur euismod elit ac placerat malesuada. Nulla facilisi. Donec condimentum eros ut erat varius, a condimentum tortor elementum. asd asd asda sdasd asd asd asda sdas das dasd asd asd asdasd asd asd asd asd asd asd asd asd asd asd asd asd ads`;

// Error component to simulate failures
const ErrorComponent = () => {
  throw new Error('This is a test error!');
  return null;
};

// Component for handling text that might overflow between pages
function MultiPageText({
  text,
  maxHeight,
  fontSize = 11,
  lineHeight = 1.5,
  ...props
}: {
  text: string;
  maxHeight: number;
  fontSize?: number;
  lineHeight?: number;
  dimensions?: { width: number; height: number };
  [key: string]: unknown;
}) {
  const [page1Text, setPage1Text] = useState('');
  const [page2Text, setPage2Text] = useState('');
  
  useEffect(() => {
    // This is a simplified calculation - in a real implementation,
    // you would measure actual text rendering and account for font metrics
    
    // Estimate characters per line (based on average character width)
    const avgCharWidth = fontSize * 0.5; // rough estimate
    const charsPerLine = Math.floor((props.dimensions?.width || 100) / avgCharWidth);
    
    // Estimate lines that fit in maxHeight
    const lineHeightPx = fontSize * lineHeight;
    const maxLines = Math.floor(maxHeight / lineHeightPx);
    
    // Estimate total characters that fit on first page
    const roughCharCount = maxLines * charsPerLine;
    
    // Split text between pages (this is simplified)
    const firstPageText = text.substring(0, roughCharCount);
    const secondPageText = text.substring(roughCharCount);
    
    setPage1Text(firstPageText);
    setPage2Text(secondPageText);
  }, [text, maxHeight, fontSize, lineHeight, props.dimensions?.width]);
  
  return (
    <>
      {/* Text for first page */}
      <ParagraphItem
        dimensions={props.dimensions}
        fontSize={fontSize}
        lineHeight={lineHeight}
        {...props}
      >
        {page1Text}
      </ParagraphItem>
      
      {/* Text continuation for second page - positioned at top of the second page */}
      {page2Text && (
        <ParagraphItem
          dimensions={props.dimensions}
          fontSize={fontSize}
          lineHeight={lineHeight}
          className="page-2-content"
          {...props}
        >
          {page2Text}
        </ParagraphItem>
      )}
    </>
  );
}

// Custom configuration for page kit
const pageKitConfig = {
  header: {
    show: false
  },
  footer: {
    show: false
  },
  layout: {
    padding: 20,
    itemSpacing: 15 // Increased spacing between items
  }
};

export default function DocumentExample() {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Add a key to force re-mount the Document component
  
  // Error handler for document component
  const handleError = (error: Error) => {
    console.log('Document error caught:', error.message);
    setErrorMessage(error.message);
  };

  // Reset the error state and remount the Document component
  const resetError = () => {
    setErrorMessage(null);
    setKey(prev => prev + 1); // Force a remount of the Document component
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="mb-4 text-2xl font-bold">DIN A4 Document Example</h1>
        <p className="mb-4">This demonstrates a DIN A4 page with responsive scaling and multi-page text overflow.</p>
        
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center">
          <button
            className="px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
            onClick={() => {
              if (showError) {
                resetError(); // Reset error when hiding error component
              }
              setShowError(!showError);
            }}
          >
            {showError ? "Hide Error Component" : "Show Error Component"}
          </button>
          
          {errorMessage && (
            <div className="px-4 py-2 text-yellow-800 bg-yellow-100 border border-yellow-400 rounded">
              <strong>Error caught:</strong> {errorMessage}
            </div>
          )}
        </div>
        
        <div className="w-full max-w-6xl p-6 mx-auto">
          <h1 className="mb-8 text-3xl font-bold">Document Example</h1>
          
          <PageKitConfigProvider config={pageKitConfig}>
            <Document 
              key={key} // Add key to force remount when needed
              pageProps={{
                maxWidth: 800,
                containerWidth: 100,
                shadow: true,
                className: "mx-auto"
              }}
              className="flex flex-col items-center mb-8 space-y-8"
              onError={handleError}
            >
              {/* Header with logo and title */}
              <HeadingItem 
                dimensions={{ width: 170, height: 15 }}
                fontSize={18}
                color="#333"
              >
                Page Kit Document Example
              </HeadingItem>
              
              <ShapeItem
                dimensions={{ width: 170, height: 2 }}
                shapeType="line"
                borderColor="#333"
                borderWidth={0.5}
              />
              
              {/* Main heading */}
              <HeadingItem 
                dimensions={{ width: 170, height: 20 }}
                fontSize={24}
                color="#1a56db"
              >
                DIN A4 Document Demo
              </HeadingItem>
              
              {/* Error component (conditionally rendered) */}
              {showError && (
                <ParagraphItem dimensions={{ width: 170, height: 40 }}>
                  <ErrorComponent />
                </ParagraphItem>
              )}
              
              {/* Document info */}
              <ParagraphItem
                dimensions={{ width: 170, height: 40 }}
                fontSize={12}
              >
                This is a demonstration of a DIN A4 page that maintains its aspect ratio when resized.
                All content inside the page is scaled proportionally. Try resizing your browser window
                to see how the page and its contents adjust.
              </ParagraphItem>
              
              {/* Example Callout */}
              <CalloutItem
                dimensions={{ width: 170, height: 40 }}
                variant="info"
                calloutTitle="Important Information"
              >
                This document demonstrates the different page items available in Page Kit.
                Each component maintains proper sizing and position as the document is scaled.
              </CalloutItem>
              
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  {/* Example image */}
                  <ImageItem
                    dimensions={{ width: 80, height: 60 }}
                    src="https://picsum.photos/800/600"
                    alt="Example image"
                    objectFit="cover"
                  />
                  
                  {/* Caption */}
                  <ParagraphItem
                    dimensions={{ width: 80, height: 10 }}
                    fontSize={10}
                    textAlign="center"
                    color="#666"
                  >
                    Example Image
                  </ParagraphItem>
                </div>
                
                {/* Lorem ipsum text */}
                <ParagraphItem
                  dimensions={{ width: 80, height: 75 }}
                  fontSize={11}
                  lineHeight={1.4}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                  Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at
                  nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec
                  tellus sed augue semper porta.
                </ParagraphItem>
              </div>
              
              {/* Heading for shapes section */}
              <HeadingItem 
                dimensions={{ width: 170, height: 15 }}
                fontSize={16}
                color="#333"
              >
                Shape Examples
              </HeadingItem>
              
              {/* Shape demonstrations */}
              <div className="flex flex-col w-full gap-6">
                {/* Rectangle with label */}
                <div className="flex flex-row items-center gap-4">
                  <ShapeItem
                    dimensions={{ width: 80, height: 50 }}
                    shapeType="rectangle"
                    backgroundColor="#bbdefb"
                    borderColor="#1976d2"
                    borderWidth={2}
                    className="flex-shrink-0"
                  />
                  <ParagraphItem
                    dimensions={{ width: 80, height: 20 }}
                    fontSize={12}
                  >
                    Rectangle shape with border and background color
                  </ParagraphItem>
                </div>
                
                {/* Ellipse with label */}
                <div className="flex flex-row items-center gap-4">
                  <ShapeItem
                    dimensions={{ width: 70, height: 70 }}
                    shapeType="ellipse"
                    backgroundColor="#c8e6c9"
                    borderColor="#43a047"
                    borderWidth={2}
                    className="flex-shrink-0"
                  />
                  <ParagraphItem
                    dimensions={{ width: 80, height: 20 }}
                    fontSize={12}
                  >
                    Ellipse shape with border and background color
                  </ParagraphItem>
                </div>
                
                {/* Line with label */}
                <div className="flex flex-row items-center gap-4">
                  <div className="w-[80px] flex-shrink-0">
                    <ShapeItem
                      dimensions={{ width: 80, height: 20 }}
                      shapeType="line"
                      borderColor="#d32f2f"
                      borderWidth={3}
                    />
                  </div>
                  <ParagraphItem
                    dimensions={{ width: 80, height: 20 }}
                    fontSize={12}
                  >
                    Horizontal line with custom width and color
                  </ParagraphItem>
                </div>
              </div>
              
              {/* Long text that will overflow to next page */}
              <MultiPageText
                text={loremIpsum}
                maxHeight={25} // Available height on first page in mm
                dimensions={{ width: 170, height: 25 }}
                fontSize={10}
                lineHeight={1.4}
                color="#333"
              />
              
              {/* Tip callout example */}
              <CalloutItem
                dimensions={{ width: 170, height: 35 }}
                variant="tip"
                calloutTitle="Design Tip"
                showIcon={true}
              >
                To create visually appealing documents, maintain consistent spacing 
                between elements and use a limited color palette. This example uses 
                the theme colors defined in the PageKit configuration.
              </CalloutItem>
              
              {/* Page number */}
              <ParagraphItem
                dimensions={{ width: 10, height: 10 }}
                fontSize={9}
                textAlign="right"
                color="#999"
                className="self-end"
              >
                1
              </ParagraphItem>
            </Document>
          </PageKitConfigProvider>
          
          <div className="p-4 mt-8 rounded-lg bg-blue-50">
            <h2 className="mb-4 text-xl font-semibold">Features Demonstrated</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>DIN A4 aspect ratio</strong> - Document maintains the standard DIN A4 proportions</li>
              <li><strong>Responsive scaling</strong> - Document scales based on available space</li>
              <li><strong>Error handling</strong> - The document can handle errors within components</li>
              <li><strong>Component variety</strong> - Display of headings, paragraphs, images, shapes, and callouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 