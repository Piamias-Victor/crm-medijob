import type { ManualCandidateStatus } from '@/view-models/candidate-status'

export type CandidateDuplicateRow = Record<string, unknown> & {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  jobTitleId: string
  status: ManualCandidateStatus
  softwareIds: string[]
  contractTypes: string[]
  mobilityRadiusKm: number
  mobilityNotes: string
  availableFrom: string
  notes: string
  referentId: string
  cvUrl: string
}

export function emptyCandidateDuplicateRow(): CandidateDuplicateRow {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    jobTitleId: '',
    status: 'NOUVEAU',
    softwareIds: [],
    contractTypes: [],
    mobilityRadiusKm: 1,
    mobilityNotes: '',
    availableFrom: '',
    notes: '',
    referentId: '',
    cvUrl: '',
  }
}
