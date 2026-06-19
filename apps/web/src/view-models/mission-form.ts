import type { MissionFormSource } from '@/view-models/mission-detail.types'
import type { MissionInput } from '@/view-models/mission-form.schema'

export function toMissionFormValues(source: MissionFormSource): Partial<MissionInput> {
  return {
    title: source.title,
    description: source.description ?? undefined,
    contractType: source.contractType,
    startDate: source.startDate,
    endDate: source.endDate ?? undefined,
    salaireMin: source.salaireMin ?? undefined,
    salaireMax: source.salaireMax ?? undefined,
    salaireNotes: source.salaireNotes ?? undefined,
    heuresParSemaine: source.heuresParSemaine ?? undefined,
    planning: source.planning ?? undefined,
    tempsPlein: source.tempsPlein,
    notes: source.notes ?? undefined,
    pharmacyId: source.pharmacyId,
    contactId: source.contactId ?? undefined,
    referentId: source.referentId,
    jobTitleId: source.jobTitleId,
  }
}
