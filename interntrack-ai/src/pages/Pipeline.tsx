import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar, MapPin } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { EmptyState, ErrorState, LoadingState } from '@/components/States'
import { applicationService } from '@/services/applicationService'
import { Application, ApplicationStatus } from '@/types'

const columns: ApplicationStatus[] = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected']

const columnTone: Record<ApplicationStatus, string> = {
  Applied: 'border-t-ink-300',
  'Online Assessment': 'border-t-brand-400',
  Interview: 'border-t-amber-400',
  Offer: 'border-t-emerald-400',
  Rejected: 'border-t-red-400',
}

export default function Pipeline() {
  const [applications, setApplications] = useState<Application[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
  const [draggedId, setDraggedId] = useState<string | null>(null)

  async function load() {
    setStatus('loading')
    try {
      const data = await applicationService.getApplications()
      setApplications(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.company.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase()),
      ),
    [applications, search],
  )

  async function moveTo(id: string, newStatus: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
    try {
      await applicationService.updateStatus(id, newStatus)
    } catch {
      load()
    }
  }

  if (status === 'loading') return <LoadingState label="Loading your pipeline…" />
  if (status === 'error') return <ErrorState onRetry={load} />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Application Pipeline</h1>
          <p className="mt-1 text-sm text-ink-500">Drag cards between stages, or use them for a quick look.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role"
              className="focus-ring w-56 rounded-lg border border-ink-300/40 bg-white py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <Link to="/app/applications/new">
            <Button icon={Plus} size="sm">
              Add
            </Button>
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="Your pipeline is empty"
          message="Add your first application to start tracking it through every stage."
          action={
            <Link to="/app/applications/new">
              <Button size="sm">Add application</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {columns.map((col) => {
            const items = filtered.filter((a) => a.status === col)
            return (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => draggedId && moveTo(draggedId, col)}
                className={`flex flex-col rounded-2xl border border-t-4 border-ink-300/20 bg-surface-muted p-3 ${columnTone[col]}`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-ink-900">{col}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-ink-500">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {items.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={() => setDraggedId(app.id)}
                      className="cursor-grab rounded-xl border border-ink-300/20 bg-white p-3 shadow-card active:cursor-grabbing"
                    >
                      <p className="text-sm font-medium text-ink-900">{app.company}</p>
                      <p className="text-xs text-ink-500">{app.role}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-ink-400">
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {app.location}
                          </span>
                        )}
                        {app.matchScore != null && (
                          <span className="font-medium text-brand-600">{app.matchScore}%</span>
                        )}
                      </div>
                      {app.deadline && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-400">
                          <Calendar className="h-3 w-3" /> Due {app.deadline}
                        </div>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="px-1 py-4 text-center text-xs text-ink-300">No applications</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
