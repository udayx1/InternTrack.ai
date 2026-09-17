import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ExternalLink, Trash2 } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { EmptyState, ErrorState, LoadingState } from '@/components/States'
import { applicationService } from '@/services/applicationService'
import { Application, ApplicationStatus } from '@/types'

const statusTone: Record<ApplicationStatus, 'brand' | 'green' | 'amber' | 'red' | 'gray'> = {
  Applied: 'gray',
  'Online Assessment': 'brand',
  Interview: 'amber',
  Offer: 'green',
  Rejected: 'red',
}

const statusFilters: ('All' | ApplicationStatus)[] = [
  'All',
  'Applied',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
]

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | ApplicationStatus>('All')
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

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
      applications.filter((a) => {
        const matchesSearch =
          a.company.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'All' || a.status === filter
        return matchesSearch && matchesFilter
      }),
    [applications, search, filter],
  )

  async function handleDelete(id: string) {
    const prev = applications
    setApplications((cur) => cur.filter((a) => a.id !== id))
    try {
      await applicationService.deleteApplication(id)
    } catch {
      setApplications(prev)
    }
  }

  if (status === 'loading') return <LoadingState label="Loading your applications…" />
  if (status === 'error') return <ErrorState onRetry={load} />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Applications</h1>
          <p className="mt-1 text-sm text-ink-500">{applications.length} total applications tracked.</p>
        </div>
        <Link to="/app/applications/new">
          <Button icon={Plus} size="sm">
            Add application
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role"
            className="focus-ring w-full rounded-lg border border-ink-300/40 bg-white py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-ink-500 ring-1 ring-inset ring-ink-300/40 hover:bg-surface-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={applications.length === 0 ? 'No applications yet' : 'No matches'}
          message={
            applications.length === 0
              ? 'Add your first internship or job application to start tracking it.'
              : 'Try a different search term or filter.'
          }
          action={
            applications.length === 0 ? (
              <Link to="/app/applications/new">
                <Button size="sm">Add application</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-300/15 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">Company / Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Applied</th>
                <th className="px-5 py-3 font-medium">Deadline</th>
                <th className="px-5 py-3 font-medium">Match</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/10">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-surface-muted/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink-900">{app.company}</p>
                    <p className="text-xs text-ink-500">{app.role}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone[app.status]}>{app.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-ink-600">{app.appliedDate}</td>
                  <td className="px-5 py-3.5 text-ink-600">{app.deadline ?? '—'}</td>
                  <td className="px-5 py-3.5 font-medium text-ink-900">
                    {app.matchScore != null ? `${app.matchScore}%` : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-surface-muted hover:text-ink-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
