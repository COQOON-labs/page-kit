import React, { useState, useEffect } from 'react';
import {
  Page,
  HeadingItem,
  ParagraphItem,
  ImageItem,
  ShapeItem
} from 'page-kit-core';

// Sample long text for testing page breaks
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis magna et urna faucibus, vel condimentum dolor ultricies. Fusce cursus libero vitae lorem placerat, at vehicula ligula pharetra. Donec volutpat purus vitae arcu bibendum, id consequat nisi ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur at nunc in quam ullamcorper dignissim. Morbi feugiat enim ac ipsum porttitor volutpat. Phasellus id dui molestie, sagittis enim vitae, tincidunt lectus. Maecenas eget gravida felis, a accumsan nisl. Mauris non nulla congue, dictum neque nec, faucibus risus. Aliquam sed dui sit amet orci volutpat dignissim. Cras nec velit eu dui fermentum placerat. Etiam rhoncus diam vitae sem egestas porta. Cras malesuada, augue vitae ultrices interdum, magna magna pellentesque odio, sed finibus nibh urna vel nulla. Mauris non quam vitae eros imperdiet imperdiet vel non orci. Donec luctus faucibus nisi, at ultricies risus consequat vel. Nulla aliquam quam eget purus accumsan, ac congue enim accumsan. Vivamus luctus fermentum viverra. In vitae consequat eros, eget aliquet felis. Nulla vel mauris nulla. Sed sagittis dictum risus in sagittis. Nulla facilisi. In fermentum sit amet dolor vitae tempus. Quisque vel venenatis eros, vel pretium eros. Proin non massa diam. Cras dictum leo nec nisi lobortis, id tincidunt dui luctus. Nam facilisis, magna eget vulputate commodo, felis eros lobortis mi, vel placerat elit nibh ut dui. Curabitur euismod elit ac placerat malesuada. Nulla facilisi. Donec condimentum eros ut erat varius, a condimentum tortor elementum.`;

// Component for handling text that might overflow between pages
function MultiPageText({
  text,
  maxHeight,
  position,
  fontSize = 11,
  lineHeight = 1.5,
  ...props
}: {
  text: string;
  maxHeight: number;
  position: { x: number; y: number };
  fontSize?: number;
  lineHeight?: number;
  [key: string]: any;
}) {
  const [page1Text, setPage1Text] = useState('');
  const [page2Text, setPage2Text] = useState('');
  
  useEffect(() => {
    // This is a simplified calculation - in a real implementation,
    // you would measure actual text rendering and account for font metrics
    
    // Estimate characters per line (based on average character width)
    const avgCharWidth = fontSize * 0.5; // rough estimate
    const charsPerLine = Math.floor(props.size.width / avgCharWidth);
    
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
  }, [text, maxHeight, fontSize, lineHeight, props.size.width]);
  
  return (
    <>
      {/* Text for first page */}
      <ParagraphItem
        position={position}
        size={props.size}
        fontSize={fontSize}
        lineHeight={lineHeight}
        {...props}
      >
        {page1Text}
      </ParagraphItem>
      
      {/* Text continuation for second page - positioned at top */}
      {page2Text && (
        <ParagraphItem
          position={{ x: position.x, y: 20 }}
          size={props.size}
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

export default function DocumentExample() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">DIN A4 Document Example</h1>
        <p className="mb-4">This demonstrates a DIN A4 page with responsive scaling and multi-page text overflow.</p>
        
        <div className="mb-8 flex flex-col items-center space-y-8">
          {/* First Page */}
          <Page 
            maxWidth={800}
            containerWidth={100}
            shadow={true}
            className="mx-auto"
          >
            {/* Header with logo and title */}
            <HeadingItem 
              position={{ x: 20, y: 20 }}
              size={{ width: 170, height: 15 }}
              fontSize={18}
              color="#333"
            >
              Page Kit Document Example
            </HeadingItem>
            
            <ShapeItem
              position={{ x: 20, y: 45 }}
              size={{ width: 170, height: 2 }}
              shapeType="line"
              borderColor="#333"
              borderWidth={0.5}
            />
            
            {/* Main heading */}
            <HeadingItem 
              position={{ x: 20, y: 60 }}
              size={{ width: 170, height: 20 }}
              fontSize={24}
              color="#1a56db"
            >
              DIN A4 Document Demo
            </HeadingItem>
            
            {/* Document info */}
            <ParagraphItem
              position={{ x: 20, y: 90 }}
              size={{ width: 170, height: 40 }}
              fontSize={12}
            >
              This is a demonstration of a DIN A4 page that maintains its aspect ratio when resized.
              All content inside the page is scaled proportionally. Try resizing your browser window
              to see how the page and its contents adjust.
            </ParagraphItem>
            
            {/* Example image */}
            <ImageItem
              position={{ x: 20, y: 140 }}
              size={{ width: 80, height: 60 }}
              src="https://picsum.photos/800/600"
              alt="Example image"
              objectFit="cover"
            />
            
            {/* Caption */}
            <ParagraphItem
              position={{ x: 20, y: 205 }}
              size={{ width: 80, height: 10 }}
              fontSize={10}
              textAlign="center"
              color="#666"
            >
              Example Image
            </ParagraphItem>
            
            {/* Lorem ipsum text */}
            <ParagraphItem
              position={{ x: 110, y: 140 }}
              size={{ width: 80, height: 75 }}
              fontSize={11}
              lineHeight={1.4}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
              Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at
              nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec
              tellus sed augue semper porta.
            </ParagraphItem>
            
            {/* Shapes example */}
            <ShapeItem
              position={{ x: 20, y: 230 }}
              size={{ width: 40, height: 40 }}
              shapeType="rectangle"
              backgroundColor="#e3f2fd"
              borderColor="#2196f3"
              borderWidth={1}
            />
            
            <ShapeItem
              position={{ x: 70, y: 230 }}
              size={{ width: 40, height: 40 }}
              shapeType="ellipse"
              backgroundColor="#f1f8e9"
              borderColor="#8bc34a"
              borderWidth={1}
            />
            
            <ShapeItem
              position={{ x: 120, y: 250 }}
              size={{ width: 70, height: 2 }}
              shapeType="line"
              borderColor="#f44336"
              borderWidth={2}
            />
            
            {/* Long text that will overflow to next page */}
            <MultiPageText
              text={loremIpsum}
              maxHeight={25} // Available height on first page in mm
              position={{ x: 20, y: 275 }}
              size={{ width: 170, height: 25 }}
              fontSize={10}
              lineHeight={1.4}
              color="#333"
            />
            
            {/* Page number */}
            <ParagraphItem
              position={{ x: 180, y: 275 }}
              size={{ width: 10, height: 10 }}
              fontSize={9}
              textAlign="right"
              color="#999"
            >
              1
            </ParagraphItem>
          </Page>
          
          {/* Second Page */}
          <Page 
            maxWidth={800}
            containerWidth={100}
            shadow={true}
            className="mx-auto"
          >
            {/* Header for second page */}
            <HeadingItem 
              position={{ x: 20, y: 20 }}
              size={{ width: 170, height: 15 }}
              fontSize={14}
              color="#333"
            >
              Page Kit Document - Continued
            </HeadingItem>
            
            <ShapeItem
              position={{ x: 20, y: 35 }}
              size={{ width: 170, height: 1 }}
              shapeType="line"
              borderColor="#333"
              borderWidth={0.25}
            />
            
            {/* The text continuation is handled by the MultiPageText component */}
            
            {/* Additional content for second page */}
            <HeadingItem 
              position={{ x: 20, y: 120 }}
              size={{ width: 170, height: 15 }}
              fontSize={16}
              color="#1a56db"
            >
              Additional Information
            </HeadingItem>
            
            <ParagraphItem
              position={{ x: 20, y: 145 }}
              size={{ width: 170, height: 30 }}
              fontSize={11}
            >
              This second page demonstrates how content can flow across multiple pages.
              In a real document editor, you would implement more sophisticated text flow
              algorithms and pagination controls.
            </ParagraphItem>
            
            {/* Page number */}
            <ParagraphItem
              position={{ x: 180, y: 275 }}
              size={{ width: 10, height: 10 }}
              fontSize={9}
              textAlign="right"
              color="#999"
            >
              2
            </ParagraphItem>
          </Page>
        </div>
        
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">About Multi-Page Documents</h2>
          <p>
            This example demonstrates a multi-page document with text flowing between pages.
            Key features:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Multiple DIN A4 pages in sequence</li>
            <li>Text that flows from one page to the next</li>
            <li>Consistent styling and layout across pages</li>
            <li>Each page maintains proper DIN A4 proportions</li>
            <li>Responsive scaling of all content</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 