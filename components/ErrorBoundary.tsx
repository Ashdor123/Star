import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-orange-50">
          <div className="text-center">
            <div className="inline-block p-4 bg-orange-100 rounded-2xl mb-4">
              <span className="material-icons-round text-orange-500 text-6xl">error_outline</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">出错了</h1>
            <p className="text-gray-500 mb-6">页面加载出现问题，请刷新重试</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;