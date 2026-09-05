// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  matchesContract,
  matchesEnterprise,
  matchesMission,
  matchesNeed,
} from '@/lib/filters/badakan-interim-filters'

const mission = {
  id: 'm1',
  pharmacyName: 'Pharmacie Hermès',
  step: 'CANCELLED',
  stepLabel: 'Annulée',
  periodLabel: '03/03/2026',
  href: '/interim/missions/m1',
}

const need = {
  id: 'n1',
  pharmacyName: 'Pharmacie du Cygne',
  cityLabel: 'Strasbourg',
  postalCode: '67000',
  jobTitleLabel: 'Pharmacien',
  softwareLabel: 'LGPI',
  gapLabel: '0/1 pourvus',
  periodLabel: '10/09/2026',
  step: 'CANCELLED',
  stepLabel: 'Annulée',
  href: '/interim/missions/n1',
}

const contract = {
  id: 'c1',
  recipientName: 'Margo Rié',
  pharmacyName: 'Pharmacie du Parc',
  status: 'VALIDATED',
  statusLabel: 'Validé',
  pdfHref: null,
  dpaeHref: null,
}

const enterprise = {
  id: 'e1',
  name: 'MLM Investissements',
  siretLabel: '12345678900011',
  cityLabel: 'Paris',
  href: '/interim/officines/e1',
}

describe('matchesMission', () => {
  it('combines the search box and the step selection', () => {
    expect(matchesMission(mission, { q: 'herme', steps: ['CANCELLED'] })).toBe(true)
    expect(matchesMission(mission, { q: 'herme', steps: ['STAFFED'] })).toBe(false)
    expect(matchesMission(mission, { q: 'autre', steps: [] })).toBe(false)
  })
})

describe('matchesNeed', () => {
  const empty = { q: '', steps: [] as string[], ville: '', departement: [] as string[], metier: '' }

  it('filters by étape, ville, département and métier', () => {
    expect(matchesNeed(need, { ...empty, steps: ['CANCELLED'], ville: 'stras', metier: 'pharma' })).toBe(
      true,
    )
    expect(matchesNeed(need, { ...empty, steps: ['STAFFED'] })).toBe(false)
    expect(matchesNeed(need, { ...empty, departement: ['67'] })).toBe(true)
    expect(matchesNeed(need, { ...empty, departement: ['75'] })).toBe(false)
    expect(matchesNeed(need, { ...empty, ville: 'lyon' })).toBe(false)
  })
})

describe('matchesContract', () => {
  it('searches the candidate as well as the pharmacy', () => {
    expect(matchesContract(contract, { q: 'margo', statuses: [] })).toBe(true)
    expect(matchesContract(contract, { q: 'parc', statuses: ['VALIDATED'] })).toBe(true)
    expect(matchesContract(contract, { q: '', statuses: ['CANCELLED'] })).toBe(false)
  })
})

describe('matchesEnterprise', () => {
  it('searches name, city and SIRET', () => {
    expect(matchesEnterprise(enterprise, { q: 'paris' })).toBe(true)
    expect(matchesEnterprise(enterprise, { q: '123456' })).toBe(true)
    expect(matchesEnterprise(enterprise, { q: 'lyon' })).toBe(false)
  })
})

describe('matchesContract', () => {
  it('searches the candidate as well as the pharmacy', () => {
    expect(matchesContract(contract, { q: 'margo', statuses: [] })).toBe(true)
    expect(matchesContract(contract, { q: 'parc', statuses: ['VALIDATED'] })).toBe(true)
    expect(matchesContract(contract, { q: '', statuses: ['CANCELLED'] })).toBe(false)
  })
})

describe('matchesEnterprise', () => {
  it('searches name, city and SIRET', () => {
    expect(matchesEnterprise(enterprise, { q: 'paris' })).toBe(true)
    expect(matchesEnterprise(enterprise, { q: '123456' })).toBe(true)
    expect(matchesEnterprise(enterprise, { q: 'lyon' })).toBe(false)
  })
})
