import { isPastYmd } from '@/lib/paris-week'
import type { AvailabilitySlot } from './types'
import { keepSavableSlots } from './keep-savable-slots'

export function mergeWeekSlots(
  existing: AvailabilitySlot[],
  incoming: AvailabilitySlot[],
  weekStart: string,
  now: Date,
): AvailabilitySlot[] {
  const past = existing.filter((slot) => isPastYmd(slot.date, now))
  return [...past, ...keepSavableSlots(weekStart, incoming, now)]
}
