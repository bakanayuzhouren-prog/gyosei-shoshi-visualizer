import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red', fontFamily: 'sans-serif' }}>
                    <h2>Oops, something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                    </details>
                    <p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            Reload Page
                        </button>
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
