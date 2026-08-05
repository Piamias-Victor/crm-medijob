import { describe, expect, it } from 'vitest'
import { buildCandidatsTabHref, parseCandidatsTab } from './candidats-tab'

describe('candidats-tab', () => {
  it('parses app-profiles tab', () => {
    expect(parseCandidatsTab('app-profiles')).toBe('app-profiles')
  })

  it('builds href for app-profiles', () => {
    expect(buildCandidatsTabHref('app-profiles', '')).toBe('/candidats?tab=app-profiles')
  })
})
