import type { MissionStatus } from '@prisma/client'

export const DND_MIME = 'application/json'

export type DragPayload = {
  missionId: string
  candidateId: string
  fromStageId: string
}

export type MissionDragPayload = {
  missionId: string
  fromStatus: MissionStatus
}

export function readDragPayload(data: string): DragPayload | null {
  if (!data) return null
  try {
    const parsed = JSON.parse(data) as Partial<DragPayload>
    if (!parsed.missionId || !parsed.candidateId || !parsed.fromStageId) return null
    return { ...parsed } as DragPayload
  } catch {
    return null
  }
}

export function readMissionDragPayload(data: string): MissionDragPayload | null {
  if (!data) return null
  try {
    const parsed = JSON.parse(data) as Partial<MissionDragPayload>
    if (!parsed.missionId || !parsed.fromStatus) return null
    return { ...parsed } as MissionDragPayload
  } catch {
    return null
  }
}
