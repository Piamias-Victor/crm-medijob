import type { WeeklyAvailabilityStore } from './types'
import { weeklyAvailabilityPath } from '@/view-models/weekly-availability-path'

export type EnsureLinkInput = {
  candidateId: string
  createToken: () => string
}

export type EnsureLinkResult =
  | { ok: true; path: string; token: string }
  | { ok: false; reason: 'not_found' | 'not_app_origin' }

export async function ensureLink(
  store: WeeklyAvailabilityStore,
  input: EnsureLinkInput,
): Promise<EnsureLinkResult> {
  const origin = await store.findOrigin(input.candidateId)
  if (!origin) return { ok: false, reason: 'not_found' }
  if (origin !== 'APP') return { ok: false, reason: 'not_app_origin' }
  const existing = await store.findTokenByCandidate(input.candidateId)
  const token = existing ?? input.createToken()
  if (!existing) await store.insertToken(input.candidateId, token)
  return { ok: true, path: weeklyAvailabilityPath(token), token }
}
