import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-page text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button className="mt-2">Back to home</Button>
      </Link>
    </div>
  )
}
