// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveJobTitleId, resolveSoftwareId } from './resolve-referential'

const jobTitles = [
  { id: 'jt-autre', name: 'Autre' },
  { id: 'jt-conseiller', name: 'Conseiller parapharmacie' },
  { id: 'jt-pharmacien', name: 'Pharmacien' },
  { id: 'jt-preparateur', name: 'Préparateur' },
  { id: 'jt-rayonniste', name: 'Rayonniste' },
  { id: 'jt-etudiant', name: 'Étudiant en pharmacie' },
]

const softwares = [
  { id: 'sw-leo', name: 'LEO' },
  { id: 'sw-lgpi', name: 'LGPI' },
  { id: 'sw-smart', name: 'Smart Rx' },
  { id: 'sw-winpharma', name: 'Winpharma' },
]

describe('resolveJobTitleId', () => {
  it.each([
    ['Préparateur Débutant', 'jt-preparateur'],
    ['Préparateur Expert', 'jt-preparateur'],
    ['Pharmacien Confirmé', 'jt-pharmacien'],
    ['Rayonniste / réceptionnaire', 'jt-rayonniste'],
    ['Conseiller en parapharmacie', 'jt-conseiller'],
    ['Etudiant en pharmacie 4A', 'jt-etudiant'],
  ])('maps the Badakan activity %s', (label, expected) => {
    expect(resolveJobTitleId(label, jobTitles)).toBe(expected)
  })

  it('prefers the most specific job title over a shorter one', () => {
    expect(resolveJobTitleId('Etudiant en pharmacie 4A', jobTitles)).not.toBe('jt-pharmacien')
  })

  it('gives up on an unknown activity rather than guessing Autre', () => {
    expect(resolveJobTitleId('Ninja du comptoir', jobTitles)).toBeNull()
    expect(resolveJobTitleId(null, jobTitles)).toBeNull()
  })
})

describe('resolveSoftwareId', () => {
  it.each([
    ['LGPI', 'sw-lgpi'],
    ['lgpi', 'sw-lgpi'],
    ['logiciel : LGPI', 'sw-lgpi'],
    ['LGPI + PDA', 'sw-lgpi'],
    ['WINPHARMA', 'sw-winpharma'],
    ['Logiciel : Léo', 'sw-leo'],
    ['SMART RX', 'sw-smart'],
  ])('reads the LGO out of the free-text instruction %s', (instruction, expected) => {
    expect(resolveSoftwareId(instruction, softwares)).toBe(expected)
  })

  it('stays empty when the instruction talks about anything else', () => {
    expect(resolveSoftwareId('il faut être gentil !', softwares)).toBeNull()
    expect(resolveSoftwareId('Temps plein 35H par semaine', softwares)).toBeNull()
    expect(resolveSoftwareId(null, softwares)).toBeNull()
  })
})
