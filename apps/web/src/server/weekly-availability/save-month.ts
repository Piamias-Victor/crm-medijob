import type { WeeklyAvailabilityStore } from './types'
import type { GetMonthResult, SaveMonthInput } from './month.types'
import { resolveMonth, writeMonthSlots } from './write-month-slots'

export async function saveMonth(
  store: WeeklyAvailabilityStore,
  input: SaveMonthInput,
): Promise<GetMonthResult> {
  const found = await store.findCandidateByToken(input.token)
  if (!found) return { ok: false, reason: 'not_found' }
  const now = input.now ?? new Date()
  const month = resolveMonth(input.month, now)
  const slots = await writeMonthSlots(store, found.candidateId, month, input.slots, now)
  return { ok: true, month: { month, slots } }
}
