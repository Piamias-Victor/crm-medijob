import type { CandidateCsvImportRow } from '@/view-models/candidate-csv-import.schema'
import type { ImportDuplicateMatch } from '@/server/candidate/detect-duplicate.types'
import type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'
import { toCandidateCreateData } from '@/view-models/candidate-profile-map'

export type CandidateImportDuplicate = {
  row: CandidateCsvImportRow
  matches: ImportDuplicateMatch[]
}

export type CommitCandidateImportResult = {
  createdIds: string[]
  duplicates: CandidateImportDuplicate[]
}

type CommitDeps = {
  detectDuplicates: (input: {
    email?: string
    phone?: string
  }) => Promise<ImportDuplicateMatch[]>
  create: (data: CandidateProfileUpdate) => Promise<{ id: string }>
}

export async function commitCandidateImport(
  rows: CandidateCsvImportRow[],
  deps: CommitDeps,
): Promise<CommitCandidateImportResult> {
  const createdIds: string[] = []
  const duplicates: CandidateImportDuplicate[] = []

  for (const row of rows) {
    const matches = await deps.detectDuplicates({
      email: row.email,
      phone: row.phone,
    })
    if (matches.length > 0) {
      duplicates.push({ row, matches })
      continue
    }
    const created = await deps.create(toCandidateCreateData(row, 'IMPORT'))
    createdIds.push(created.id)
  }

  return { createdIds, duplicates }
}
