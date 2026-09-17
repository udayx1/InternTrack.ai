import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Badge, Button, Card, ProgressBar, ScoreRing } from '@/components/ui'
import { EmptyState, ErrorState, LoadingState } from '@/components/States'
import { jobService } from '@/services/jobService'
import { JobAnalysis } from '@/types'

export default function JobAnalyzer() {
  const [form, setForm] = useState({ company: '', role: '', jobUrl: '', jobDescription: '' })
  const [result, setResult] = useState<JobAnalysis | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle')

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!form.jobDescription.trim()) return
    setStatus('loading')
    try {
      const analysis = await jobService.analyzeJob(form)
      setResult(analysis)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Job Analyzer</h1>
        <p className="mt-1 text-sm text-ink-500">
          Paste a job description to get an explainable match score against your profile.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleAnalyze}>
          <Card className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink-700">
                Company
                <input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
                  placeholder="e.g. UBS Technology India"
                />
              </label>
              <label className="block text-sm font-medium text-ink-700">
                Role
                <input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
                  placeholder="e.g. Software Engineer"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-ink-700">
              Job URL
              <input
                value={form.jobUrl}
                onChange={(e) => setForm((f) => ({ ...f, jobUrl: e.target.value }))}
                className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
                placeholder="https://…"
              />
            </label>
            <label className="block text-sm font-medium text-ink-700">
              Job description *
              <textarea
                required
                rows={10}
                value={form.jobDescription}
                onChange={(e) => setForm((f) => ({ ...f, jobDescription: e.target.value }))}
                className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
                placeholder="Paste the full job description here…"
              />
            </label>
            <Button type="submit" icon={Sparkles} isLoading={status === 'loading'} className="self-start">
              Analyze Opportunity
            </Button>
          </Card>
        </form>

        <div>
          {status === 'idle' && (
            <EmptyState
              icon={Sparkles}
              title="No analysis yet"
              message="Paste a job description and analyze it to see your match score, breakdown and skill gaps."
            />
          )}
          {status === 'loading' && <LoadingState label="Analyzing the opportunity…" />}
          {status === 'error' && (
            <ErrorState onRetry={() => setStatus('idle')} message="Couldn't analyze this job. Please try again." />
          )}
          {status === 'ready' && result && (
            <div className="flex flex-col gap-5">
              <Card className="flex items-center gap-6">
                <ScoreRing score={result.match.overallScore} />
                <div>
                  <p className="text-sm text-ink-500">Job Match Score</p>
                  <p className="text-xl font-semibold text-ink-900">
                    {result.jobDetails.role} · {result.jobDetails.company}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    Analyzed {new Date(result.analyzedAt).toLocaleString()}
                  </p>
                </div>
              </Card>

              <Card>
                <h3 className="mb-3 font-semibold text-ink-900">Score Breakdown</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(result.match.breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-xs text-ink-600">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span>{value}%</span>
                      </div>
                      <ProgressBar value={value} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="mb-3 font-semibold text-ink-900">Skills</h3>
                <p className="mb-2 text-xs font-medium text-ink-500">Matched</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {result.match.matchedSkills.map((s) => (
                    <Badge key={s} tone="green">
                      {s}
                    </Badge>
                  ))}
                </div>
                <p className="mb-2 text-xs font-medium text-ink-500">Missing</p>
                <div className="flex flex-wrap gap-2">
                  {result.match.missingSkills.map((s) => (
                    <Badge key={s} tone="red">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="mb-3 font-semibold text-ink-900">Job Details</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-ink-400">Company</dt>
                    <dd className="text-ink-800">{result.jobDetails.company}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Role</dt>
                    <dd className="text-ink-800">{result.jobDetails.role}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Location</dt>
                    <dd className="text-ink-800">{result.jobDetails.location ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Experience</dt>
                    <dd className="text-ink-800">{result.jobDetails.experience ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Job Type</dt>
                    <dd className="text-ink-800">{result.jobDetails.jobType ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Deadline</dt>
                    <dd className="text-ink-800">{result.jobDetails.deadline ?? '—'}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
