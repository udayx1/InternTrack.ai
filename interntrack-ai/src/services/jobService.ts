import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { buildMockJobAnalysis } from '@/mocks/mockJobAnalysis'
import { AnalyzeJobPayload, JobAnalysis } from '@/types'

export const jobService = {
  async analyzeJob(payload: AnalyzeJobPayload): Promise<JobAnalysis> {
    if (USE_MOCKS) {
      await mockDelay(1400)
      return buildMockJobAnalysis(payload)
    }
    return apiClient.post<JobAnalysis>('/jobs/analyze', payload)
  },

  async matchJob(jobAnalysisId: string): Promise<JobAnalysis> {
    if (USE_MOCKS) {
      await mockDelay(900)
      return buildMockJobAnalysis({ company: '', role: '', jobDescription: '' })
    }
    return apiClient.post<JobAnalysis>('/jobs/match', { jobAnalysisId })
  },
}
