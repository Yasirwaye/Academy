import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Production Error Boundary
 * Catches JS errors in the component tree, logs them, and renders a fallback UI.
 * Prevents a single broken component from crashing the entire app.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in a structured way for observability
    console.error('[ErrorBoundary] Caught error:', {
      message: error?.message,
      stack: error?.stack,
      componentStack: info?.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-8 text-center rounded-xl"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <h3 className="text-white font-semibold mb-1">Something went wrong</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-sm">
            {this.props.message || 'This section failed to load. The rest of the page is still working.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;