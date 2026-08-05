// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { toAnonymizedInput } from '@/server/routers/candidate-documents-input'

const base = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: '0612345678',
  address: '12 rue Test',
  city: 'Lyon',
  postalCode: '69001',
  notes: '5 ans en officine',
  cvSummary: null as string | null,
  anonymizedProfile: null as string | null,
  jobTitle: { name: 'Pharmacien' },
  mobilityRadiusKm: 30,
  mobilityNotes: 'Rhône-Alpes',
  availableFrom: null,
  softwares: [{ software: { name: 'Winpharma' } }],
}

describe('toAnonymizedInput', () => {
  it('builds input without cvSummary using notes as fallback context', () => {
    const input = toAnonymizedInput(base)
    expect(input.cvSummary).toBe('')
    expect(input.notes).toBe('5 ans en officine')
    expect(input.jobTitleName).toBe('Pharmacien')
  })

  it('prefers cvSummary when present', () => {
    const input = toAnonymizedInput({ ...base, cvSummary: 'Résumé IA' })
    expect(input.cvSummary).toBe('Résumé IA')
  })
})
