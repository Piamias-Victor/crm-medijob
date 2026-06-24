import { describe, expect, it } from 'vitest'
import { candidatsNavHref, candidatsPageHref, parseCandidatsTab } from './candidats-tab'

describe('parseCandidatsTab', () => {
  it('opens inbox when tab=inbox', () => {
    expect(parseCandidatsTab('inbox')).toBe('inbox')
  })

  it('defaults to cvtheque for unknown or missing tab', () => {
    expect(parseCandidatsTab(undefined)).toBe('cvtheque')
    expect(parseCandidatsTab('cvtheque')).toBe('cvtheque')
    expect(parseCandidatsTab('other')).toBe('cvtheque')
  })
})

describe('candidatsPageHref', () => {
  it('links inbox tile to the inbox tab', () => {
    expect(candidatsPageHref('inbox')).toBe('/candidats?tab=inbox')
    expect(candidatsPageHref('cvtheque')).toBe('/candidats')
  })
})

describe('candidatsNavHref', () => {
  it('links to inbox when pending applications exist', () => {
    expect(candidatsNavHref(3)).toBe('/candidats?tab=inbox')
  })

  it('links to cvtheque when inbox is empty', () => {
    expect(candidatsNavHref(0)).toBe('/candidats')
  })
})
