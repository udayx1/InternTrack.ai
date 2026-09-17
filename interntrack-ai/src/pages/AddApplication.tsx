import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { applicationService } from '@/services/applicationService'
import { ApplicationStatus } from '@/types'

const statuses: ApplicationStatus[] = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected']

export default function AddApplication() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    company: '',
    role: '',
    location: '',
    jobUrl: '',
    status: 'Applied' as ApplicationStatus,
    appliedDate: new Date().toISOString().slice(0, 10),
    deadline: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company || !form.role) {
      setError('Company and role are required.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await applicationService.createApplication({
        company: form.company,
        role: form.role,
        location: form.location || undefined,
        jobUrl: form.jobUrl || undefined,
        status: form.status,
        appliedDate: form.appliedDate,
        deadline: form.deadline || undefined,
        notes: form.notes || undefined,
      })
      navigate('/app/applications')
    } catch {
      setError('Could not save the application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-ink-900">Add Application</h1>
      <p className="mt-1 text-sm text-ink-500">Track a new internship or job application.</p>

      <form onSubmit={handleSubmit}>
        <Card className="mt-6 grid gap-4 sm:grid-cols-2">
          {error && (
            <div className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <label className="block text-sm font-medium text-ink-700">
            Company *
            <input
              required
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
              placeholder="e.g. UBS Technology India"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700">
            Role *
            <input
              required
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
              placeholder="e.g. Software Engineer Intern"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700">
            Location
            <input
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
              placeholder="e.g. Pune, IN"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700">
            Job URL
            <input
              value={form.jobUrl}
              onChange={(e) => update('jobUrl', e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
              placeholder="https://…"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700">
            Status
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value as ApplicationStatus)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-ink-700">
            Applied date
            <input
              type="date"
              value={form.appliedDate}
              onChange={(e) => update('appliedDate', e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700">
            Deadline
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update('deadline', e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700 sm:col-span-2">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
              placeholder="Follow-up reminders, referral info, interview prep notes…"
            />
          </label>
        </Card>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save application
          </Button>
        </div>
      </form>
    </div>
  )
}
