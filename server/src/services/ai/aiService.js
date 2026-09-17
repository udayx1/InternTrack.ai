import * as geminiService from './geminiService.js'
import * as requestyService from './requestyService.js'

export async function generateJSON(options) {
  // 1. Try Gemini
  try {
    console.log('[AI] Trying Gemini...')

    const result = await geminiService.generateJSON(options)

    console.log('[AI] Gemini succeeded')

    return result
  } catch (geminiError) {
    console.error(
      '[AI] Gemini failed:',
      geminiError?.message || geminiError,
    )
  }

  // 2. Fallback to Requesty
  try {
    console.log('[AI] Falling back to Requesty...')

    const result = await requestyService.generateJSON(options)

    console.log('[AI] Requesty succeeded')

    return result
  } catch (requestyError) {
    console.error(
      '[AI] Requesty failed:',
      requestyError?.message || requestyError,
    )

    throw requestyError
  }
}

export async function generateText(options) {
  // 1. Try Gemini
  try {
    console.log('[AI] Trying Gemini...')

    const result = await geminiService.generateText(options)

    console.log('[AI] Gemini succeeded')

    return result
  } catch (geminiError) {
    console.error(
      '[AI] Gemini failed:',
      geminiError?.message || geminiError,
    )
  }

  // 2. Fallback to Requesty
  try {
    console.log('[AI] Falling back to Requesty...')

    const result = await requestyService.generateText(options)

    console.log('[AI] Requesty succeeded')

    return result
  } catch (requestyError) {
    console.error(
      '[AI] Requesty failed:',
      requestyError?.message || requestyError,
    )

    throw requestyError
  }
}