import { AIContentType, GenerateContentPayload } from '@/types'

const templates: Record<AIContentType, (payload: GenerateContentPayload) => string> = {
  'cover-letter': (p) =>
    `Dear Hiring Team,\n\nI am writing to apply for the role described below. Drawing on my experience with full-stack development and my work as Student Coordinator of a 700+ member developer community, I believe I can contribute meaningfully to your team from day one.\n\n${p.context.slice(0, 220)}...\n\nI would welcome the opportunity to discuss how my background aligns with your needs.\n\nSincerely,\nAditi Sharma`,
  'application-email': (p) =>
    `Subject: Application for the role at your company\n\nHello,\n\nI'm excited to apply for this position. ${p.context.slice(0, 180)}...\n\nMy resume is attached for your review. I'd love the chance to speak further.\n\nBest regards,\nAditi Sharma`,
  'hire-me-pitch': (p) =>
    `You should consider me because I combine hands-on full-stack experience with a track record of leading a large student developer community. ${p.context.slice(0, 160)}... I learn fast, ship reliably, and I'm genuinely excited about this problem space.`,
  'resume-improvement': () =>
    `Suggested improvements:\n1. Quantify project impact (e.g. "reduced query time by 40%").\n2. Move your strongest, most relevant project to the top.\n3. Add a skills section grouped by category (Languages, Frameworks, Tools).\n4. Trim older, less relevant coursework entries.`,
  'custom-response': (p) => `Here is a tailored response based on your context:\n\n${p.context}`,
}

export function buildMockAIContent(payload: GenerateContentPayload): string {
  return templates[payload.type](payload)
}
