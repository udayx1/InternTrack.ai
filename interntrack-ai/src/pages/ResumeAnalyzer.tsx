import React, { useRef, useState } from 'react'
import { UploadCloud, FileText, X, Sparkles, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/States'
import { resumeService } from '@/services/resumeService'
import { ResumeAnalysis, ResumeFileMeta } from '@/types'

type Phase = 'idle' | 'uploading' | 'uploaded' | 'analyzing' | 'error' | 'ready'

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [fileMeta, setFileMeta] = useState<ResumeFileMeta | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(selected: File) {
    setFile(selected)
    setPhase('uploading')
    try {
      const meta = await resumeService.uploadResume(selected)
      setFileMeta(meta)
      setPhase('uploaded')
    } catch {
      setPhase('error')
    }
  }

  async function handleAnalyze() {
    if (!fileMeta) return
    setPhase('analyzing')
    try {
      const result = await resumeService.analyzeResume(fileMeta.id)
      setAnalysis(result)
      setPhase('ready')
    } catch {
      setPhase('error')
    }
  }

  function reset() {
    setFile(null)
    setFileMeta(null)
    setAnalysis(null)
    setPhase('idle')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Resume Analyzer</h1>
        <p className="mt-1 text-sm text-ink-500">
          Upload your resume to see detected skills, strengths, gaps and improvement suggestions.
        </p>
      </div>

      {!fileMeta && (
        <Card
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const dropped = e.dataTransfer.files?.[0]
            if (dropped) handleFile(dropped)
          }}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed py-16 text-center transition-colors ${
            isDragging ? 'border-brand-400 bg-brand-50/40' : 'border-ink-300/40'
          }`}
        >
          {phase === 'uploading' ? (
            <LoadingState label={`Uploading ${file?.name ?? 'resume'}…`} />
          ) : (
            <>
              <div className="rounded-full bg-brand-50 p-3 text-brand-600">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="font-medium text-ink-900">Drag and drop your resume</p>
              <p className="text-sm text-ink-500">PDF, up to 5MB</p>
              <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
                Browse file
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0]
                  if (selected) handleFile(selected)
                }}
              />
            </>
          )}
        </Card>
      )}

      {fileMeta && phase !== 'error' && (
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">{fileMeta.fileName}</p>
              <p className="text-xs text-ink-400">{fileMeta.fileSizeKb} KB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase === 'uploaded' && (
              <Button icon={Sparkles} size="sm" onClick={handleAnalyze}>
                Analyze Resume
              </Button>
            )}
            {phase === 'analyzing' && (
              <Button size="sm" isLoading>
                Analyzing…
              </Button>
            )}
            <button
              onClick={reset}
              className="focus-ring rounded-lg p-2 text-ink-400 hover:bg-surface-muted hover:text-ink-700"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {phase === 'analyzing' && <LoadingState label="Analyzing your resume…" />}
      {phase === 'error' && <ErrorState onRetry={reset} message="We couldn't process this resume. Please try again." />}

      {phase === 'ready' && analysis && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 font-semibold text-ink-900">Skills Detected</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsDetected.map((s) => (
                <Badge key={s} tone="brand">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-semibold text-ink-900">Education & Experience</h3>
            <p className="text-xs font-medium text-ink-500">Education</p>
            <ul className="mb-3 mt-1 list-disc pl-4 text-sm text-ink-700">
              {analysis.education.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <p className="text-xs font-medium text-ink-500">Experience</p>
            <ul className="mt-1 list-disc pl-4 text-sm text-ink-700">
              {analysis.experience.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 font-semibold text-ink-900">Projects & Certifications</h3>
            <p className="text-xs font-medium text-ink-500">Projects</p>
            <ul className="mb-3 mt-1 list-disc pl-4 text-sm text-ink-700">
              {analysis.projects.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="text-xs font-medium text-ink-500">Certifications</p>
            <ul className="mt-1 list-disc pl-4 text-sm text-ink-700">
              {analysis.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Strengths
            </h3>
            <ul className="list-disc pl-4 text-sm text-ink-700">
              {analysis.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Potential Gaps
            </h3>
            <ul className="list-disc pl-4 text-sm text-ink-700">
              {analysis.gaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900">
              <Lightbulb className="h-4 w-4 text-brand-600" /> Improvement Suggestions
            </h3>
            <ul className="list-disc pl-4 text-sm text-ink-700">
              {analysis.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
