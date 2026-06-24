import { describe, it, expect } from 'vitest'
import {
  buildCandidatsTabHref,
  candidatsNavHref,
  candidatsPageHref,
  parseCandidatsTab,
} from './candidats-tab'

describe('parseCandidatsTab', () => {
  it('parse inbox', () => {
    expect(parseCandidatsTab('inbox')).toBe('inbox')
    expect(parseCandidatsTab(undefined)).toBe('cvtheque')
  })
})

describe('candidatsPageHref', () => {
  it('build inbox and cvtheque hrefs', () => {
    expect(candidatsPageHref('inbox')).toBe('/candidats?tab=inbox')
    expect(candidatsPageHref('cvtheque')).toBe('/candidats')
  })
})

describe('buildCandidatsTabHref', () => {
  it('conserve filtres existants en changeant onglet', () => {
    expect(buildCandidatsTabHref('inbox', 'metier=jt1')).toBe('/candidats?metier=jt1&tab=inbox')
    expect(buildCandidatsTabHref('cvtheque', 'metier=jt1&tab=inbox')).toBe('/candidats?metier=jt1')
  })
})

describe('candidatsNavHref', () => {
  it('priorise inbox si candidatures en attente', () => {
    expect(candidatsNavHref(3)).toBe('/candidats?tab=inbox')
    expect(candidatsNavHref(0)).toBe('/candidats')
  })
})
