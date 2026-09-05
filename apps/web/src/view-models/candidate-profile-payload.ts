import {
  getMissingMatchingFields,
  isProfileIncompleteForMatching,
  toCandidateFormValues,
} from '@/view-models/candidate-profile'
import { toCandidateMissionRows } from '@/view-models/candidate-missions'
import { toCandidateHistoryPositionings } from '@/view-models/candidate-history'
import type { CandidateProfileRecord } from '@/server/db/repositories/candidate-profile.repository'
import { filterActivePositionings } from '@/lib/kanban-active-positionings'
import { toEffectiveCandidateStatus } from '@/view-models/candidate-status'

export function toCandidateProfilePayload(candidate: CandidateProfileRecord) {
  const matching = {
    city: candidate.city,
    postalCode: candidate.postalCode,
    mobilityRadiusKm: candidate.mobilityRadiusKm,
    availableFrom: candidate.availableFrom,
  }
  const hasActive = filterActivePositionings(candidate.missions).length > 0
  const effectiveStatus = toEffectiveCandidateStatus(candidate.status, hasActive)
  return {
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    email: candidate.email,
    phone: candidate.phone,
    address: candidate.address,
    city: candidate.city,
    postalCode: candidate.postalCode,
    jobTitleId: candidate.jobTitleId,
    jobTitleName: candidate.jobTitle.name,
    origin: candidate.origin,
    status: candidate.status,
    effectiveStatus,
    salaryExpectations: candidate.salaryExpectations,
    salaryMin: candidate.salaryMin,
    salaryMax: candidate.salaryMax,
    mobilityRadiusKm: candidate.mobilityRadiusKm,
    mobilityNotes: candidate.mobilityNotes,
    availableFrom: candidate.availableFrom,
    notes: candidate.notes,
    referentId: candidate.referentId,
    referentName: candidate.referent?.name ?? null,
    cvUrl: candidate.cvUrl,
    nir: candidate.nir,
    iban: candidate.iban,
    cvSummary: candidate.cvSummary,
    anonymizedProfile: candidate.anonymizedProfile,
    softwareIds: candidate.softwares.map((s) => s.softwareId),
    contractTypes: candidate.contractPreferences.map((p) => p.contractType),
    missions: toCandidateMissionRows(candidate.missions),
    historyPositionings: toCandidateHistoryPositionings(candidate.missions),
    formValues: toCandidateFormValues({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      city: candidate.city,
      postalCode: candidate.postalCode,
      jobTitleId: candidate.jobTitleId,
      status: candidate.status,
      salaryExpectations: candidate.salaryExpectations,
      salaryMin: candidate.salaryMin,
      salaryMax: candidate.salaryMax,
      mobilityRadiusKm: candidate.mobilityRadiusKm,
      mobilityNotes: candidate.mobilityNotes,
      availableFrom: candidate.availableFrom,
      notes: candidate.notes,
      referentId: candidate.referentId,
      softwareIds: candidate.softwares.map((s) => s.softwareId),
      contractTypes: candidate.contractPreferences.map((p) => p.contractType),
    }),
    isProfileIncompleteForMatching: isProfileIncompleteForMatching(matching),
    missingMatchingFields: getMissingMatchingFields(matching),
  }
}

export type CandidateProfilePayload = ReturnType<typeof toCandidateProfilePayload>
