import { addDaysYmd, isPastYmd } from '@/lib/paris-week'
import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'

export type WeekGridDay = {
  date: string
  clickable: boolean
  am: boolean
  pm: boolean
}

export type WeekGrid = {
  weekStart: string
  days: WeekGridDay[]
}

export function toWeekGrid(input: {
  weekStart: string
  slots: AvailabilitySlotInput[]
  now: Date
}): WeekGrid {
  const selected = new Set(input.slots.map((s) => `${s.date}:${s.period}`))
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDaysYmd(input.weekStart, i)
    return {
      date,
      clickable: !isPastYmd(date, input.now),
      am: selected.has(`${date}:AM`),
      pm: selected.has(`${date}:PM`),
    }
  })
  return { weekStart: input.weekStart, days }
}
