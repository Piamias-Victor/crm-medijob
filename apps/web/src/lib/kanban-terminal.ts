import type { MissionStatus } from '@prisma/client'
import { TERMINAL_MISSION_STATUSES, TERMINAL_STAGE_NAMES } from '@/lib/pipeline-constants'

export function isTerminalMissionStatus(status: MissionStatus): boolean {
  return (TERMINAL_MISSION_STATUSES as readonly MissionStatus[]).includes(status)
}

export function isTerminalStageName(name: string): boolean {
  return (TERMINAL_STAGE_NAMES as readonly string[]).includes(name)
}

export function countActiveMissions<T extends { status: MissionStatus }>(rows: T[]): number {
  return rows.filter((row) => !isTerminalMissionStatus(row.status)).length
}
