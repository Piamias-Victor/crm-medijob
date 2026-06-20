import {
  getMissingMatchingFields,
  isProfileIncompleteForMatching,
  toCandidateFormValues,
} from '@/view-models/candidate-profile'
import { toCandidateMissionRows } from '@/view-models/candidate-missions'
import type { Prisma } from '@prisma/client'

type ProfileRecord = Prisma.CandidateGetPayload<{
  include: {
    jobTitle: { select: { id: true; name: true } }
    referent: { select: { id: true; name: true } }
    softwares: { select: { softwareId: true } }
    contractPreferences: { select: { contractType: true } }
    missions: {
      select: {
        stage: { select: { id: true; name: true; position: true } }
        mission: { select: { id: true; title: true; status: true } }
      }
    }
  }
}>

export function toCandidateProfilePayload(candidate: ProfileRecord) {
  const matching = {
    city: candidate.city,
    postalCode: candidate.postalCode,
    mobilityRadiusKm: candidate.mobilityRadiusKm,
    availableFrom: candidate.availableFrom,
  }
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
    mobilityRadiusKm: candidate.mobilityRadiusKm,
    mobilityNotes: candidate.mobilityNotes,
    availableFrom: candidate.availableFrom,
    notes: candidate.notes,
    referentId: candidate.referentId,
    referentName: candidate.referent.name,
    cvUrl: candidate.cvUrl,
    cvSummary: candidate.cvSummary,
    anonymizedProfile: candidate.anonymizedProfile,
    softwareIds: candidate.softwares.map((s) => s.softwareId),
    contractTypes: candidate.contractPreferences.map((p) => p.contractType),
    missions: toCandidateMissionRows(candidate.missions),
    formValues: toCandidateFormValues({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      city: candidate.city,
      postalCode: candidate.postalCode,
      jobTitleId: candidate.jobTitleId,
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
