import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { mockApplications } from '@/mocks/mockApplications'
import { Application, ApplicationStatus, CreateApplicationPayload, ID } from '@/types'

let applicationsState: Application[] = [...mockApplications]

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    if (USE_MOCKS) {
      await mockDelay()
      return applicationsState
    }
    return apiClient.get<Application[]>('/applications')
  },

  async getApplication(id: ID): Promise<Application | undefined> {
    if (USE_MOCKS) {
      await mockDelay(300)
      return applicationsState.find((a) => a.id === id)
    }
    return apiClient.get<Application>(`/applications/${id}`)
  },

  async createApplication(payload: CreateApplicationPayload): Promise<Application> {
    if (USE_MOCKS) {
      await mockDelay(500)
      const now = new Date().toISOString()
      const newApplication: Application = {
        ...payload,
        id: `app_${Date.now()}`,
        userId: 'usr_1001',
        matchedSkills: payload.matchedSkills ?? [],
        missingSkills: payload.missingSkills ?? [],
        createdAt: now,
        updatedAt: now,
      }
      applicationsState = [newApplication, ...applicationsState]
      return newApplication
    }
    return apiClient.post<Application>('/applications', payload)
  },

  async updateApplication(id: ID, updates: Partial<Application>): Promise<Application> {
    if (USE_MOCKS) {
      await mockDelay(400)
      applicationsState = applicationsState.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a,
      )
      const updated = applicationsState.find((a) => a.id === id)
      if (!updated) throw new Error('Application not found')
      return updated
    }
    return apiClient.put<Application>(`/applications/${id}`, updates)
  },

  async updateStatus(id: ID, status: ApplicationStatus): Promise<Application> {
    return this.updateApplication(id, { status })
  },

  async deleteApplication(id: ID): Promise<void> {
    if (USE_MOCKS) {
      await mockDelay(300)
      applicationsState = applicationsState.filter((a) => a.id !== id)
      return
    }
    return apiClient.delete<void>(`/applications/${id}`)
  },
}
