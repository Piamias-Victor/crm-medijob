import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import { isExtractedPlaceholder } from '@/server/ai/cv-extraction-enrich'
import { matchJobTitles } from '@/server/ai/job-title-match'
import {
  DEFAULT_MOBILITY_RADIUS_KM,
  type CandidateFormSource,
} from '@/view-models/candidate-profile'
import { CREATE_CONTRACT_TYPES, type CandidateCreateInput, type CandidateProfileInput } from '@/view-models/candidate-profile.schema'
import type { RefItem } from '@/view-models/referential'

function toCreateFormSource(defaults: CandidateCreateInput): CandidateFormSource {
  return {
    firstName: defaults.firstName,
    lastName: defaults.lastName,
    email: defaults.email ?? null,
    phone: defaults.phone ?? null,
    address: defaults.address ?? null,
    city: defaults.city ?? null,
    postalCode: defaults.postalCode ?? null,
    jobTitleId: defaults.jobTitleId,
    mobilityRadiusKm: defaults.mobilityRadiusKm,
    mobilityNotes: defaults.mobilityNotes ?? null,
    availableFrom: defaults.availableFrom ? new Date(defaults.availableFrom) : null,
    notes: defaults.notes ?? null,
    referentId: defaults.referentId,
    softwareIds: defaults.softwareIds,
    contractTypes: defaults.contractTypes,
  }
}

function cleanExtracted(value: string | undefined, fallback?: string | null) {
  if (isExtractedPlaceholder(value)) return fallback ?? undefined
  return value?.trim() || fallback || undefined
}

function matchSoftwareIds(labels: string[], softwares: RefItem[]) {
  if (labels.length === 0) return []
  return softwares
    .filter((software) =>
      labels.some((label) => {
        if (isExtractedPlaceholder(label)) return false
        const needle = label.toLowerCase().trim()
        const hay = software.name.toLowerCase().trim()
        return hay.includes(needle) || needle.includes(hay)
      }),
    )
    .map((software) => software.id)
}

export function buildCvReviewFormValues(
  extraction: CvExtraction,
  profile: CandidateFormSource,
  referentials: { jobTitles: RefItem[]; softwares: RefItem[] },
): CandidateProfileInput {
  const jobTitleLabel = cleanExtracted(extraction.jobTitle)
  const suggestedJobTitleId = jobTitleLabel
    ? matchJobTitles(jobTitleLabel, referentials.jobTitles)[0]?.id
    : undefined

  return {
    firstName: cleanExtracted(extraction.firstName, profile.firstName) ?? profile.firstName,
    lastName: cleanExtracted(extraction.lastName, profile.lastName) ?? profile.lastName,
    email: cleanExtracted(extraction.email, profile.email),
    phone: cleanExtracted(extraction.phone, profile.phone),
    address: cleanExtracted(extraction.address, profile.address),
    city: cleanExtracted(extraction.city, profile.city),
    postalCode: cleanExtracted(extraction.postalCode, profile.postalCode),
    jobTitleId: suggestedJobTitleId ?? profile.jobTitleId,
    softwareIds: matchSoftwareIds(extraction.softwares ?? [], referentials.softwares),
    contractTypes:
      extraction.preferredContractTypes ??
      (profile.contractTypes as CandidateProfileInput['contractTypes']),
    mobilityRadiusKm: profile.mobilityRadiusKm ?? DEFAULT_MOBILITY_RADIUS_KM,
    mobilityNotes:
      cleanExtracted(extraction.mobilityNotes, profile.mobilityNotes) ?? profile.mobilityNotes ?? undefined,
    availableFrom: extraction.availableFrom?.slice(0, 10),
    notes:
      cleanExtracted(extraction.profileSummary, profile.notes) ?? profile.notes ?? undefined,
    referentId: profile.referentId,
  }
}

const createContractTypes = new Set<string>(CREATE_CONTRACT_TYPES)

export function buildCvCreateFormValues(
  extraction: CvExtraction,
  defaults: CandidateCreateInput,
  referentials: { jobTitles: RefItem[]; softwares: RefItem[] },
): CandidateCreateInput {
  const reviewed = buildCvReviewFormValues(extraction, toCreateFormSource(defaults), referentials)
  return {
    ...reviewed,
    contractTypes: reviewed.contractTypes.filter((type): type is CandidateCreateInput['contractTypes'][number] =>
      createContractTypes.has(type),
    ),
  }
}
