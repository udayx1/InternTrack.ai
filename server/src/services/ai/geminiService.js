import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../../config/env.js'
import { ApiError } from '../../utils/ApiError.js'

// ============================================================================
// Centralized AI service. Controllers never talk to Gemini directly — they
// call generateJSON()/generateText() here. This is the ONLY module that
// imports @google/generative-ai or reads GEMINI_API_KEY.
//
// Controller → AI Service → Gemini API → structured response → Controller
// ============================================================================

let client = null
function getClient() {
  if (!env.geminiApiKey) {
    throw ApiError.internal(
      'AI service is not configured on the server (missing GEMINI_API_KEY).',
      'AI_NOT_CONFIGURED',
    )
  }
  if (!client) client = new GoogleGenerativeAI(env.geminiApiKey)
  return client
}

function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

/**
 * Calls Gemini with a prompt that MUST produce a single JSON object, and
 * returns it parsed. Retries once with a stricter instruction if the first
 * response isn't valid JSON. Throws ApiError.badGateway on persistent failure
 * so controllers can surface one consistent, friendly error to the frontend.
 */
export async function generateJSON({ system, prompt, temperature = 0.4 }) {
  const model = getClient().getGenerativeModel({
    model: env.geminiModel,
    systemInstruction: system,
    generationConfig: { temperature, responseMimeType: 'application/json' },
  })

  const attempt = async (finalPrompt) => {
    const result = await model.generateContent(finalPrompt)
    const text = result.response.text()
    return JSON.parse(stripCodeFences(text))
  }

  try {
    return await attempt(prompt)
  } catch (firstErr) {
    try {
      return await attempt(
        `${prompt}\n\nIMPORTANT: Respond with ONLY a single valid JSON object. No markdown, no commentary, no code fences.`,
      )
    } catch (secondErr) {
      // eslint-disable-next-line no-console
      console.error('[geminiService] JSON generation failed:', firstErr.message, '|', secondErr.message)
      throw ApiError.badGateway('The AI service could not process this request. Please try again.', 'AI_JSON_PARSE_FAILED')
    }
  }
}

/** Calls Gemini for free-form text output (cover letters, emails, etc). */
export async function generateText({ system, prompt, temperature = 0.7 }) {
  const model = getClient().getGenerativeModel({
    model: env.geminiModel,
    systemInstruction: system,
    generationConfig: { temperature },
  })

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()?.trim()
    if (!text) throw new Error('Empty response from model')
    return text
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[geminiService] text generation failed:', err.message)
    throw ApiError.badGateway('The AI service could not generate content. Please try again.', 'AI_GENERATION_FAILED')
  }
}
