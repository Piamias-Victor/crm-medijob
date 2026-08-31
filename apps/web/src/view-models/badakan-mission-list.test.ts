import { describe, expect, it } from 'vitest'
import { toBadakanMissionListItem } from './badakan-mission-list'

describe('toBadakanMissionListItem', () => {
  it('shows pharmacy name, period dates and step — not a CRM Mission title', () => {
    const item = toBadakanMissionListItem({
      id: 'row1',
      pharmacyName: 'Pharmacie Hermes',
      step: 'CANCELLED',
      periods: [{ start: '2026-08-01', end: '2026-08-03' }],
    })
    expect(item.pharmacyName).toBe('Pharmacie Hermes')
    expect(item.stepLabel).toBe('Annulée')
    expect(item.periodLabel).toContain('01/08/2026')
    expect(item.href).toBe('/interim/missions/row1')
  })
})
