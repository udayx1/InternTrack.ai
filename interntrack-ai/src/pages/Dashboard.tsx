import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Activity,
  Users,
  Award,
  Target,
  CalendarClock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Badge, Button, Card, ProgressBar, StatCard } from '@/components/ui'
import { EmptyState, ErrorState, LoadingState } from '@/components/States'
import { dashboardService } from '@/services/dashboardService'
import { skillService } from '@/services/skillService'
import { Application, CareerInsightsData, DashboardStats, PipelineSummary, SkillGap } from '@/types'
import { useAuth } from '@/context/AuthContext'

const statusTone: Record<string, 'brand' | 'green' | 'amber' | 'red' | 'gray'> = {
  Applied: 'gray',
  'Online Assessment': 'brand',
  Interview: 'amber',
  Offer: 'green',
  Rejected: 'red',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pipeline, setPipeline] = useState<PipelineSummary[]>([])
  const [recent, setRecent] = useState<Application[]>([])
  const [insights, setInsights] = useState<CareerInsightsData | null>(null)
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  async function load() {
    setStatus('loading')
    try {
      const [statsRes, pipelineRes, recentRes, insightsRes, skillGapRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPipelineSummary(),
        dashboardService.getRecentApplications(4),
        dashboardService.getInsights(),
        skillService.getSkillGap(),
      ])
      setStats(statsRes)
      setPipeline(pipelineRes)
      setRecent(recentRes)
      setInsights(insightsRes)
      setSkillGap(skillGapRes)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (status === 'loading') return <LoadingState label="Loading your dashboard…" />
  if (status === 'error' || !stats || !insights || !skillGap) {
    return <ErrorState onRetry={load} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">
          Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-ink-500">Here's where your career journey stands today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.totalApplications} icon={Briefcase} />
        <StatCard label="Active Applications" value={stats.activeApplications} icon={Activity} />
        <StatCard label="Interviews" value={stats.interviews} icon={Users} />
        <StatCard label="Offers" value={stats.offers} icon={Award} />
        <StatCard label="Avg. Match Score" value={`${stats.averageMatchScore}%`} icon={Target} />
        <StatCard label="Applications This Week" value={stats.applicationsThisWeek} icon={TrendingUp} />
        <StatCard label="Upcoming Deadlines" value={stats.upcomingDeadlines} icon={CalendarClock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline summary */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Application Pipeline</h2>
            <Link to="/app/pipeline" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View pipeline
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {pipeline.map((p) => (
              <div key={p.status} className="rounded-xl border border-ink-300/20 bg-surface-page p-4">
                <p className="text-2xl font-semibold text-ink-900">{p.count}</p>
                <p className="mt-1 text-xs text-ink-500">{p.status}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill gap summary */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Skill Gap Summary</h2>
            <Link to="/app/skill-gap" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Details
            </Link>
          </div>
          <p className="mb-3 text-xs text-ink-500">Target: {skillGap.targetRole}</p>
          <div className="flex flex-col gap-3">
            {skillGap.currentSkills.slice(0, 4).map((s) => (
              <div key={s.skill}>
                <div className="mb-1 flex justify-between text-xs text-ink-600">
                  <span>{s.skill}</span>
                  <span>{s.proficiency}%</span>
                </div>
                <ProgressBar value={s.proficiency} tone={s.proficiency < 50 ? 'amber' : 'brand'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent applications */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recent Applications</h2>
            <Link to="/app/applications" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="No applications yet"
              message="Start tracking an internship or job to see it here."
              action={
                <Link to="/app/applications/new">
                  <Button size="sm">Add application</Button>
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col divide-y divide-ink-300/15">
              {recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {app.role} · {app.company}
                    </p>
                    <p className="text-xs text-ink-400">Applied {app.appliedDate}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {app.matchScore != null && (
                      <span className="text-xs font-medium text-ink-500">{app.matchScore}% match</span>
                    )}
                    <Badge tone={statusTone[app.status]}>{app.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Career Insights */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">AI Career Insights</h2>
            <Link to="/app/insights" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              All insights
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {insights.insights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="rounded-xl bg-surface-page p-3">
                <p className="text-sm font-medium text-ink-900">{insight.title}</p>
                <p className="mt-0.5 text-xs text-ink-500">{insight.description}</p>
              </div>
            ))}
          </div>
          <Link
            to="/app/insights"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            See full career insights
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>
    </div>
  )
}
