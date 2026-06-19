import { describe, it, expect } from 'vitest'
import { toMissionDetail } from '@/view-models/mission-detail'
import type { MissionDetailEntity } from '@/view-models/mission-detail.types'

const entity: MissionDetailEntity = {
  id: 'm1',
  title: 'Titulaire CDI',
  description: 'Poste principal',
  contractType: 'CDI',
  startDate: new Date('2026-03-01'),
  endDate: null,
  status: 'A_POURVOIR',
  salaireMin: 3500,
  salaireMax: 4200,
  salaireNotes: null,
  heuresParSemaine: 35,
  planning: 'Jour',
  tempsPlein: true,
  notes: null,
  pharmacyId: 'p1',
  contactId: 'c1',
  referentId: 'u1',
  jobTitleId: 'jt1',
  updatedAt: new Date('2026-02-01'),
  pharmacy: { name: 'Pharmacie du Centre', city: 'Lyon' },
  jobTitle: { name: 'Pharmacien' },
  referent: { name: 'Réf Demo' },
  contact: { id: 'c1', firstName: 'Marie', lastName: 'Curie' },
  candidates: [
    { candidateId: 'ca1', candidate: { firstName: 'Alice', lastName: 'Martin' } },
    { candidateId: 'ca2', candidate: { firstName: 'Bob', lastName: 'Durand' } },
  ],
}

describe('toMissionDetail', () => {
  it('maps mission detail with candidates for status actions', () => {
    const payload = toMissionDetail(entity)
    expect(payload.pharmacyName).toBe('Pharmacie du Centre')
    expect(payload.formSource.title).toBe('Titulaire CDI')
    expect(payload.formSource.contactId).toBe('c1')
    expect(payload.candidates).toEqual([
      { id: 'ca1', fullName: 'Alice Martin' },
      { id: 'ca2', fullName: 'Bob Durand' },
    ])
  })
})
