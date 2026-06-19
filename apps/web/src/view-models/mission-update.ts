import type { MissionFormValues } from '@/view-models/mission-form.schema'

const toNull = (value?: string) => value ?? null

export function toMissionUpdateData(data: MissionFormValues) {
  return {
    title: data.title,
    description: toNull(data.description),
    contractType: data.contractType,
    startDate: data.startDate,
    endDate: data.endDate ?? null,
    salaireMin: data.salaireMin ?? null,
    salaireMax: data.salaireMax ?? null,
    salaireNotes: toNull(data.salaireNotes),
    heuresParSemaine: data.heuresParSemaine ?? null,
    planning: toNull(data.planning),
    tempsPlein: data.tempsPlein,
    notes: toNull(data.notes),
    pharmacyId: data.pharmacyId,
    contactId: toNull(data.contactId),
    referentId: data.referentId,
    jobTitleId: data.jobTitleId,
  }
}
