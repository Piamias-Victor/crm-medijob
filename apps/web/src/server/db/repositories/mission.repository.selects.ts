import type { Prisma } from '@prisma/client'

export const missionDetailSelect = {
  id: true,
  title: true,
  description: true,
  contractType: true,
  startDate: true,
  endDate: true,
  status: true,
  salaireMin: true,
  salaireMax: true,
  salaireNotes: true,
  heuresParSemaine: true,
  planning: true,
  tempsPlein: true,
  notes: true,
  pharmacyId: true,
  contactId: true,
  referentId: true,
  jobTitleId: true,
  updatedAt: true,
  pharmacy: { select: { name: true, city: true } },
  jobTitle: { select: { name: true } },
  referent: { select: { name: true } },
  contact: { select: { id: true, firstName: true, lastName: true } },
  candidates: {
    select: {
      candidateId: true,
      stageId: true,
      stage: { select: { id: true, name: true, position: true } },
      candidate: {
        select: {
          firstName: true,
          lastName: true,
          city: true,
          postalCode: true,
          jobTitle: { select: { name: true } },
          referent: { select: { name: true } },
        },
      },
    },
  },
} satisfies Prisma.MissionSelect
