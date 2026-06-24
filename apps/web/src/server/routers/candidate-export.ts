import type { CandidateDeps } from '@/server/routers/candidate'
import {
  buildCandidateExportCsv,
  toCandidateExportRow,
} from '@/view-models/candidate-export-vm'
import type { CandidateExportInput } from '@/view-models/candidate-export.schema'
import { resolveCandidateExportColumnIds } from '@/view-models/cvtheque-export-columns'

export async function handleCandidateExportCsv(deps: CandidateDeps, input: CandidateExportInput) {
  const { columnIds, sort, ...filters } = input
  const fetchColumnIds = resolveCandidateExportColumnIds(columnIds, sort)
  const rows = await deps.listForExport(filters, fetchColumnIds)
  const exportRows = rows.map((row) => toCandidateExportRow(row))
  return {
    csv: buildCandidateExportCsv(exportRows, columnIds, sort),
    rowCount: exportRows.length,
  }
}
