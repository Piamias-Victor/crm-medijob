// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  MANUAL_CANDIDATE_STATUSES,
  toEffectiveCandidateStatus,
} from '@/view-models/candidate-status'

describe('toEffectiveCandidateStatus', () => {
  it('create default stocké Nouveau reste Nouveau sans mission', () => {
    expect(toEffectiveCandidateStatus('NOUVEAU', false)).toBe('NOUVEAU')
  })

  it('positionnement actif → En mission si statut non override', () => {
    expect(toEffectiveCandidateStatus('QUALIFIE', true)).toBe('EN_MISSION')
    expect(toEffectiveCandidateStatus('NOUVEAU', true)).toBe('EN_MISSION')
    expect(toEffectiveCandidateStatus('A_QUALIFIER', true)).toBe('EN_MISSION')
  })

  it('Blacklisté / Inactif gagnent malgré mission active', () => {
    expect(toEffectiveCandidateStatus('BLACKLISTE', true)).toBe('BLACKLISTE')
    expect(toEffectiveCandidateStatus('INACTIF', true)).toBe('INACTIF')
  })

  it('plus de mission active → statut stocké', () => {
    expect(toEffectiveCandidateStatus('QUALIFIE', false)).toBe('QUALIFIE')
  })

  it('sélecteur manuel exclut En mission', () => {
    expect(MANUAL_CANDIDATE_STATUSES).not.toContain('EN_MISSION')
    expect(MANUAL_CANDIDATE_STATUSES).toEqual([
      'NOUVEAU',
      'A_QUALIFIER',
      'QUALIFIE',
      'INACTIF',
      'BLACKLISTE',
    ])
  })
})
