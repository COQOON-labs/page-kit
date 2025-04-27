import React from 'react';
import { cn } from '../../utils/react-helper';
import { PageItemProps } from './types';
import { createPageItem } from './createPageItem';
import { usePageKitConfig } from '../../config';

/**
 * Callout-specific page item properties
 */
export interface CalloutItemProps extends PageItemProps {
  /**
   * Callout type/severity
   */
  variant?: 'info' | 'warning' | 'error' | 'tip' | 'note';
  
  /**
   * Optional title for the callout
   */
  title?: React.ReactNode;
  
  /**
   * Border color override
   */
  borderColor?: string;
  
  /**
   * Background color override
   */
  backgroundColor?: string;
  
  /**
   * Text color override
   */
  textColor?: string;
  
  /**
   * Icon to display (can be a string for named icons or a ReactNode)
   */
  icon?: React.ReactNode | string;
  
  /**
   * Whether to show an icon
   */
  showIcon?: boolean;
}

/**
 * CalloutItem component for highlighting important information in documents
 */
export const CalloutItem = createPageItem<CalloutItemProps>({
  displayName: 'CalloutItem',
  baseClassName: 'page-callout-item',
  defaultProps: {
    variant: 'info',
    showIcon: true,
  },
  
  renderContent: (props, dimensionInfo) => {
    const { 
      children, 
      variant = 'info', 
      title,
      borderColor,
      backgroundColor,
      textColor,
      icon,
      showIcon = true,
    } = props;
    
    // Get theme configuration
    const config = usePageKitConfig();
    
    // Get variant-specific styles
    const variantStyles = getVariantStyles(variant, config, {
      borderColor,
      backgroundColor,
      textColor
    });
    
    // Get the appropriate icon
    const calloutIcon = getCalloutIcon(variant, icon);
    
    return (
      <div
        className={cn(
          'flex flex-col w-full h-full p-3 border-l-4 rounded-r',
          variantStyles.containerClasses
        )}
        style={{
          borderLeftColor: variantStyles.borderColor,
          backgroundColor: variantStyles.backgroundColor,
          color: variantStyles.textColor,
        }}
      >
        {title && (
          <div className="flex items-center mb-2 font-bold">
            {showIcon && calloutIcon && (
              <span className="mr-2">{calloutIcon}</span>
            )}
            <div>{title}</div>
          </div>
        )}
        
        <div className={cn(
          'flex-1', 
          title ? 'mt-1 pl-0' : (showIcon && calloutIcon ? 'pl-6' : 'pl-0')
        )}>
          {!title && showIcon && calloutIcon && (
            <span className="inline-block mr-2 float-left">{calloutIcon}</span>
          )}
          {children}
        </div>
      </div>
    );
  }
});

// Helper functions for callout styling
function getVariantStyles(
  variant: CalloutItemProps['variant'], 
  config: ReturnType<typeof usePageKitConfig>,
  overrides: {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
  }
) {
  // Base styles based on variant
  let borderColor = overrides.borderColor;
  let backgroundColor = overrides.backgroundColor;
  let textColor = overrides.textColor;
  let containerClasses = '';
  
  switch (variant) {
    case 'info':
      borderColor = borderColor || config.colors?.info || '#0ea5e9';
      backgroundColor = backgroundColor || '#f0f9ff';
      textColor = textColor || '#0c4a6e';
      containerClasses = 'callout-info';
      break;
    case 'warning':
      borderColor = borderColor || config.colors?.warning || '#f97316';
      backgroundColor = backgroundColor || '#fff7ed';
      textColor = textColor || '#7c2d12';
      containerClasses = 'callout-warning';
      break;
    case 'error':
      borderColor = borderColor || config.colors?.error || '#dc2626';
      backgroundColor = backgroundColor || '#fef2f2';
      textColor = textColor || '#7f1d1d';
      containerClasses = 'callout-error';
      break;
    case 'tip':
      borderColor = borderColor || config.colors?.success || '#10b981';
      backgroundColor = backgroundColor || '#ecfdf5';
      textColor = textColor || '#064e3b';
      containerClasses = 'callout-tip';
      break;
    case 'note':
      borderColor = borderColor || config.colors?.secondary || '#6b7280';
      backgroundColor = backgroundColor || '#f9fafb';
      textColor = textColor || '#1f2937';
      containerClasses = 'callout-note';
      break;
    default:
      borderColor = borderColor || config.colors?.info || '#0ea5e9';
      backgroundColor = backgroundColor || '#f0f9ff';
      textColor = textColor || '#0c4a6e';
      containerClasses = 'callout-default';
      break;
  }
  
  return {
    borderColor,
    backgroundColor,
    textColor,
    containerClasses
  };
}

// Get appropriate icon for callout type
function getCalloutIcon(
  variant: CalloutItemProps['variant'],
  customIcon?: React.ReactNode | string
): React.ReactNode {
  if (customIcon) {
    return typeof customIcon === 'string' ? <span>{customIcon}</span> : customIcon;
  }
  
  // Return default icons based on variant
  switch (variant) {
    case 'info':
      return <span>ℹ️</span>;
    case 'warning':
      return <span>⚠️</span>;
    case 'error':
      return <span>❌</span>;
    case 'tip':
      return <span>💡</span>;
    case 'note':
      return <span>📝</span>;
    default:
      return <span>ℹ️</span>;
  }
} 