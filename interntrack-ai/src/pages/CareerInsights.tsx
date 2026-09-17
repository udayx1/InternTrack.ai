import React, { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CalendarClock, Target, TrendingUp, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/States'
import { dashboardService } from '@/services/dashboardService'
import { CareerInsightsData } from '@/types'

const categoryIcon: Record<string, React.ElementType> = {
  'follow-up': CalendarClock,
  skill: Target,
  match: Sparkles,
  trend: TrendingUp,
}

export default function CareerInsights() {
  const [data, setData] = useState<CareerInsightsData | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  async function load() {
    setStatus('loading')
    try {
      const result = await dashboardService.getInsights()
      setData(result)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (status === 'loading') return <LoadingState label="Gathering your career insights…" />
  if (status === 'error' || !data) return <ErrorState onRetry={load} />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">AI Career Insights</h1>
        <p className="mt-1 text-sm text-ink-500">Patterns across your applications, skills and outcomes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.insights.map((insight) => {
          const Icon = categoryIcon[insight.category] ?? Sparkles
          return (
            <Card key={insight.id} className="flex items-start gap-3">
              <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">{insight.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">{insight.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-ink-900">Application Trends</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0fa" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#83849c' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#83849c' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0fa', fontSize: 12 }} />
              <Line type="monotone" dataKey="applications" stroke="#6a3ef0" strokeWidth={2} dot={false} name="Applications" />
              <Line type="monotone" dataKey="interviews" stroke="#d97706" strokeWidth={2} dot={false} name="Interviews" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-ink-900">Most Common Missing Skills</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.commonMissingSkills} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0fa" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#83849c' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="skill"
                width={90}
                tick={{ fontSize: 12, fill: '#33344d' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0fa', fontSize: 12 }} />
              <Bar dataKey="count" fill="#7c5cfc" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-ink-900">Strongest Role Matches</h2>
          <div className="flex flex-col gap-3">
            {data.strongestRoleMatches.map((r) => (
              <div key={r.role} className="flex items-center justify-between">
                <span className="text-sm text-ink-700">{r.role}</span>
                <span className="text-sm font-semibold text-ink-900">{r.score}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-ink-500">Application Conversion Rate</p>
          <p className="mt-2 text-4xl font-semibold text-brand-600">{data.conversionRate}%</p>
          <p className="mt-1 text-xs text-ink-400">Applications that reached interview stage or further</p>
        </Card>
      </div>
    </div>
  )
}
