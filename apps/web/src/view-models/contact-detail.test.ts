import { describe, it, expect } from 'vitest'
import { toContactDetail, toContactMissionRows } from '@/view-models/contact-detail'

const entity = {
  id: 'c1',
  firstName: 'Marie',
  lastName: 'Curie',
  email: 'marie@example.com',
  phone: null,
  role: 'TITULAIRE' as const,
  isPrimary: true,
  notes: null,
  pharmacyId: 'p1',
  updatedAt: new Date('2026-01-15'),
  pharmacy: { id: 'p1', name: 'Pharmacie du Centre' },
}

describe('toContactDetail', () => {
  it('maps Contact entity to UI payload', () => {
    const payload = toContactDetail(entity)
    expect(payload.fullName).toBe('Marie Curie')
    expect(payload.pharmacyName).toBe('Pharmacie du Centre')
    expect(payload).not.toHaveProperty('deletedAt')
  })
})

describe('toContactMissionRows', () => {
  it('passes through mission fields for Contact missions tab', () => {
    const rows = toContactMissionRows([
      { id: 'm1', title: 'CDI', status: 'A_POURVOIR', pharmacy: { name: 'Pharma' } },
    ])
    expect(rows[0]?.title).toBe('CDI')
  })
})
