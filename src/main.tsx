import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HABITUX Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
            H
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-[#0F172A] mb-2">
            HABITUX Living
          </h1>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            Something went wrong while rendering the accommodation portal.
          </p>
          <pre className="text-xs bg-slate-100 p-4 rounded-xl text-slate-700 max-w-lg overflow-x-auto text-left border border-slate-200 mb-6 font-mono">
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
