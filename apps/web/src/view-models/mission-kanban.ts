import type { MissionStatus } from '@prisma/client'
import { TERMINAL_MISSION_STATUSES } from '@/lib/pipeline-constants'
import { MISSION_STATUS_ORDER, STATUS_LABELS } from '@/lib/mission-options'
import type {
  MissionKanbanCard,
  MissionKanbanColumn,
  MissionListItem,
  RawMission,
} from './mission-kanban.types'

export type * from './mission-kanban.types'

const isTerminal = (status: MissionStatus) =>
  (TERMINAL_MISSION_STATUSES as readonly MissionStatus[]).includes(status)

const activeStatuses = () =>
  MISSION_STATUS_ORDER.filter((status) => !isTerminal(status))

function toKanbanCard(mission: RawMission): MissionKanbanCard {
  return {
    missionId: mission.id,
    title: mission.title,
    jobTitle: mission.jobTitle?.name ?? null,
    pharmacyName: mission.pharmacy.name,
    city: mission.pharmacy.city,
    referent: mission.referent?.name ?? null,
    fromStatus: mission.status,
  }
}

export function buildMissionKanbanColumns(missions: RawMission[]): MissionKanbanColumn[] {
  const active = missions.filter((m) => !isTerminal(m.status))
  return activeStatuses().map((status) => ({
    status,
    label: STATUS_LABELS[status],
    cards: active.filter((m) => m.status === status).map(toKanbanCard),
  }))
}

export function toMissionListItems(missions: RawMission[]): MissionListItem[] {
  return missions.map((m) => ({
    id: m.id,
    title: m.title,
    jobTitle: m.jobTitle?.name ?? null,
    pharmacyName: m.pharmacy.name,
    city: m.pharmacy.city,
    status: m.status,
    referent: m.referent?.name ?? null,
    startDate: m.startDate,
  }))
}

export function moveMissionStatus(
  missions: RawMission[],
  missionId: string,
  status: MissionStatus,
): RawMission[] {
  return missions.map((m) => (m.id === missionId ? { ...m, status } : m))
}
