import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { mockDashboardStats, mockPipelineSummary } from '@/mocks/mockDashboard'
import { mockCareerInsights } from '@/mocks/mockInsights'
import { applicationService } from './applicationService'
import { CareerInsightsData, DashboardStats, PipelineSummary, Application } from '@/types'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    if (USE_MOCKS) {
      await mockDelay()
      return mockDashboardStats
    }
    return apiClient.get<DashboardStats>('/dashboard')
  },

  async getPipelineSummary(): Promise<PipelineSummary[]> {
    if (USE_MOCKS) {
      await mockDelay()
      return mockPipelineSummary
    }
    return apiClient.get<PipelineSummary[]>('/dashboard/pipeline')
  },

  async getRecentApplications(limit = 5): Promise<Application[]> {
    const applications = await applicationService.getApplications()
    return applications
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  },

  async getInsights(): Promise<CareerInsightsData> {
    if (USE_MOCKS) {
      await mockDelay(700)
      return mockCareerInsights
    }
    return apiClient.get<CareerInsightsData>('/dashboard/insights')
  },
}
