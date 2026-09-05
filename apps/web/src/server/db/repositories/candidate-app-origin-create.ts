import type { AppOriginCreateInput } from './candidate-app-origin.repo'

export function toAppOriginCreateData(data: AppOriginCreateInput) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    jobTitleId: data.jobTitleId,
    origin: 'APP' as const,
    status: 'NOUVEAU' as const,
    badakanId: data.badakanId,
    notes: data.notes,
    availableFrom: data.availableFrom,
    mobilityRadiusKm: data.mobilityRadiusKm,
    mobilityNotes: data.mobilityNotes,
    ...(data.softwareIds?.length
      ? { softwares: { create: data.softwareIds.map((softwareId) => ({ softwareId })) } }
      : {}),
  }
}
