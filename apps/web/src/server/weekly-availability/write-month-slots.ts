import { currentMonth, monthOf, monthWeekStarts } from '@/lib/paris-month'
import { mondayOf } from '@/lib/paris-week'
import type { AvailabilitySlot, WeeklyAvailabilityStore } from './types'
import { mergeWeekSlots } from './merge-week-slots'
import { readMonthSlots } from './get-month'

export async function writeMonthSlots(
  store: WeeklyAvailabilityStore,
  candidateId: string,
  month: string,
  slots: AvailabilitySlot[],
  now: Date,
): Promise<AvailabilitySlot[]> {
  const inMonth = slots.filter((slot) => monthOf(slot.date) === month)
  for (const weekStart of monthWeekStarts(month)) {
    const incoming = inMonth.filter((slot) => mondayOf(slot.date) === weekStart)
    const existing = await store.findWeek(candidateId, weekStart)
    const outsideMonth = (existing?.slots ?? []).filter((slot) => monthOf(slot.date) !== month)
    const merged = mergeWeekSlots(existing?.slots ?? [], [...outsideMonth, ...incoming], weekStart, now)
    await store.upsertWeek(candidateId, weekStart, merged)
  }
  return readMonthSlots(store, candidateId, month)
}

export function resolveMonth(month: string | undefined, now: Date): string {
  return month ?? currentMonth(now)
}
