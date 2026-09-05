import { isBadakanInactive } from '@/server/badakan/map-recipient-status'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { LinkedAppCandidate, SyncValidatedDeps } from './sync-validated.types'

export async function inactivateIfSuspended(
  row: BadakanRecipient,
  deps: SyncValidatedDeps,
): Promise<boolean> {
  if (!isBadakanInactive(row.status)) return false
  const existing = await deps.findByBadakanId(row.badakanId)
  if (!existing || existing.status === 'BLACKLISTE' || existing.status === 'INACTIF') {
    return true
  }
  await deps.applyLifecycle(existing.id, {
    status: 'INACTIF',
    statusBeforeInactive: existing.status,
  })
  return true
}

export async function restoreIfCompleted(
  existing: LinkedAppCandidate,
  deps: SyncValidatedDeps,
) {
  if (existing.status !== 'INACTIF' || !existing.statusBeforeInactive) return
  await deps.applyLifecycle(existing.id, {
    status: existing.statusBeforeInactive,
    statusBeforeInactive: null,
  })
}
