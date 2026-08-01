import { z } from 'zod'
import { candidateCreateInputSchema } from '@/view-models/candidate-profile.schema'
import { CREATE_DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import { parseCandidateCsvStatus } from '@/view-models/candidate-csv-status'
import { resolveCandidateCsvJobTitleId } from '@/view-models/candidate-csv-job-title'
import { buildCandidateCsvRowPayload } from '@/view-models/candidate-csv-row-payload'

const optionalHeader = z.string().trim().min(1).optional()

export const candidateCsvColumnMapSchema = z.object({
  firstName: z.string().trim().min(1, 'Colonne prénom requise'),
  lastName: z.string().trim().min(1, 'Colonne nom requise'),
  jobTitle: z.string().trim().min(1, 'Colonne métier requise'),
  email: optionalHeader,
  phone: optionalHeader,
  address: optionalHeader,
  city: optionalHeader,
  postalCode: optionalHeader,
  status: optionalHeader,
  mobilityRadiusKm: optionalHeader,
  salaryExpectations: optionalHeader,
  notes: optionalHeader,
})

export type CandidateCsvColumnMap = z.infer<typeof candidateCsvColumnMapSchema>
export type CandidateCsvImportRow = z.output<typeof candidateCreateInputSchema>
export type CandidateCsvRowError = { row: number; message: string }
export type CandidateCsvJobTitle = { id: string; name: string }

export function mapCandidateCsvRows(
  headers: string[],
  dataRows: string[][],
  map: CandidateCsvColumnMap,
  jobTitles: CandidateCsvJobTitle[],
): { rows: CandidateCsvImportRow[]; errors: CandidateCsvRowError[] } {
  const rows: CandidateCsvImportRow[] = []
  const errors: CandidateCsvRowError[] = []
  dataRows.forEach((cells, index) => {
    const row = index + 2
    const payload = buildCandidateCsvRowPayload(headers, cells, map)
    if (payload.statusRaw && !parseCandidateCsvStatus(payload.statusRaw)) {
      errors.push({ row, message: 'Statut invalide' })
      return
    }
    const jobTitleId = resolveCandidateCsvJobTitleId(payload.jobTitleLabel, jobTitles)
    if (!jobTitleId) {
      errors.push({ row, message: 'Métier inconnu ou manquant' })
      return
    }
    const parsed = candidateCreateInputSchema.safeParse({
      ...payload.fields,
      jobTitleId,
      status: parseCandidateCsvStatus(payload.statusRaw) ?? 'NOUVEAU',
      mobilityRadiusKm: payload.mobilityRadiusKm ?? CREATE_DEFAULT_MOBILITY_RADIUS_KM,
      softwareIds: [],
      contractTypes: [],
    })
    if (!parsed.success) {
      errors.push({ row, message: parsed.error.issues[0]?.message ?? 'Ligne invalide' })
      return
    }
    rows.push(parsed.data)
  })
  return { rows, errors }
}
