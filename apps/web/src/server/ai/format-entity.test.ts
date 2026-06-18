// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { formatCandidate, formatPharmacy, formatMission } from './format-entity'

describe('format-entity', () => {
  it('formats a candidate with name and city', () => {
    const text = formatCandidate({
      firstName: 'Marie',
      lastName: 'Curie',
      city: 'Lille',
      cvSummary: 'Préparatrice expérimentée',
    })
    expect(text).toContain('Marie Curie')
    expect(text).toContain('Lille')
    expect(text).toContain('Préparatrice expérimentée')
  })

  it('formats a pharmacy with its name', () => {
    const text = formatPharmacy({ name: 'Pharmacie du Centre', city: 'Lyon' })
    expect(text).toContain('Pharmacie du Centre')
  })

  it('formats a mission with its title', () => {
    const text = formatMission({ title: 'CDD Préparateur', contractType: 'CDD' })
    expect(text).toContain('CDD Préparateur')
  })

  it('omits fields that are missing', () => {
    const text = formatCandidate({ firstName: 'Jean', lastName: 'Dupont' })
    expect(text).not.toContain('Ville')
  })
})
