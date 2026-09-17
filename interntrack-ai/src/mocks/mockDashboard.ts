import { DashboardStats, PipelineSummary } from '@/types'
import { mockApplications } from './mockApplications'

export const mockDashboardStats: DashboardStats = {
  totalApplications: mockApplications.length,
  activeApplications: mockApplications.filter((a) =>
    ['Applied', 'Online Assessment', 'Interview'].includes(a.status),
  ).length,
  interviews: mockApplications.filter((a) => a.status === 'Interview').length,
  offers: mockApplications.filter((a) => a.status === 'Offer').length,
  averageMatchScore: Math.round(
    mockApplications.reduce((sum, a) => sum + (a.matchScore ?? 0), 0) / mockApplications.length,
  ),
  applicationsThisWeek: 2,
  upcomingDeadlines: mockApplications.filter((a) => a.deadline && a.status !== 'Rejected').length,
}

export const mockPipelineSummary: PipelineSummary[] = [
  { status: 'Applied', count: mockApplications.filter((a) => a.status === 'Applied').length },
  {
    status: 'Online Assessment',
    count: mockApplications.filter((a) => a.status === 'Online Assessment').length,
  },
  { status: 'Interview', count: mockApplications.filter((a) => a.status === 'Interview').length },
  { status: 'Offer', count: mockApplications.filter((a) => a.status === 'Offer').length },
  { status: 'Rejected', count: mockApplications.filter((a) => a.status === 'Rejected').length },
]
