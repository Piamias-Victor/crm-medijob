import {
  candidateProfileInputSchema,
  type CandidateCreateInput,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import {
  emptyCandidateDuplicateRow,
  type CandidateDuplicateRow,
} from '@/view-models/candidate-duplicate-row'

export type { CandidateDuplicateRow } from '@/view-models/candidate-duplicate-row'

export function toDuplicateRowFromInput(
  data: CandidateProfileInput | CandidateCreateInput,
  cvUrl?: string,
): CandidateDuplicateRow {
  return {
    ...emptyCandidateDuplicateRow(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    city: data.city ?? '',
    postalCode: data.postalCode ?? '',
    jobTitleId: data.jobTitleId,
    status: data.status,
    softwareIds: data.softwareIds ?? [],
    contractTypes: data.contractTypes ?? [],
    mobilityRadiusKm: data.mobilityRadiusKm,
    mobilityNotes: data.mobilityNotes ?? '',
    availableFrom: data.availableFrom ?? '',
    notes: data.notes ?? '',
    referentId: data.referentId ?? '',
    cvUrl: cvUrl ?? ('cvUrl' in data ? data.cvUrl ?? '' : ''),
  }
}

export function toDuplicateRowFromProfile(profile: CandidateProfilePayload): CandidateDuplicateRow {
  return toDuplicateRowFromInput(profile.formValues, profile.cvUrl ?? undefined)
}

export function toProfileInputFromDuplicateRow(row: CandidateDuplicateRow) {
  return candidateProfileInputSchema.parse({
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    city: row.city || undefined,
    postalCode: row.postalCode || undefined,
    jobTitleId: row.jobTitleId,
    status: row.status,
    softwareIds: row.softwareIds,
    contractTypes: row.contractTypes,
    mobilityRadiusKm: Math.max(1, row.mobilityRadiusKm || 1),
    mobilityNotes: row.mobilityNotes || undefined,
    availableFrom: row.availableFrom || undefined,
    notes: row.notes || undefined,
    referentId: row.referentId || null,
  })
}
