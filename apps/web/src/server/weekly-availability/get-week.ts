import { currentMonday } from '@/lib/paris-week'
import type { GetWeekInput, GetWeekResult, WeeklyAvailabilityStore } from './types'
import { weekDeclaration } from './week-declaration'

export async function getWeek(
  store: WeeklyAvailabilityStore,
  input: GetWeekInput,
): Promise<GetWeekResult> {
  const found = await store.findCandidateByToken(input.token)
  if (!found) return { ok: false, reason: 'not_found' }
  const weekStart = input.weekStart ?? currentMonday(input.now ?? new Date())
  const row = await store.findWeek(found.candidateId, weekStart)
  return {
    ok: true,
    week: {
      weekStart,
      declaration: weekDeclaration(row ? row.slots : null),
      slots: row?.slots ?? [],
    },
  }
}
