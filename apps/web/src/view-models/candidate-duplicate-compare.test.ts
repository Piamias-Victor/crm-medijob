import { describe, it, expect } from 'vitest'
import {
  toDuplicateRowFromInput,
  toProfileInputFromDuplicateRow,
} from '@/view-models/candidate-duplicate-compare'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'

const baseIncoming = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille.durand@email.fr',
  phone: '0611223301',
  address: undefined,
  city: 'Lyon',
  postalCode: '69003',
  jobTitleId: 'jt-1',
  status: 'NOUVEAU',
  salaryExpectations: undefined,
  salaryMin: null,
  salaryMax: null,
  softwareIds: [],
  contractTypes: ['CDI'],
  mobilityRadiusKm: 30,
  mobilityNotes: undefined,
  availableFrom: undefined,
  notes: undefined,
  referentId: null,
  consentGiven: true,
} satisfies CandidateCreateInput

describe('toProfileInputFromDuplicateRow', () => {
  it('keeps status so merge Zod parse succeeds', () => {
    const row = toDuplicateRowFromInput(baseIncoming)
    const parsed = toProfileInputFromDuplicateRow(row)
    expect(parsed.status).toBe('NOUVEAU')
    expect(parsed.firstName).toBe('Camille')
  })

  it('clamps mobilityRadiusKm 0 up to schema min 1', () => {
    const row = toDuplicateRowFromInput({ ...baseIncoming, mobilityRadiusKm: 0 })
    expect(toProfileInputFromDuplicateRow(row).mobilityRadiusKm).toBe(1)
  })
})
