import { describe, expect, it } from 'vitest'
import { toBadakanMissionDetail } from './badakan-mission-detail'

describe('toBadakanMissionDetail', () => {
  it('lists SEARCH_APPLIED recipients with phone, not Applications', () => {
    const detail = toBadakanMissionDetail({
      id: 'row1',
      pharmacyName: 'Pharmacie Hermes',
      step: 'CANCELLED',
      periods: [{ start: '2026-08-01', end: '2026-08-03' }],
      searchApplied: [
        {
          recipientId: 'r-lucie',
          firstName: 'Lucie',
          lastName: 'Robert',
          phone: '0601020304',
        },
        {
          recipientId: 'r-no-phone',
          firstName: 'Sandra',
          lastName: 'Viau',
          phone: null,
        },
      ],
    })
    expect(detail.searchApplied).toEqual([
      {
        recipientId: 'r-lucie',
        fullName: 'Lucie Robert',
        phone: '0601020304',
        telHref: 'tel:0601020304',
      },
      {
        recipientId: 'r-no-phone',
        fullName: 'Sandra Viau',
        phone: null,
        telHref: null,
      },
    ])
    expect(detail.sectionTitle).toBe('Postulés SEARCH_APPLIED')
  })
})
