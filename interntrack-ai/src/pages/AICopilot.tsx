import React, { useEffect, useState } from 'react'
import { Sparkles, Copy, RotateCcw, Check } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { EmptyState, ErrorState, LoadingState } from '@/components/States'
import { applicationService } from '@/services/applicationService'
import { aiService } from '@/services/aiService'
import { AIContentType, Application } from '@/types'

const contentTypes: { value: AIContentType; label: string }[] = [
  { value: 'cover-letter', label: 'Generate Cover Letter' },
  { value: 'application-email', label: 'Generate Application Email' },
  { value: 'hire-me-pitch', label: 'Generate "Why should we hire you?"' },
  { value: 'resume-improvement', label: 'Improve Resume' },
  { value: 'custom-response', label: 'Generate personalized response' },
]

export default function AICopilot() {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  const [type, setType] = useState<AIContentType>('cover-letter')
  const [context, setContext] = useState('')
  const [content, setContent] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle')
  const [copied, setCopied] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    applicationService
      .getApplications()
      .then((apps) => {
        setApplications(apps)
        if (apps[0]) setSelectedAppId(apps[0].id)
      })
      .catch(() => setLoadError(true))
  }, [])

  const selectedApp = applications.find((a) => a.id === selectedAppId)

  async function handleGenerate() {
    setStatus('loading')
    try {
      const payload = {
        applicationId: selectedAppId || undefined,
        type,
        context:
          context.trim() ||
          (selectedApp ? `Applying for ${selectedApp.role} at ${selectedApp.company}.` : 'General application context.'),
      }
      const result =
        type === 'cover-letter'
          ? await aiService.generateCoverLetter(payload)
          : type === 'application-email'
            ? await aiService.generateApplicationEmail(payload)
            : type === 'resume-improvement'
              ? await aiService.improveResume(payload)
              : await aiService.generateResponse(payload)
      setContent(result.content)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  function handleCopy() {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (loadError) return <ErrorState />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">AI Application Copilot</h1>
        <p className="mt-1 text-sm text-ink-500">Generate tailored application content from your profile and context.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <label className="block text-sm font-medium text-ink-700">
            Select application
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            >
              <option value="">No specific application</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.role} · {a.company}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-ink-700">Content type</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {contentTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`focus-ring rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    type === t.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-ink-300/30 text-ink-600 hover:bg-surface-muted'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm font-medium text-ink-700">
            Additional context
            <textarea
              rows={6}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Anything specific you want highlighted, or paste the job description here…"
              className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
            />
          </label>

          <Button icon={Sparkles} isLoading={status === 'loading'} onClick={handleGenerate} className="self-start">
            Generate
          </Button>
        </Card>

        <div>
          {status === 'idle' && (
            <EmptyState
              icon={Sparkles}
              title="Nothing generated yet"
              message="Choose a content type and generate your first AI-written draft."
            />
          )}
          {status === 'loading' && <LoadingState label="Writing your draft…" />}
          {status === 'error' && <ErrorState onRetry={handleGenerate} message="Generation failed. Please try again." />}
          {status === 'ready' && content && (
            <Card className="flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-ink-900">Generated Content</h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={RotateCcw} onClick={handleGenerate}>
                    Regenerate
                  </Button>
                  <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
              <pre className="flex-1 whitespace-pre-wrap rounded-xl bg-surface-page p-4 font-sans text-sm leading-relaxed text-ink-800">
                {content}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
