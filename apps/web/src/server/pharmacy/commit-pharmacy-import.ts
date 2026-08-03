import type { PharmacyCsvImportRow } from '@/view-models/pharmacy-csv-import.schema'
import type { PharmacyDuplicateMatch } from '@/server/pharmacy/detect-duplicate.types'
import type { DetectPharmacyDuplicateInput } from '@/view-models/pharmacy-duplicate.schema'
import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'
import type { PharmacyUpdate } from '@/view-models/pharmacy-update'

export type PharmacyImportDuplicate = {
  row: PharmacyCsvImportRow
  matches: PharmacyDuplicateMatch[]
}

export type CommitPharmacyImportResult = {
  createdIds: string[]
  duplicates: PharmacyImportDuplicate[]
}

type CommitDeps = {
  detectDuplicates: (input: DetectPharmacyDuplicateInput) => Promise<PharmacyDuplicateMatch[]>
  create: (data: PharmacyUpdate) => Promise<{ id: string }>
}

export async function commitPharmacyImport(
  rows: PharmacyCsvImportRow[],
  deps: CommitDeps,
): Promise<CommitPharmacyImportResult> {
  const createdIds: string[] = []
  const duplicates: PharmacyImportDuplicate[] = []

  for (const row of rows) {
    const matches = await deps.detectDuplicates({
      name: row.name,
      siret: row.siret,
      city: row.city,
      postalCode: row.postalCode,
    })
    if (matches.length > 0) {
      duplicates.push({ row, matches })
      continue
    }
    const created = await deps.create(toPharmacyUpdateData(row))
    createdIds.push(created.id)
  }

  return { createdIds, duplicates }
}
