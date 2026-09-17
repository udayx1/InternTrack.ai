import React from 'react'
import { AlertTriangle, Inbox, LucideIcon } from 'lucide-react'
import { Button } from './ui'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this data. Check your connection and try again.",
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 py-16 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="font-medium text-ink-900">{title}</p>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  action,
}: {
  icon?: LucideIcon
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-300/50 py-16 text-center">
      <div className="rounded-full bg-surface-muted p-3 text-ink-400">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-medium text-ink-900">{title}</p>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
      {action}
    </div>
  )
}
