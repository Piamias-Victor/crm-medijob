import type { AppProfileIntakeUpdate } from '@/server/db/repositories/app-profile.repository.types'
import type { SyncroImportMapped } from '@/view-models/syncro-import.types'

export function intakePatch(
  mapped: SyncroImportMapped,
  referentId: string | null,
  lastCalledById: string | null,
): AppProfileIntakeUpdate {
  return {
    intakeStatus: mapped.intakeStatus,
    callOutcome: mapped.callOutcome,
    plannedRdvAt: mapped.plannedRdvAt,
    notes: mapped.notes,
    referentId,
    relanceAt: mapped.relanceAt,
    ...(mapped.lastCalledAt
      ? { lastCalledAt: mapped.lastCalledAt, lastCalledById: lastCalledById ?? undefined }
      : {}),
  }
}
