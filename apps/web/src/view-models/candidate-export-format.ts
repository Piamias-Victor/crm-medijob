import type { MissionStatus } from '@prisma/client'
import { filterActivePositionings } from '@/lib/kanban-active-positionings'

type ExportMission = {
  mission: { title: string; status: MissionStatus }
  stage: { name: string }
}

const joinValues = (values: string[]) => values.filter(Boolean).join('; ')

export function formatExportActiveMission(missions: ExportMission[]): string {
  const active = filterActivePositionings(missions)
  if (active.length === 0) return 'Non'
  return joinValues(active.map((row) => `Oui — ${row.mission.title}`))
}

export function formatExportJoin(values: string[]): string {
  return joinValues(values)
}
