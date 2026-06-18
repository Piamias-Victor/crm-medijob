export type PositionUpdate = { id: string; position: number }

export function toPositionUpdates(orderedIds: string[]): PositionUpdate[] {
  return orderedIds.map((id, position) => ({ id, position }))
}
