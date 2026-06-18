import { describe, it, expect } from 'vitest'
import { activeMissions, buildKanbanColumns, toListItems } from './candidate-kanban'
import { stages, row, candidate } from './candidate-kanban.fixtures'

describe('activeMissions', () => {
  it('keeps missions on active status and non-terminal stage', () => {
    const c = candidate({ missions: [row('m1', stages[0])] })
    expect(activeMissions(c).map((m) => m.mission.id)).toEqual(['m1'])
  })

  it('drops missions with terminal status POURVU/ANNULEE', () => {
    const c = candidate({
      missions: [row('m1', stages[0], 'POURVU'), row('m2', stages[0], 'ANNULEE')],
    })
    expect(activeMissions(c)).toHaveLength(0)
  })

  it('drops missions positioned on a terminal stage', () => {
    const c = candidate({ missions: [row('m1', stages[2])] })
    expect(activeMissions(c)).toHaveLength(0)
  })
})

describe('buildKanbanColumns', () => {
  it('orders columns by stage position', () => {
    const cols = buildKanbanColumns(stages, [])
    expect(cols.map((c) => c.stage.name)).toEqual(['Nouveau', 'Contacté', 'Placé'])
  })

  it('groups a candidate active rows under the column of each row stage', () => {
    const c = candidate({ missions: [row('m1', stages[0]), row('m2', stages[1])] })
    const cols = buildKanbanColumns(stages, [c])

    expect(cols[0].cards).toHaveLength(1)
    expect(cols[0].cards[0].rows.map((r) => r.missionId)).toEqual(['m1'])
    expect(cols[1].cards[0].rows.map((r) => r.missionId)).toEqual(['m2'])
  })

  it('keeps two rows of the same candidate in one card when same stage', () => {
    const c = candidate({ missions: [row('m1', stages[0]), row('m2', stages[0])] })
    const cols = buildKanbanColumns(stages, [c])

    expect(cols[0].cards).toHaveLength(1)
    expect(cols[0].cards[0].rows).toHaveLength(2)
  })

  it('excludes terminal rows from columns', () => {
    const c = candidate({ missions: [row('m1', stages[2])] })
    const cols = buildKanbanColumns(stages, [c])
    expect(cols.every((col) => col.cards.length === 0)).toBe(true)
  })
})

describe('toListItems', () => {
  it('exposes name, jobTitle, city, referent and active mission count', () => {
    const c = candidate({ missions: [row('m1', stages[0]), row('m2', stages[2])] })
    expect(toListItems([c])[0]).toEqual({
      id: 'c1',
      name: 'Alice Martin',
      jobTitle: 'Pharmacien',
      city: 'Lyon',
      referent: 'Bob Réf',
      activeMissionCount: 1,
    })
  })
})
