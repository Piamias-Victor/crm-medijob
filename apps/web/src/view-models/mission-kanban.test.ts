import { describe, it, expect } from 'vitest'
import { buildMissionKanbanColumns, toMissionListItems } from './mission-kanban'
import { mission } from './mission-kanban.fixtures'

describe('buildMissionKanbanColumns', () => {
  it('builds 4 active columns excluding terminal statuses', () => {
    const cols = buildMissionKanbanColumns([
      mission({ id: 'm1', status: 'A_POURVOIR' }),
      mission({ id: 'm2', status: 'POURVU' }),
    ])
    expect(cols).toHaveLength(4)
    expect(cols.map((c) => c.status)).toEqual([
      'A_POURVOIR',
      'EN_RECHERCHE',
      'CANDIDATS_PRESENTES',
      'ENTRETIEN_EN_COURS',
    ])
    expect(cols[0].cards.map((c) => c.missionId)).toEqual(['m1'])
  })

  it('hides POURVU and ANNULEE missions from kanban cards', () => {
    const cols = buildMissionKanbanColumns([
      mission({ id: 'm1', status: 'POURVU' }),
      mission({ id: 'm2', status: 'ANNULEE' }),
    ])
    expect(cols.every((col) => col.cards.length === 0)).toBe(true)
  })
})

describe('toMissionListItems', () => {
  it('maps title, jobTitle, pharmacy, city, status, referent, startDate', () => {
    const items = toMissionListItems([mission()])
    expect(items[0]).toEqual({
      id: 'm1',
      title: 'Titulaire CDI',
      jobTitle: 'Pharmacien',
      pharmacyName: 'Pharmacie du Centre',
      city: 'Lyon',
      status: 'A_POURVOIR',
      referent: 'Référent Demo',
      startDate: new Date('2025-01-15'),
    })
  })
})
