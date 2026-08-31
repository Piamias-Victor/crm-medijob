import { isPastYmd, mondayOf, weekDates } from '@/lib/paris-week'
import type { AvailabilitySlot } from './types'

export function keepSavableSlots(
  weekStart: string,
  slots: AvailabilitySlot[],
  now: Date,
): AvailabilitySlot[] {
  const inWeek = new Set(weekDates(mondayOf(weekStart)))
  return slots.filter((slot) => inWeek.has(slot.date) && !isPastYmd(slot.date, now))
}
