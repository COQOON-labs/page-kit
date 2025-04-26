import React$1, { ReactNode } from 'react';

interface PageContextType {
    scale: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}
declare const usePageContext: () => PageContextType;
interface PageProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /**
     * Maximum width of the page in pixels. The height will be calculated based on DIN A4 ratio.
     */
    maxWidth?: number;
    /**
     * Optional className for styling the page container
     */
    className?: string;
    /**
     * Optional background color of the page
     */
    background?: string;
    /**
     * Optional className for styling the page itself
     */
    pageClassName?: string;
    /**
     * Optional container width in percentage (0-100)
     */
    containerWidth?: number;
    /**
     * Optional padding inside the page in mm
     */
    padding?: number;
    /**
     * Enable or disable page shadow
     */
    shadow?: boolean;
}
declare const Page: React$1.ForwardRefExoticComponent<PageProps & React$1.RefAttributes<HTMLDivElement>>;
declare const UnstyledPage: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

/**
 * Base interface for all items that can be placed on a page
 */
interface PageItemProps {
    /**
     * Unique identifier for the item
     */
    id?: string;
    /**
     * Content to render inside the item
     */
    children?: ReactNode;
    /**
     * Optional additional className
     */
    className?: string;
    /**
     * Optional onClick handler
     */
    onClick?: (event: React.MouseEvent) => void;
}
/**
 * Text-specific page item properties
 */
interface TextItemProps extends PageItemProps {
    /**
     * Font size in points
     */
    fontSize?: number;
    /**
     * Font family
     */
    fontFamily?: string;
    /**
     * Font weight
     */
    fontWeight?: 'normal' | 'bold' | number;
    /**
     * Text color
     */
    color?: string;
    /**
     * Text alignment
     */
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    /**
     * Line height
     */
    lineHeight?: number | string;
}
/**
 * Image-specific page item properties
 */
interface ImageItemProps extends PageItemProps {
    /**
     * Source URL of the image
     */
    src: string;
    /**
     * Alt text for accessibility
     */
    alt?: string;
    /**
     * How the image should fit within its container
     */
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}
/**
 * Shape-specific page item properties
 */
interface ShapeItemProps extends PageItemProps {
    /**
     * Type of shape
     */
    shapeType: 'rectangle' | 'ellipse' | 'line';
    /**
     * Background color
     */
    backgroundColor?: string;
    /**
     * Border color
     */
    borderColor?: string;
    /**
     * Border width in mm
     */
    borderWidth?: number;
}

declare const PageItem: React$1.ForwardRefExoticComponent<PageItemProps & React$1.RefAttributes<HTMLDivElement>>;
declare const UnstyledPageItem: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

declare const TextItem: React$1.ForwardRefExoticComponent<TextItemProps & React$1.RefAttributes<HTMLDivElement>>;
declare const HeadingItem: React$1.ForwardRefExoticComponent<TextItemProps & React$1.RefAttributes<HTMLDivElement>>;
declare const ParagraphItem: React$1.ForwardRefExoticComponent<TextItemProps & React$1.RefAttributes<HTMLDivElement>>;

declare const ImageItem: React$1.ForwardRefExoticComponent<ImageItemProps & React$1.RefAttributes<HTMLDivElement>>;

declare const ShapeItem: React$1.ForwardRefExoticComponent<ShapeItemProps & React$1.RefAttributes<HTMLDivElement>>;

/**
 * Utility function to merge Tailwind CSS classes
 * This helps in handling conditional and dynamic classes
 *
 * @param classes - Array of class strings to be merged
 * @returns A string of merged classes with no duplicates and no undefined/null values
 */
declare function cn(...classes: (string | undefined | null | false)[]): string;

export { HeadingItem, ImageItem, type ImageItemProps, Page, PageItem, type PageItemProps, type PageProps, ParagraphItem, ShapeItem, type ShapeItemProps, TextItem, type TextItemProps, UnstyledPage, UnstyledPageItem, cn, usePageContext };
