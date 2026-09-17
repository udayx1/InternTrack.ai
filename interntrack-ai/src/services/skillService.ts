import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { mockSkillGap } from '@/mocks/mockSkillGap'
import { SkillGap } from '@/types'

export const skillService = {
  async getSkillGap(targetRole?: string): Promise<SkillGap> {
    if (USE_MOCKS) {
      await mockDelay(800)
      return targetRole ? { ...mockSkillGap, targetRole } : mockSkillGap
    }
    return apiClient.get<SkillGap>(`/skills/gap${targetRole ? `?role=${encodeURIComponent(targetRole)}` : ''}`)
  },
}
