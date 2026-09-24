import { describe, expect, it } from 'vitest'
import {
  buildCandidatsTabHref,
  CANDIDAT_TAB_ITEMS,
  legacyProfilsAppRedirect,
  parseCandidatsTab,
} from './candidats-tab'

describe('candidats-tab', () => {
  it('lists CVthèque and inbox only — no Profils app', () => {
    expect(CANDIDAT_TAB_ITEMS.map((t) => t.id)).toEqual(['cvtheque', 'inbox'])
    expect(CANDIDAT_TAB_ITEMS.some((t) => t.label === 'Profils app')).toBe(false)
  })

  it('parses legacy app-profiles as cvtheque fallback', () => {
    expect(parseCandidatsTab('app-profiles')).toBe('cvtheque')
  })

  it('redirects legacy Profils app URLs to Entrées app', () => {
    expect(legacyProfilsAppRedirect('app-profiles')).toBe('/interim/entrees-app')
    expect(legacyProfilsAppRedirect('/candidats/profils-app/x')).toBe('/interim/entrees-app')
    expect(legacyProfilsAppRedirect('/candidats/profils-app/x/convert')).toBe(
      '/interim/entrees-app',
    )
    expect(legacyProfilsAppRedirect('inbox')).toBe(null)
  })

  it('builds href without app-profiles tab', () => {
    expect(buildCandidatsTabHref('inbox', '')).toBe('/candidats?tab=inbox')
    expect(buildCandidatsTabHref('cvtheque', '')).toBe('/candidats')
  })
})
