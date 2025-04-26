import React$1, { ReactNode } from 'react';

interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * The variant of the button
     */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    /**
     * The size of the button
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Optional additional className
     */
    className?: string;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

interface CardProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /**
     * Optional padding variation
     */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /**
     * Optional border radius variation
     */
    radius?: 'none' | 'sm' | 'md' | 'lg';
    /**
     * Optional additional className
     */
    className?: string;
}
declare const Card: React$1.ForwardRefExoticComponent<CardProps & React$1.RefAttributes<HTMLDivElement>>;
interface CardHeaderProps extends React$1.HTMLAttributes<HTMLDivElement> {
    className?: string;
}
declare const CardHeader: React$1.ForwardRefExoticComponent<CardHeaderProps & React$1.RefAttributes<HTMLDivElement>>;
interface CardFooterProps extends React$1.HTMLAttributes<HTMLDivElement> {
    className?: string;
}
declare const CardFooter: React$1.ForwardRefExoticComponent<CardFooterProps & React$1.RefAttributes<HTMLDivElement>>;

interface BadgeProps extends React$1.HTMLAttributes<HTMLSpanElement> {
    /**
     * The variant of the badge
     */
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    /**
     * Optional additional className
     */
    className?: string;
}
declare const Badge: React$1.ForwardRefExoticComponent<BadgeProps & React$1.RefAttributes<HTMLSpanElement>>;

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
 * Position of an item on the page (in mm)
 */
interface PageItemPosition {
    x: number;
    y: number;
}
/**
 * Size of an item on the page (in mm)
 */
interface PageItemSize {
    width: number;
    height: number;
}
/**
 * Base interface for all items that can be placed on a page
 */
interface PageItemProps {
    /**
     * Unique identifier for the item
     */
    id?: string;
    /**
     * Position of the item on the page (in mm)
     */
    position?: PageItemPosition;
    /**
     * Size of the item (in mm)
     */
    size?: PageItemSize;
    /**
     * Content to render inside the item
     */
    children?: ReactNode;
    /**
     * Whether the item can be resized
     */
    resizable?: boolean;
    /**
     * Whether the item can be moved
     */
    movable?: boolean;
    /**
     * Z-index for stacking items
     */
    zIndex?: number;
    /**
     * Optional rotation in degrees
     */
    rotation?: number;
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

export { Badge, type BadgeProps, Button, type ButtonProps, Card, CardFooter, type CardFooterProps, CardHeader, type CardHeaderProps, type CardProps, HeadingItem, ImageItem, type ImageItemProps, Page, PageItem, type PageItemPosition, type PageItemProps, type PageItemSize, type PageProps, ParagraphItem, ShapeItem, type ShapeItemProps, TextItem, type TextItemProps, UnstyledPage, UnstyledPageItem, cn, usePageContext };
