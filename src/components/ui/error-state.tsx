import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | null
  onRetry?: () => void
  onGoHome?: () => void
  variant?: 'default' | 'critical' | 'network'
}

export function ErrorState({ 
  title = 'Something went wrong',
  message = 'We encountered an error while processing your request.',
  error,
  onRetry,
  onGoHome,
  variant = 'default'
}: ErrorStateProps) {
  const variants = {
    default: {
      icon: AlertCircle,
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      titleColor: 'text-warning',
      messageColor: 'text-slate-400'
    },
    critical: {
      icon: AlertCircle,
      iconColor: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      titleColor: 'text-destructive',
      messageColor: 'text-slate-400'
    },
    network: {
      icon: RefreshCw,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      titleColor: 'text-primary',
      messageColor: 'text-slate-400'
    }
  }

  const selectedVariant = variants[variant]
  const Icon = selectedVariant.icon

  return (
    <div className="flex items-center justify-center py-12">
      <div className={`max-w-md w-full p-8 rounded-2xl border ${selectedVariant.bgColor} ${selectedVariant.borderColor} backdrop-blur-sm`}>
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 rounded-xl ${selectedVariant.bgColor} border ${selectedVariant.borderColor} flex items-center justify-center mx-auto`}>
            <Icon className={`w-8 h-8 ${selectedVariant.iconColor}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-xl font-semibold ${selectedVariant.titleColor}`}>
              {title}
            </h3>
            <p className={`${selectedVariant.messageColor}`}>
              {message}
            </p>
            {error && (
              <details className="mt-4">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-300">
                  Show error details
                </summary>
                <pre className="mt-2 text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg overflow-auto">
                  {error.message || JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="inline-flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <ErrorState
            title="Application Error"
            message="Something went wrong with the application."
            error={this.state.error}
            onRetry={this.handleRetry}
            variant="critical"
          />
        </div>
      )
    }

    return this.props.children
  }
}