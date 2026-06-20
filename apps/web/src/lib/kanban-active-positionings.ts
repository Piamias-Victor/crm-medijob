import type { MissionStatus } from '@prisma/client'
import { isTerminalMissionStatus, isTerminalStageName } from '@/lib/kanban-terminal'

type PositioningRow = {
  mission: { status: MissionStatus }
  stage: { name: string }
}

export function filterActivePositionings<T extends PositioningRow>(rows: T[]): T[] {
  return rows.filter(
    (row) => !isTerminalMissionStatus(row.mission.status) && !isTerminalStageName(row.stage.name),
  )
}
