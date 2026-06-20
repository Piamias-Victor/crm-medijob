import { describe, it, expect } from 'vitest'
import { filterActivePositionings } from '@/lib/kanban-active-positionings'

describe('filterActivePositionings', () => {
  it('exclut mission POURVU et stage terminal Placé', () => {
    const rows = [
      {
        mission: { status: 'POURVU' as const },
        stage: { name: 'Contacté' },
      },
      {
        mission: { status: 'A_POURVOIR' as const },
        stage: { name: 'Placé' },
      },
      {
        mission: { status: 'EN_RECHERCHE' as const },
        stage: { name: 'Nouveau' },
      },
    ]
    expect(filterActivePositionings(rows)).toEqual([rows[2]])
  })
})
