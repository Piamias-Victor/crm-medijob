import {
  candidateProfileInputSchema,
  type CandidateCreateInput,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

export type CandidateDuplicateRow = Record<string, unknown> & {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  jobTitleId: string
  softwareIds: string[]
  contractTypes: string[]
  mobilityRadiusKm: number
  mobilityNotes: string
  availableFrom: string
  notes: string
  referentId: string
  cvUrl: string
}

function emptyRow(): CandidateDuplicateRow {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    jobTitleId: '',
    softwareIds: [],
    contractTypes: [],
    mobilityRadiusKm: 0,
    mobilityNotes: '',
    availableFrom: '',
    notes: '',
    referentId: '',
    cvUrl: '',
  }
}

export function toDuplicateRowFromInput(
  data: CandidateProfileInput | CandidateCreateInput,
  cvUrl?: string,
): CandidateDuplicateRow {
  return {
    ...emptyRow(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    city: data.city ?? '',
    postalCode: data.postalCode ?? '',
    jobTitleId: data.jobTitleId,
    softwareIds: data.softwareIds ?? [],
    contractTypes: data.contractTypes ?? [],
    mobilityRadiusKm: data.mobilityRadiusKm,
    mobilityNotes: data.mobilityNotes ?? '',
    availableFrom: data.availableFrom ?? '',
    notes: data.notes ?? '',
    referentId: data.referentId,
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
    softwareIds: row.softwareIds,
    contractTypes: row.contractTypes,
    mobilityRadiusKm: row.mobilityRadiusKm,
    mobilityNotes: row.mobilityNotes || undefined,
    availableFrom: row.availableFrom || undefined,
    notes: row.notes || undefined,
    referentId: row.referentId,
  })
}
