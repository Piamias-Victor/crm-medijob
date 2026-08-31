import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'
import type { WeekGridDay } from './weekly-availability-grid'

export function slotsFromDays(days: WeekGridDay[]): AvailabilitySlotInput[] {
  return days.flatMap((day) => {
    const slots: AvailabilitySlotInput[] = []
    if (day.am) slots.push({ date: day.date, period: 'AM' })
    if (day.pm) slots.push({ date: day.date, period: 'PM' })
    return slots
  })
}

export function canCopyWeeklyAvailabilityLink(origin: 'APP' | 'CRM'): boolean {
  return origin === 'APP'
}
