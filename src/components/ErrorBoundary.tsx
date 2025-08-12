import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You could send this to a logging service
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-xl p-6">
            <h1 className="text-xl font-semibold text-cyan-300 mb-2">Something went wrong</h1>
            <p className="text-gray-300 mb-4">An unexpected error occurred. Try reloading the page. If the problem persists, please report this with steps to reproduce.</p>
            {this.state.error && (
              <pre className="text-xs text-gray-400 overflow-auto max-h-48 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/30"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 