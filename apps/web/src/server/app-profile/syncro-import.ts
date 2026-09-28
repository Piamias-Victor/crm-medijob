import type { SyncroImportDeps, SyncroImportResult } from './syncro-import.types'
import { mapSyncroRow, type SyncroSheetRow } from '@/view-models/syncro-import-map'
import { applySyncroMapped } from './syncro-import-apply'

export type { SyncroImportDeps, SyncroImportResult } from './syncro-import.types'

export async function importSyncroRows(
  rows: SyncroSheetRow[],
  deps: SyncroImportDeps,
  opts: { dryRun?: boolean } = {},
): Promise<SyncroImportResult> {
  const dryRun = opts.dryRun === true
  const result: SyncroImportResult = { updated: 0, created: 0, skipped: 0, dryRun }
  for (const row of rows) {
    if (!row.id?.trim() || !row.prenom?.trim() || !row.nom?.trim()) {
      result.skipped += 1
      continue
    }
    const mapped = mapSyncroRow(row)
    const existing = await deps.findByBadakanId(mapped.badakanId)
    if (!existing) {
      if (dryRun) {
        result.created += 1
        continue
      }
      const created = await applySyncroMapped(mapped, deps, null)
      if (!created) result.skipped += 1
      else result.created += 1
      continue
    }
    if (dryRun) {
      result.updated += 1
      continue
    }
    await applySyncroMapped(mapped, deps, existing)
    result.updated += 1
  }
  return result
}
