import type { CandidateProfileUpdate } from './candidate-profile.repository'

export function toCandidateProfileWriteData(data: CandidateProfileUpdate) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email ?? null,
    phone: data.phone ?? null,
    address: data.address ?? null,
    city: data.city ?? null,
    postalCode: data.postalCode ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    jobTitleId: data.jobTitleId,
    status: data.status ?? 'NOUVEAU',
    salaryExpectations: data.salaryExpectations ?? null,
    salaryMin: data.salaryMin ?? null,
    salaryMax: data.salaryMax ?? null,
    mobilityRadiusKm: data.mobilityRadiusKm,
    mobilityNotes: data.mobilityNotes ?? null,
    availableFrom: data.availableFrom ?? null,
    notes: data.notes ?? null,
    referentId: data.referentId ?? null,
    softwares: { create: data.softwareIds.map((softwareId) => ({ softwareId })) },
    contractPreferences: {
      create: data.contractTypes.map((contractType) => ({ contractType })),
    },
  }
}

export function toCandidateProfileUpdateData(
  data: CandidateProfileUpdate,
): ReturnType<typeof toCandidateProfileWriteData> & { cvUrl?: string } {
  return {
    ...toCandidateProfileWriteData(data),
    ...(data.cvUrl ? { cvUrl: data.cvUrl } : {}),
  }
}
