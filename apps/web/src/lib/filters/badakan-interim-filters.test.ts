// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { matchesContract, matchesEnterprise, matchesMission } from '@/lib/filters/badakan-interim-filters'
import {
  contractFilterRow,
  enterpriseFilterRow,
  missionFilterRow,
} from '@/lib/filters/badakan-interim-filters.fixtures'

describe('matchesMission', () => {
  it('combines the search box and the step selection', () => {
    expect(matchesMission(missionFilterRow, { q: 'herme', steps: ['CANCELLED'] })).toBe(true)
    expect(matchesMission(missionFilterRow, { q: 'herme', steps: ['STAFFED'] })).toBe(false)
    expect(matchesMission(missionFilterRow, { q: 'autre', steps: [] })).toBe(false)
  })
})

describe('matchesContract', () => {
  it('searches the candidate as well as the pharmacy', () => {
    expect(matchesContract(contractFilterRow, { q: 'margo', statuses: [] })).toBe(true)
    expect(matchesContract(contractFilterRow, { q: 'parc', statuses: ['VALIDATED'] })).toBe(true)
    expect(matchesContract(contractFilterRow, { q: '', statuses: ['CANCELLED'] })).toBe(false)
  })
})

describe('matchesEnterprise', () => {
  it('searches name, city and SIRET', () => {
    expect(matchesEnterprise(enterpriseFilterRow, { q: 'paris' })).toBe(true)
    expect(matchesEnterprise(enterpriseFilterRow, { q: '123456' })).toBe(true)
    expect(matchesEnterprise(enterpriseFilterRow, { q: 'lyon' })).toBe(false)
  })
})
