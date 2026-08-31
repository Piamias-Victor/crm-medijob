import { currentMonday, mondayOf } from '@/lib/paris-week'
import type { AvailabilitySlot, GetWeekInput, GetWeekResult, WeeklyAvailabilityStore } from './types'
import { weekDeclaration } from './week-declaration'
import { mergeWeekSlots } from './merge-week-slots'

export type SaveWeekInput = GetWeekInput & { slots: AvailabilitySlot[] }

export async function saveWeek(
  store: WeeklyAvailabilityStore,
  input: SaveWeekInput,
): Promise<GetWeekResult> {
  const found = await store.findCandidateByToken(input.token)
  if (!found) return { ok: false, reason: 'not_found' }
  const now = input.now ?? new Date()
  const weekStart = mondayOf(input.weekStart ?? currentMonday(now))
  const existing = await store.findWeek(found.candidateId, weekStart)
  const slots = mergeWeekSlots(existing?.slots ?? [], input.slots, weekStart, now)
  await store.upsertWeek(found.candidateId, weekStart, slots)
  return {
    ok: true,
    week: { weekStart, declaration: weekDeclaration(slots), slots },
  }
}
