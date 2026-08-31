import type { AvailabilitySlot, WeeklyAvailabilityStore } from './types'

type TokenRow = { candidateId: string }
type Seed = { token?: string; candidateId: string; origin?: 'APP' | 'CRM' }

export function memoryAvailabilityStore(seed: Seed[] = []): WeeklyAvailabilityStore {
  const tokens = new Map<string, TokenRow>()
  const byCandidate = new Map<string, string>()
  const origins = new Map<string, 'APP' | 'CRM'>()
  const weeks = new Map<string, AvailabilitySlot[]>()
  for (const row of seed) {
    origins.set(row.candidateId, row.origin ?? 'APP')
    if (row.token) {
      tokens.set(row.token, { candidateId: row.candidateId })
      byCandidate.set(row.candidateId, row.token)
    }
  }
  return {
    findCandidateByToken: async (token) => tokens.get(token) ?? null,
    findWeek: async (candidateId, weekStart) => {
      const slots = weeks.get(`${candidateId}:${weekStart}`)
      return slots ? { slots } : null
    },
    upsertWeek: async (candidateId, weekStart, slots) => {
      weeks.set(`${candidateId}:${weekStart}`, slots)
    },
    findOrigin: async (candidateId) => origins.get(candidateId) ?? null,
    findTokenByCandidate: async (candidateId) => byCandidate.get(candidateId) ?? null,
    insertToken: async (candidateId, token) => {
      tokens.set(token, { candidateId })
      byCandidate.set(candidateId, token)
      origins.set(candidateId, origins.get(candidateId) ?? 'APP')
    },
  }
}
