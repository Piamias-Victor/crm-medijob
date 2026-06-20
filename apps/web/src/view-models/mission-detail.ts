import type { MissionDetailEntity, MissionDetailPayload } from '@/view-models/mission-detail.types'

export type { MissionDetailEntity, MissionDetailPayload } from '@/view-models/mission-detail.types'

function toCandidateRows(entity: MissionDetailEntity) {
  return entity.candidates.map((row) => ({
    id: row.candidateId,
    fullName: `${row.candidate.firstName} ${row.candidate.lastName}`.trim(),
    stageId: row.stageId,
    stageName: row.stage.name,
    jobTitle: row.candidate.jobTitle?.name ?? null,
    city: row.candidate.city,
    postalCode: row.candidate.postalCode,
    referentName: row.candidate.referent?.name ?? null,
  }))
}

export function toMissionDetail(entity: MissionDetailEntity): MissionDetailPayload {
  const { pharmacy, jobTitle, referent, contact, ...rest } = entity

  return {
    id: entity.id,
    status: entity.status,
    pharmacyName: pharmacy.name,
    city: pharmacy.city,
    jobTitleName: jobTitle.name,
    referentName: referent.name,
    updatedAt: entity.updatedAt,
    formSource: {
      title: rest.title,
      description: rest.description,
      contractType: rest.contractType,
      startDate: rest.startDate,
      endDate: rest.endDate,
      salaireMin: rest.salaireMin,
      salaireMax: rest.salaireMax,
      salaireNotes: rest.salaireNotes,
      heuresParSemaine: rest.heuresParSemaine,
      planning: rest.planning,
      tempsPlein: rest.tempsPlein,
      notes: rest.notes,
      pharmacyId: rest.pharmacyId,
      contactId: contact?.id ?? rest.contactId,
      referentId: rest.referentId,
      jobTitleId: rest.jobTitleId,
    },
    candidates: toCandidateRows(entity),
  }
}
