export const DND_MIME = 'application/json'

export type DragPayload = {
  missionId: string
  candidateId: string
  fromStageId: string
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
