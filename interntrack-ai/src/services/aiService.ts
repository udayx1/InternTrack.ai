// AI Copilot abstraction. The frontend NEVER calls an AI provider directly —
// no Gemini/OpenAI keys are ever present in this codebase. Stage 2's backend
// owns the AI provider call and exposes these as plain REST endpoints.

import { apiClient, mockDelay, USE_MOCKS } from '@/lib/apiClient'
import { buildMockAIContent } from '@/mocks/mockAIContent'
import { AIContent, GenerateContentPayload } from '@/types'

async function generate(payload: GenerateContentPayload, endpoint: string): Promise<AIContent> {
  if (USE_MOCKS) {
    await mockDelay(1800)
    return {
      id: `ai_${Date.now()}`,
      applicationId: payload.applicationId,
      type: payload.type,
      prompt: payload.context,
      content: buildMockAIContent(payload),
      generatedAt: new Date().toISOString(),
    }
  }
  return apiClient.post<AIContent>(endpoint, payload)
}

export const aiService = {
  generateCoverLetter: (payload: GenerateContentPayload) =>
    generate({ ...payload, type: 'cover-letter' }, '/ai/cover-letter'),

  generateApplicationEmail: (payload: GenerateContentPayload) =>
    generate({ ...payload, type: 'application-email' }, '/ai/application-email'),

  generateResponse: (payload: GenerateContentPayload) => generate(payload, '/ai/generate-response'),

  improveResume: (payload: GenerateContentPayload) =>
    generate({ ...payload, type: 'resume-improvement' }, '/ai/improve-resume'),
}
