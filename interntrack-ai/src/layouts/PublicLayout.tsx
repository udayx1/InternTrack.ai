import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <header className="border-b border-ink-300/20 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-ink-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Compass className="h-4.5 w-4.5" />
            </span>
            InternTrack<span className="text-brand-600">.ai</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-ink-500 sm:flex">
            <a href="#features" className="hover:text-ink-900">
              Features
            </a>
            <a href="#journey" className="hover:text-ink-900">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900">
              Log in
            </Link>
            <Link
              to="/register"
              className="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-300/20 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} InternTrack.ai · Built for Hack2Ignite</p>
          <p>Your AI Career Command Center</p>
        </div>
      </footer>
    </div>
  )
}
