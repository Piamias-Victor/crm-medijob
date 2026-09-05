import { currentMonth, monthOf, monthWeekStarts } from '@/lib/paris-month'
import type { AvailabilitySlot, WeeklyAvailabilityStore } from './types'
import type { GetMonthInput, GetMonthResult } from './month.types'

export async function readMonthSlots(
  store: WeeklyAvailabilityStore,
  candidateId: string,
  month: string,
): Promise<AvailabilitySlot[]> {
  const weeks = await Promise.all(
    monthWeekStarts(month).map((weekStart) => store.findWeek(candidateId, weekStart)),
  )
  return weeks
    .flatMap((week) => week?.slots ?? [])
    .filter((slot) => monthOf(slot.date) === month)
    .sort((a, b) => a.date.localeCompare(b.date) || a.period.localeCompare(b.period))
}

export async function getMonth(
  store: WeeklyAvailabilityStore,
  input: GetMonthInput,
): Promise<GetMonthResult> {
  const found = await store.findCandidateByToken(input.token)
  if (!found) return { ok: false, reason: 'not_found' }
  const month = input.month ?? currentMonth(input.now ?? new Date())
  return { ok: true, month: { month, slots: await readMonthSlots(store, found.candidateId, month) } }
}
