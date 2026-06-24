import { buildCsv } from '@/lib/csv/build-csv'
import { sortRowsByAccessor } from '@/lib/sort-rows'
import type { CandidateExportSort } from '@/view-models/candidate-export.schema'
import type { RawCandidateExport } from '@/view-models/candidate-export.types'
import { formatExportActiveMission, formatExportJoin } from '@/view-models/candidate-export-format'
import { buildCvthequeCoreFields } from '@/view-models/cvtheque-core-fields'
import { cvthequeExportHeaders, orderExportColumnIds } from '@/view-models/cvtheque-export-columns'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'
import { formatDateFr } from '@/view-models/format-date-fr'

export type { RawCandidateExport } from '@/view-models/candidate-export.types'

export type CandidateExportRow = Record<CvthequeExportColumnId, string>

export function toCandidateExportRow(raw: RawCandidateExport, now = new Date()): CandidateExportRow {
  const core = buildCvthequeCoreFields(
    {
      lastName: raw.lastName ?? '',
      firstName: raw.firstName ?? '',
      city: raw.city ?? null,
      postalCode: raw.postalCode ?? null,
      availableFrom: raw.availableFrom ?? null,
      jobTitle: raw.jobTitle ?? null,
      referent: raw.referent ?? null,
    },
    now,
  )

  return {
    ...core,
    city: core.city ?? '',
    jobTitle: core.jobTitle ?? '',
    referent: core.referent ?? '',
    department: core.department ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    postalCode: raw.postalCode ?? '',
    address: raw.address ?? '',
    mobilityRadiusKm: raw.mobilityRadiusKm == null ? '' : String(raw.mobilityRadiusKm),
    mobilityNotes: raw.mobilityNotes ?? '',
    softwares: formatExportJoin((raw.softwares ?? []).map((entry) => entry.software.name)),
    contractTypes: formatExportJoin((raw.contractPreferences ?? []).map((entry) => entry.contractType)),
    notes: raw.notes ?? '',
    cvSummary: raw.cvSummary ?? '',
    anonymizedProfile: raw.anonymizedProfile ?? '',
    createdAt: raw.createdAt ? formatDateFr(raw.createdAt) : '',
    updatedAt: raw.updatedAt ? formatDateFr(raw.updatedAt) : '',
    activeMission: formatExportActiveMission(raw.missions ?? []),
  }
}

export function buildCandidateExportCsv(
  rows: CandidateExportRow[],
  columnIds: CvthequeExportColumnId[],
  sort?: CandidateExportSort | null,
): string {
  const orderedColumnIds = orderExportColumnIds(columnIds)
  const sorted = sort
    ? sortRowsByAccessor(rows, (row) => row[sort.columnId], sort.direction)
    : rows
  const headers = cvthequeExportHeaders(orderedColumnIds)
  const csvRows = sorted.map((row) => orderedColumnIds.map((id) => row[id]))
  return buildCsv(headers, csvRows)
}
