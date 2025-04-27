/**
 * Typography configuration for headings and body text
 */
export interface TypographyConfig {
  /**
   * Base font family for the document
   */
  fontFamily?: string;
  
  /**
   * Base font size in points (pt)
   */
  baseFontSize?: number;
  
  /**
   * Font family for headings
   */
  headingFontFamily?: string;
  
  /**
   * Font weight for headings
   */
  headingFontWeight?: 'normal' | 'bold' | number;
  
  /**
   * Line height for regular text
   */
  lineHeight?: number;
  
  /**
   * Default heading sizes (h1 through h6)
   */
  headingSizes?: number[];
  
  /**
   * Line heights for headings
   */
  headingLineHeights?: number[];
  
  /**
   * Body text font size
   */
  bodyFontSize?: number;
  
  /**
   * Body text line height
   */
  bodyLineHeight?: number;
}

/**
 * Header configuration
 */
export interface HeaderConfig {
  /**
   * Whether to show the header
   */
  show: boolean;
  /**
   * Height of the header in mm
   */
  height?: number;
  /**
   * Background color of the header
   */
  backgroundColor?: string;
  /**
   * Text color of the header
   */
  textColor?: string;
  /**
   * Custom header content
   */
  content?: React.ReactNode;
}

/**
 * Footer configuration
 */
export interface FooterConfig {
  /**
   * Whether to show the footer
   */
  show: boolean;
  /**
   * Height of the footer in mm
   */
  height?: number;
  /**
   * Background color of the footer
   */
  backgroundColor?: string;
  /**
   * Text color of the footer
   */
  textColor?: string;
  /**
   * Whether to show page numbers in the footer
   */
  showPageNumbers?: boolean;
  /**
   * Custom footer content
   */
  content?: React.ReactNode;
}

/**
 * Page layout configuration
 */
export interface LayoutConfig {
  /**
   * Page padding in mm (can be a single number for all sides or an object with specific sides)
   */
  padding?: number | string | { top?: number; right?: number; bottom?: number; left?: number };
  /**
   * Space between page items in mm
   */
  itemSpacing?: number;
  /**
   * Maximum width of the page content area in mm
   */
  contentMaxWidth?: number;
}

/**
 * Theme colors configuration
 */
export interface ThemeColors {
  /**
   * Primary color
   */
  primary?: string;
  
  /**
   * Secondary color
   */
  secondary?: string;
  
  /**
   * Background color
   */
  background?: string;
  
  /**
   * Text color
   */
  text?: string;
  
  /**
   * Info color (for informational elements)
   */
  info?: string;
  
  /**
   * Success color (for successful actions/tips)
   */
  success?: string;
  
  /**
   * Warning color (for warning messages)
   */
  warning?: string;
  
  /**
   * Error color (for error messages)
   */
  error?: string;
}

/**
 * Complete page kit configuration
 */
export interface PageKitConfig {
  /**
   * Typography configuration
   */
  typography: TypographyConfig;
  /**
   * Header configuration
   */
  header: HeaderConfig;
  /**
   * Footer configuration
   */
  footer: FooterConfig;
  /**
   * Layout configuration
   */
  layout: LayoutConfig;
  /**
   * Theme colors
   */
  colors?: ThemeColors;
} 