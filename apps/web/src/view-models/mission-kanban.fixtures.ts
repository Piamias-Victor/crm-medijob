import type { MissionStatus } from '@prisma/client'
import type { RawMission } from './mission-kanban.types'

export function mission(over: Partial<RawMission> = {}): RawMission {
  return {
    id: 'm1',
    title: 'Titulaire CDI',
    status: 'A_POURVOIR',
    startDate: new Date('2025-01-15'),
    jobTitle: { name: 'Pharmacien' },
    pharmacy: { name: 'Pharmacie du Centre', city: 'Lyon' },
    referent: { name: 'Référent Demo' },
    ...over,
  }
}

export function missionsByStatus(status: MissionStatus, count = 1): RawMission[] {
  return Array.from({ length: count }, (_, i) =>
    mission({ id: `m-${status}-${i}`, status }),
  )
}
