import OpenAI from 'openai'
import { env } from '../../config/env.js'

const requesty = new OpenAI({
  apiKey: env.requestyApiKey,
  baseURL: 'https://router.requesty.ai/v1',
})

function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

export async function generateText({
  system,
  prompt,
  temperature = 0.7,
}) {
  const response = await requesty.chat.completions.create({
    model: env.requestyModel,
    messages: [
      {
        role: 'system',
        content: system || '',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature,
  })

  const text = response.choices?.[0]?.message?.content?.trim()

  if (!text) {
    throw new Error('Requesty returned an empty response')
  }

  return text
}

export async function generateJSON({
  system,
  prompt,
  temperature = 0.4,
}) {
  const response = await requesty.chat.completions.create({
    model: env.requestyModel,
    messages: [
      {
        role: 'system',
        content: system || '',
      },
      {
        role: 'user',
        content: `${prompt}

IMPORTANT:
Return ONLY a single valid JSON object.
Do not use markdown.
Do not use code fences.
Do not include commentary.`,
      },
    ],
    temperature,
    response_format: {
      type: 'json_object',
    },
  })

  const text = response.choices?.[0]?.message?.content

  if (!text) {
    throw new Error('Requesty returned an empty response')
  }

  return JSON.parse(stripCodeFences(text))
}