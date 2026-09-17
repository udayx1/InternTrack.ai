import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { mockAccountSettings, mockProfile } from '@/mocks/mockUser'
import { AccountSettings, Profile } from '@/types'

let profileState: Profile = { ...mockProfile }

export const userService = {
  async getProfile(): Promise<Profile> {
    if (USE_MOCKS) {
      await mockDelay()
      return profileState
    }
    return apiClient.get<Profile>('/profile')
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (USE_MOCKS) {
      await mockDelay(500)
      profileState = { ...profileState, ...updates, updatedAt: new Date().toISOString() }
      return profileState
    }
    return apiClient.put<Profile>('/profile', updates)
  },

  async getSettings(): Promise<AccountSettings> {
    if (USE_MOCKS) {
      await mockDelay()
      return mockAccountSettings
    }
    return apiClient.get<AccountSettings>('/settings')
  },
}
