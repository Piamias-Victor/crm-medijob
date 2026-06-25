import { KANBAN_MISSIONS_LIMIT } from '@/lib/kanban-limits'

export const candidateCvthequeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  city: true,
  postalCode: true,
  availableFrom: true,
  jobTitle: { select: { name: true } },
  referent: { select: { name: true } },
  missions: {
    take: KANBAN_MISSIONS_LIMIT,
    select: {
      stageId: true,
      stage: { select: { id: true, name: true, position: true } },
      mission: { select: { id: true, title: true, status: true } },
    },
  },
} as const
