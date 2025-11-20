import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'accent' | 'white'
  text?: string
  fullScreen?: boolean
}

export function Loading({ 
  size = 'md', 
  color = 'primary', 
  text = 'Loading...',
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-primary',
    accent: 'border-accent',
    white: 'border-white'
  }

  const spinner = (
    <div className="flex flex-col items-center space-y-3">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-2 border-t-transparent`} />
      {text && <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-slate-400'}`}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}

interface LoadingCardProps {
  count?: number
}

export function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="premium-card border-white/10 backdrop-blur-sm animate-pulse">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-24" />
                <div className="h-8 bg-slate-600 rounded w-32" />
                <div className="h-3 bg-slate-700 rounded w-16" />
              </div>
              <div className="w-12 h-12 bg-slate-700 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

interface LoadingStateProps {
  title?: string
  description?: string
  action?: {
    text: string
    onClick: () => void
  }
}

export function LoadingState({ 
  title = 'Loading your data',
  description = 'Please wait while we fetch your information',
  action
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loading size="lg" color="accent" text="" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors"
        >
          {action.text}
        </button>
      )}
    </div>
  )
}