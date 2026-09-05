import type { AvailabilitySlot } from './types'

export type MonthView = {
  month: string
  slots: AvailabilitySlot[]
}

export type GetMonthResult = { ok: true; month: MonthView } | { ok: false; reason: 'not_found' }

export type GetMonthInput = {
  token: string
  month?: string
  now?: Date
}

export type SaveMonthInput = GetMonthInput & { slots: AvailabilitySlot[] }
