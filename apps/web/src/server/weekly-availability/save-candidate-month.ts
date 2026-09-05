import type { AvailabilitySlot, WeeklyAvailabilityStore } from './types'
import type { GetMonthResult } from './month.types'
import { resolveMonth, writeMonthSlots } from './write-month-slots'

export type SaveCandidateMonthInput = {
  candidateId: string
  month?: string
  slots: AvailabilitySlot[]
  now?: Date
}

export async function saveCandidateMonth(
  store: WeeklyAvailabilityStore,
  input: SaveCandidateMonthInput,
): Promise<GetMonthResult> {
  const origin = await store.findOrigin(input.candidateId)
  if (origin === null) return { ok: false, reason: 'not_found' }
  const now = input.now ?? new Date()
  const month = resolveMonth(input.month, now)
  const slots = await writeMonthSlots(store, input.candidateId, month, input.slots, now)
  return { ok: true, month: { month, slots } }
}
