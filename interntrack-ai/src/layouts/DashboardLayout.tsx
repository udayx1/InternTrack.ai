import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Kanban,
  ListChecks,
  FileSearch,
  FileText,
  UserCircle,
  Target,
  Sparkles,
  LineChart,
  Settings as SettingsIcon,
  Compass,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/pipeline', label: 'Application Pipeline', icon: Kanban },
  { to: '/app/applications', label: 'Applications', icon: ListChecks },
  { to: '/app/job-analyzer', label: 'Job Analyzer', icon: FileSearch },
  { to: '/app/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
  { to: '/app/profile', label: 'Career Profile', icon: UserCircle },
  { to: '/app/skill-gap', label: 'Skill Gap', icon: Target },
  { to: '/app/copilot', label: 'AI Application Copilot', icon: Sparkles },
  { to: '/app/insights', label: 'AI Career Insights', icon: LineChart },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const SidebarContent = (
    <>
      <Link to="/app/dashboard" className="flex items-center gap-2 px-1 font-semibold text-ink-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Compass className="h-4.5 w-4.5" />
        </span>
        InternTrack<span className="text-brand-600">.ai</span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-500 hover:bg-surface-muted hover:text-ink-900',
              )
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink-300/25 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {user?.name?.charAt(0) ?? 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">{user?.name}</p>
          <p className="truncate text-xs text-ink-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="focus-ring rounded-lg p-2 text-ink-400 hover:bg-surface-muted hover:text-ink-700"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-surface-page">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-ink-300/20 bg-white px-4 py-6 lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-6 shadow-popover">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-300/20 bg-white/90 px-6 py-3.5 backdrop-blur lg:hidden">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-semibold text-ink-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Compass className="h-4 w-4" />
            </span>
            InternTrack.ai
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="focus-ring rounded-lg p-2 text-ink-700 hover:bg-surface-muted"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
