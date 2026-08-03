import { describe, it, expect } from 'vitest'
import { toMissionQuickView } from '@/view-models/mission-quick-view'
import type { MissionQuickViewEntity } from '@/view-models/mission-quick-view.types'

const entity: MissionQuickViewEntity = {
  id: 'm1',
  title: 'Titulaire CDI',
  status: 'EN_RECHERCHE',
  contractType: 'VACATION',
  jobTitle: { name: 'Pharmacien' },
  referent: { name: 'Réf Demo' },
  pharmacy: {
    name: 'Pharmacie du Centre',
    address: '1 rue Test',
    postalCode: '69003',
    city: 'Lyon',
    phone: '0400000000',
  },
  lastActivity: {
    id: 'a1',
    type: 'NOTE',
    content: 'Fiche créée',
    date: new Date('2026-02-01'),
    createdAt: new Date('2026-02-01'),
    author: { name: 'Système' },
  },
}

describe('toMissionQuickView', () => {
  it('maps coords, status, contract, métier, référent, last action', () => {
    const view = toMissionQuickView(entity)
    expect(view.pharmacyName).toBe('Pharmacie du Centre')
    expect(view.coordinates.city).toBe('Lyon')
    expect(view.status).toBe('EN_RECHERCHE')
    expect(view.contractType).toBe('VACATION')
    expect(view.jobTitleName).toBe('Pharmacien')
    expect(view.referentName).toBe('Réf Demo')
    expect(view.lastAction?.authorName).toBe('Système')
    expect(view.lastAction?.dateLabel).toMatch(/2026/)
  })

  it('returns null lastAction when missing', () => {
    expect(toMissionQuickView({ ...entity, lastActivity: null }).lastAction).toBeNull()
  })
})
