import { describe, it, expect } from 'vitest'
import { parseMissionTab } from './mission-tab-parse'

describe('parseMissionTab', () => {
  it('accepts known tabs', () => {
    expect(parseMissionTab('offre')).toBe('offre')
    expect(parseMissionTab('devis')).toBe('devis')
  })

  it('falls back to infos', () => {
    expect(parseMissionTab('unknown')).toBe('infos')
    expect(parseMissionTab(undefined)).toBe('infos')
  })
})
