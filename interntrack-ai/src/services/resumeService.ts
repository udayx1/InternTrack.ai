import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { mockResumeAnalysis } from '@/mocks/mockResumeAnalysis'
import { ResumeAnalysis, ResumeFileMeta } from '@/types'

export const resumeService = {
  async uploadResume(file: File): Promise<ResumeFileMeta> {
    if (USE_MOCKS) {
      await mockDelay(900)
      return {
        id: `resume_${Date.now()}`,
        fileName: file.name,
        fileSizeKb: Math.round(file.size / 1024),
        uploadedAt: new Date().toISOString(),
      }
    }
    const formData = new FormData()
    formData.append('resume', file)
    // apiClient is JSON-only by design; Stage 2 should expose a dedicated
    // multipart upload endpoint or a signed-URL flow here.
    return apiClient.post<ResumeFileMeta>('/resume/upload', formData)
  },

  async analyzeResume(resumeId: string): Promise<ResumeAnalysis> {
    if (USE_MOCKS) {
      await mockDelay(1600)
      return { ...mockResumeAnalysis, resumeId, analyzedAt: new Date().toISOString() }
    }
    return apiClient.post<ResumeAnalysis>('/resume/analyze', { resumeId })
  },
}
