import { describe, it, expect } from 'vitest'
import { moveMissionStatus } from './mission-kanban'
import { mission } from './mission-kanban.fixtures'

describe('moveMissionStatus', () => {
  it('updates only the targeted mission status', () => {
    const rows = [mission({ id: 'm1', status: 'A_POURVOIR' }), mission({ id: 'm2' })]
    const next = moveMissionStatus(rows, 'm1', 'EN_RECHERCHE')
    expect(next.find((m) => m.id === 'm1')?.status).toBe('EN_RECHERCHE')
    expect(next.find((m) => m.id === 'm2')?.status).toBe('A_POURVOIR')
  })
})
