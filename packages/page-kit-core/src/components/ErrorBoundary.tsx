import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /**
   * Content to render inside the error boundary
   */
  children: ReactNode;
  
  /**
   * Optional fallback UI to display when an error occurs
   */
  fallback?: ReactNode;
  
  /**
   * Optional callback for error handling
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the entire application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('PageKit Error:', error, errorInfo);
    
    // Call onError if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise show default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div 
          style={{ 
            padding: '20px', 
            border: '1px solid #f5c6cb', 
            borderRadius: '4px',
            backgroundColor: '#f8d7da', 
            color: '#721c24',
            margin: '10px 0'
          }}
        >
          <h3 style={{ marginTop: 0 }}>Something went wrong</h3>
          <p>
            An error occurred while rendering this component.
            {this.state.error && (
              <details style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                <summary>Show error details</summary>
                <p style={{ fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </p>
              </details>
            )}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 