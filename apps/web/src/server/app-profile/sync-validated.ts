import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import { APP_CONVERT_BATCH_LIMIT } from './convert-batch'
import { syncOneValidated } from './sync-validated-one'
import { isBadakanIdUniqueViolation } from './sync-validated-unique'
import type { SyncValidatedDeps, SyncValidatedResult } from './sync-validated.types'

export async function syncAppValidated(
  rows: BadakanRecipient[],
  deps: SyncValidatedDeps,
  heavyLimit = APP_CONVERT_BATCH_LIMIT,
): Promise<SyncValidatedResult> {
  const result: SyncValidatedResult = { created: 0, linked: 0, skipped: 0 }
  let heavy = 0
  for (const row of rows) {
    try {
      const handled = await syncOneValidated(row, deps, result, heavy, heavyLimit)
      if (handled) heavy += 1
    } catch (error) {
      if (!isBadakanIdUniqueViolation(error)) throw error
      result.skipped += 1
    }
  }
  return result
}
