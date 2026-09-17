import React, { useEffect, useState } from 'react'
import { Badge, Card, ProgressBar } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/States'
import { skillService } from '@/services/skillService'
import { SkillGap } from '@/types'

const priorityTone: Record<string, 'red' | 'amber' | 'gray'> = {
  High: 'red',
  Medium: 'amber',
  Low: 'gray',
}

export default function SkillGapPage() {
  const [data, setData] = useState<SkillGap | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  async function load() {
    setStatus('loading')
    try {
      const result = await skillService.getSkillGap()
      setData(result)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (status === 'loading') return <LoadingState label="Analyzing your skill gap…" />
  if (status === 'error' || !data) return <ErrorState onRetry={load} />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Skill Gap</h1>
        <p className="mt-1 text-sm text-ink-500">
          Target role: <span className="font-medium text-ink-800">{data.targetRole}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-ink-900">Current Skill Proficiency</h2>
          <div className="flex flex-col gap-4">
            {data.currentSkills.map((s) => (
              <div key={s.skill}>
                <div className="mb-1 flex justify-between text-sm text-ink-700">
                  <span>{s.skill}</span>
                  <span className="font-medium">{s.proficiency}%</span>
                </div>
                <ProgressBar value={s.proficiency} tone={s.proficiency < 50 ? 'amber' : 'brand'} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold text-ink-900">Matched vs Missing</h2>
          <p className="mb-2 text-xs font-medium text-ink-500">Matched Skills</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {data.matchedSkills.map((s) => (
              <Badge key={s} tone="green">
                {s}
              </Badge>
            ))}
          </div>
          <p className="mb-2 text-xs font-medium text-ink-500">Missing Skills</p>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((s) => (
              <Badge key={s} tone="red">
                {s}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Recommended Learning Areas</h2>
        <div className="flex flex-col divide-y divide-ink-300/15">
          {data.recommendations.map((rec) => (
            <div key={rec.skill} className="flex items-start justify-between gap-4 py-3.5">
              <div>
                <p className="font-medium text-ink-900">{rec.skill}</p>
                <p className="mt-0.5 text-sm text-ink-500">{rec.reason}</p>
              </div>
              <Badge tone={priorityTone[rec.priority]}>{rec.priority} priority</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
