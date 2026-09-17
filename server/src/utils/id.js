import { randomUUID } from 'crypto'

/**
 * Generates a short, prefixed, human-readable id (e.g. "app_3f2a1c9e...").
 * These are used as the actual MongoDB _id (String) for top-level documents,
 * so `doc._id === doc.id` and no ObjectId → string mapping is needed anywhere
 * the frontend expects `id: string`.
 */
export function genId(prefix) {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 20)}`
}
